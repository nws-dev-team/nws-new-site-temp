import { NextResponse } from 'next/server'
import {
  parseSystem,
  type RawSystem,
  type WaterReport,
  type WaterSystemResult,
} from '@/lib/water-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ECHO_BASE = 'https://echodata.epa.gov/echo'

async function fetchJson(url: string, timeoutMs = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

interface Place {
  city: string
  state: string
  lat?: string
  lon?: string
  county?: string
}

// Step 1: resolve a US ZIP code to a city + state (+ coordinates).
async function zipToPlace(zip: string): Promise<Place | null> {
  try {
    const data = await fetchJson(`https://api.zippopotam.us/us/${zip}`)
    const place = data?.places?.[0]
    if (!place) return null
    return {
      city: place['place name'] as string,
      state: place['state abbreviation'] as string,
      lat: place['latitude'],
      lon: place['longitude'],
    }
  } catch {
    return null
  }
}

// Step 2: turn coordinates into a county name (EPA matches best on county).
async function coordsToCounty(lat: string, lon: string): Promise<string | null> {
  try {
    const data = await fetchJson(
      `https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`,
    )
    const name: string | undefined = data?.County?.name
    if (!name) return null
    // EPA stores county without the trailing "County" suffix.
    return name.replace(/\s+County$/i, '').trim()
  } catch {
    return null
  }
}

async function runQuery(params: URLSearchParams): Promise<RawSystem[]> {
  const first = await fetchJson(`${ECHO_BASE}/sdw_rest_services.get_systems?${params}`)
  const qid = first?.Results?.QueryID
  const rows = Number(first?.Results?.QueryRows) || 0
  if (!qid || rows === 0) return []

  const qParams = new URLSearchParams({
    output: 'JSON',
    qid: String(qid),
    responseset: '500',
  })
  const second = await fetchJson(`${ECHO_BASE}/sdw_rest_services.get_qid?${qParams}`)
  const systems = second?.Results?.WaterSystems
  return Array.isArray(systems) ? systems : []
}

// Step 3: query EPA ECHO, preferring county search, falling back to city.
async function fetchSystems(place: Place): Promise<RawSystem[]> {
  if (place.county) {
    const byCounty = await runQuery(
      new URLSearchParams({ output: 'JSON', p_co: place.county, p_st: place.state }),
    )
    if (byCounty.length > 0) return byCounty
  }
  return runQuery(
    new URLSearchParams({ output: 'JSON', p_ct: place.city, p_st: place.state }),
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = (searchParams.get('zip') || '').trim()

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: 'Please enter a valid 5-digit US ZIP code.' },
      { status: 400 },
    )
  }

  const place = await zipToPlace(zip)
  if (!place) {
    return NextResponse.json(
      { error: `We couldn't find the location for ZIP ${zip}. Please double-check it.` },
      { status: 404 },
    )
  }

  if (place.lat && place.lon) {
    place.county = (await coordsToCounty(place.lat, place.lon)) ?? undefined
  }

  let rawSystems: RawSystem[]
  try {
    rawSystems = await fetchSystems(place)
  } catch {
    return NextResponse.json(
      { error: 'The EPA water database is temporarily unavailable. Please try again in a moment.' },
      { status: 502 },
    )
  }

  // Prefer active Community Water Systems (the ones that serve homes).
  const active = rawSystems.filter((s) => s.PWSActivityCode === 'A')
  const community = active.filter((s) => s.PWSTypeCode === 'CWS')
  const pool = community.length > 0 ? community : active.length > 0 ? active : rawSystems

  const parsed: WaterSystemResult[] = pool
    .map(parseSystem)
    .sort((a, b) => b.populationServed - a.populationServed)

  const report: WaterReport = {
    location: { city: place.city, state: place.state, zip },
    featured: parsed[0] ?? null,
    others: parsed.slice(1, 8),
    totalSystems: parsed.length,
  }

  return NextResponse.json(report)
}
