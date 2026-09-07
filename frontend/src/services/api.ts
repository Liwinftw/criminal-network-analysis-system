/**
 * Centralised API client.
 * All calls go through this file — no scattered fetch/axios elsewhere.
 * Base URL is read from VITE_API_BASE_URL (default: http://127.0.0.1:8000).
 */

import axios from 'axios'
import type {
  HealthResponse,
  Person,
  NetworkResponse,
  AnalysisResponse,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Health ────────────────────────────────────────────────────────────────────

/** GET /health */
export async function getHealth(): Promise<HealthResponse> {
  const { data } = await client.get<HealthResponse>('/health')
  return data
}

// ── Persons ───────────────────────────────────────────────────────────────────

/** GET /persons — returns all persons */
export async function getPersons(): Promise<Person[]> {
  const { data } = await client.get<Person[]>('/persons')
  return data
}

/** GET /persons/{person_id} — returns one person or throws 404 */
export async function getPerson(personId: string): Promise<Person> {
  const { data } = await client.get<Person>(`/persons/${encodeURIComponent(personId)}`)
  return data
}

// ── Network ───────────────────────────────────────────────────────────────────

/** GET /network — returns the full relationship graph */
export async function getNetwork(): Promise<NetworkResponse> {
  const { data } = await client.get<NetworkResponse>('/network')
  return data
}

/** GET /network/{person_id} — returns the ego-network for one person */
export async function getPersonNetwork(personId: string): Promise<NetworkResponse> {
  const { data } = await client.get<NetworkResponse>(
    `/network/${encodeURIComponent(personId)}`
  )
  return data
}

// ── Analysis ──────────────────────────────────────────────────────────────────

/** GET /analysis/{person_id} — runs full ML analysis and returns profile */
export async function analyzePerson(personId: string): Promise<AnalysisResponse> {
  const { data } = await client.get<AnalysisResponse>(
    `/analysis/${encodeURIComponent(personId)}`
  )
  return data
}

// ── Re-export base URL for display purposes ───────────────────────────────────
export { BASE_URL }
