// License & Trial Management System
// Stored in localStorage for client-side persistence

export const TRIAL_LIMIT = 3

const KEYS = {
  LICENSE: 'ai_studio_license_key',
  TRIAL_COUNT: 'ai_studio_trial_count',
  GEMINI_KEY: 'ai_studio_gemini_key',
}

export type Plan = 'trial' | 'basic' | 'pro' | 'enterprise'

export interface LicenseStatus {
  isLicensed: boolean
  plan: Plan
  trialsRemaining: number
  trialsUsed: number
  licenseKey: string | null
  geminiApiKey: string | null
  canGenerate: boolean
}

/** Validate format: AIPRO-XXXX-XXXX-XXXX */
export function validateLicenseFormat(key: string): boolean {
  return /^AIPRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(key.trim())
}

function detectPlan(key: string): Plan {
  const k = key.toUpperCase()
  if (k.startsWith('AIPRO-ENT')) return 'enterprise'
  if (k.startsWith('AIPRO-PRO')) return 'pro'
  return 'basic'
}

function safeGet(key: string): string {
  try { return localStorage.getItem(key) ?? '' } catch { return '' }
}

function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}

export function getLicenseStatus(): LicenseStatus {
  if (typeof window === 'undefined') {
    return {
      isLicensed: false, plan: 'trial',
      trialsRemaining: TRIAL_LIMIT, trialsUsed: 0,
      licenseKey: null, geminiApiKey: null, canGenerate: true,
    }
  }

  const storedKey = safeGet(KEYS.LICENSE)
  const trialCount = parseInt(safeGet(KEYS.TRIAL_COUNT) || '0', 10)
  const geminiApiKey = safeGet(KEYS.GEMINI_KEY) || null
  const isLicensed = validateLicenseFormat(storedKey)
  const trialsRemaining = Math.max(0, TRIAL_LIMIT - trialCount)

  return {
    isLicensed,
    plan: isLicensed ? detectPlan(storedKey) : 'trial',
    trialsRemaining,
    trialsUsed: trialCount,
    licenseKey: isLicensed ? storedKey.toUpperCase().trim() : null,
    geminiApiKey,
    canGenerate: isLicensed || trialsRemaining > 0,
  }
}

export function incrementTrialCount(): void {
  const count = parseInt(safeGet(KEYS.TRIAL_COUNT) || '0', 10)
  safeSet(KEYS.TRIAL_COUNT, String(count + 1))
}

/** Returns true if key is valid and was saved */
export function activateLicense(key: string): boolean {
  const clean = key.toUpperCase().trim()
  if (!validateLicenseFormat(clean)) return false
  safeSet(KEYS.LICENSE, clean)
  return true
}

export function saveGeminiKey(key: string): void {
  safeSet(KEYS.GEMINI_KEY, key.trim())
}

export function clearLicense(): void {
  safeSet(KEYS.LICENSE, '')
}
