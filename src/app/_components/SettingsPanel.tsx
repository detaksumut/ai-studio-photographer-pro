'use client'

import { useState } from 'react'
import {
  getLicenseStatus,
  activateLicense,
  saveGeminiKey,
  clearLicense,
  validateLicenseFormat,
} from '../_lib/license'

interface Props {
  onClose: () => void
  onSettingsChanged: () => void
}

export default function SettingsPanel({ onClose, onSettingsChanged }: Props) {
  const status = getLicenseStatus()

  const [geminiKey, setGeminiKey] = useState(status.geminiApiKey ?? '')
  const [licenseKey, setLicenseKey] = useState(status.licenseKey ?? '')
  const [showGemini, setShowGemini] = useState(false)

  const [geminiSaved, setGeminiSaved] = useState(false)
  const [licenseStatus, setLicenseStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [licenseError, setLicenseError] = useState('')

  const handleSaveGemini = () => {
    saveGeminiKey(geminiKey)
    setGeminiSaved(true)
    setTimeout(() => setGeminiSaved(false), 2000)
    onSettingsChanged()
  }

  const handleActivateLicense = () => {
    const trimmed = licenseKey.trim()
    if (!trimmed) {
      setLicenseStatus('error')
      setLicenseError('Masukkan license key terlebih dahulu.')
      return
    }
    if (!validateLicenseFormat(trimmed)) {
      setLicenseStatus('error')
      setLicenseError('Format salah. Contoh: AIPRO-XXXX-XXXX-XXXX')
      return
    }
    const ok = activateLicense(trimmed)
    if (ok) {
      setLicenseStatus('success')
      onSettingsChanged()
    } else {
      setLicenseStatus('error')
      setLicenseError('License key tidak valid.')
    }
  }

  const handleClearLicense = () => {
    clearLicense()
    setLicenseKey('')
    setLicenseStatus('idle')
    onSettingsChanged()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center sm:justify-end bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      id="settings-overlay"
    >
      <div
        className="glass border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:w-[400px] sm:m-4 max-h-[90vh] overflow-y-auto animate-scale-in"
        id="settings-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-white font-bold">⚙️ Pengaturan</h2>
            <p className="text-[#64748b] text-xs mt-0.5">Konfigurasi AI & Lisensi</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
            id="settings-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Status Lisensi ── */}
          <div className={`rounded-2xl p-4 border ${
            status.isLicensed
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-white text-sm">
                {status.isLicensed ? '✅ Terlisensi' : '⏳ Uji Coba'}
              </p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                status.isLicensed
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {status.plan.toUpperCase()}
              </span>
            </div>
            {status.isLicensed ? (
              <p className="text-[#94a3b8] text-xs">Akses penuh aktif. Semua fitur tersedia.</p>
            ) : (
              <div>
                <p className="text-[#94a3b8] text-xs">
                  Sisa uji coba:{' '}
                  <strong className={status.trialsRemaining === 0 ? 'text-red-400' : 'text-white'}>
                    {status.trialsRemaining} generasi
                  </strong>
                </p>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                    style={{ width: `${(status.trialsUsed / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Gemini API Key ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="settings-gemini-key"
                className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest"
              >
                🤖 Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-xs hover:text-violet-300 transition-colors font-semibold"
              >
                Dapatkan di Google AI Studio →
              </a>
            </div>
            <p className="text-[#64748b] text-xs mb-3">
              Tambahkan API key Gemini untuk menggunakan AI generate yang sesungguhnya. Tanpa key, mode demo aktif.
            </p>
            <div className="relative">
              <input
                id="settings-gemini-key"
                type={showGemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-[#64748b] focus:outline-none focus:border-violet-500/50 transition-colors font-mono"
              />
              <button
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors text-sm"
                tabIndex={-1}
              >
                {showGemini ? '🙈' : '👁️'}
              </button>
            </div>
            <button
              onClick={handleSaveGemini}
              id="save-gemini-key-btn"
              className={`mt-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                geminiSaved
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                  : 'btn-primary'
              }`}
            >
              {geminiSaved ? '✅ Tersimpan!' : '💾 Simpan API Key'}
            </button>
          </div>

          {/* ── License Key ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="settings-license-key"
                className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest"
              >
                🔑 License Key
              </label>
              <a
                href="https://wa.me/6281343737367?text=Halo%20saya%20ingin%20membeli%20lisensi%20AI%20Studio%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-xs hover:text-violet-300 transition-colors font-semibold"
              >
                Beli via WhatsApp (0813-4373-7367) →
              </a>
            </div>
            <p className="text-[#64748b] text-xs mb-3">
              Masukkan license key yang diterima setelah pembelian.
              Format: <span className="text-violet-400 font-mono text-[11px]">AIPRO-XXXX-XXXX-XXXX</span>
            </p>
            <input
              id="settings-license-key"
              type="text"
              value={licenseKey}
              onChange={e => {
                setLicenseKey(e.target.value)
                setLicenseStatus('idle')
              }}
              placeholder="AIPRO-XXXX-XXXX-XXXX"
              className={`w-full glass border rounded-xl px-4 py-2.5 text-white font-mono text-sm placeholder-[#64748b] focus:outline-none transition-colors uppercase tracking-wider ${
                licenseStatus === 'error'
                  ? 'border-red-500/50'
                  : licenseStatus === 'success'
                  ? 'border-emerald-500/50'
                  : 'border-white/10 focus:border-violet-500/50'
              }`}
              onKeyDown={e => e.key === 'Enter' && handleActivateLicense()}
            />
            {licenseStatus === 'error' && (
              <p className="text-red-400 text-xs mt-1.5">⚠️ {licenseError}</p>
            )}
            {licenseStatus === 'success' && (
              <p className="text-emerald-400 text-xs mt-1.5">✅ Lisensi berhasil diaktifkan!</p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleActivateLicense}
                id="settings-activate-btn"
                className="flex-1 py-2.5 rounded-xl btn-primary font-bold text-sm"
              >
                🔓 Aktifkan
              </button>
              {status.isLicensed && (
                <button
                  onClick={handleClearLicense}
                  id="settings-clear-license-btn"
                  className="px-4 py-2.5 rounded-xl glass border border-red-500/20 text-red-400 hover:border-red-500/40 font-semibold text-sm transition-all"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>

          {/* ── Info Box ── */}
          <div className="glass-card border border-white/[0.06] rounded-2xl p-4 text-xs text-[#64748b] space-y-1">
            <p>💡 <strong className="text-white">Demo Mode</strong> — 3 generasi gratis tanpa API key</p>
            <p>🤖 <strong className="text-white">AI Mode</strong> — Gunakan Gemini API key Anda sendiri</p>
            <p>🔓 <strong className="text-white">Licensed</strong> — Akses penuh sesuai paket</p>
          </div>
        </div>
      </div>
    </div>
  )
}
