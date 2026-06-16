'use client'

import { useState } from 'react'
import { activateLicense, validateLicenseFormat, TRIAL_LIMIT } from '../_lib/license'

interface Props {
  trialsUsed: number
  onLicenseActivated: () => void
  onClose: () => void
}

const PRICING = [
  {
    name: 'Basic',
    price: 'Rp 149.000',
    period: 'sekali bayar',
    generations: '100 foto total (Akses Selamanya)',
    color: 'border-blue-500/30',
    badge: '',
  },
  {
    name: 'Pro',
    price: 'Rp 399.000',
    period: 'sekali bayar',
    generations: '1.000 foto total (Akses Selamanya)',
    color: 'border-violet-500/50',
    badge: '⭐ POPULER',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'sekali bayar',
    generations: 'Kuota khusus perusahaan',
    color: 'border-gold/30',
    badge: '',
  },
]

export default function PaywallModal({ trialsUsed, onLicenseActivated, onClose }: Props) {
  const [licenseInput, setLicenseInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'paywall' | 'activate'>('paywall')

  const handleActivate = () => {
    const trimmed = licenseInput.trim()
    if (!trimmed) {
      setStatus('error')
      setErrorMsg('Masukkan license key terlebih dahulu.')
      return
    }
    if (!validateLicenseFormat(trimmed)) {
      setStatus('error')
      setErrorMsg('Format tidak valid. Format yang benar: AIPRO-XXXX-XXXX-XXXX')
      return
    }
    const ok = activateLicense(trimmed)
    if (ok) {
      setStatus('success')
      setTimeout(() => {
        onLicenseActivated()
        onClose()
      }, 1500)
    } else {
      setStatus('error')
      setErrorMsg('License key tidak valid. Pastikan key yang Anda masukkan benar.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
      id="paywall-modal"
    >
      <div className="glass border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
            id="paywall-close-btn"
          >
            ✕
          </button>
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-white font-black text-xl mb-1">
            Uji Coba Habis!
          </h2>
          <p className="text-[#94a3b8] text-sm">
            Anda telah menggunakan <strong className="text-white">{trialsUsed} dari {TRIAL_LIMIT}</strong> generasi gratis.
            Beli lisensi untuk akses penuh tanpa batas.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          {(['paywall', 'activate'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              id={`paywall-tab-${tab}`}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-violet-500'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              {tab === 'paywall' ? '🛒 Beli Lisensi' : '🔑 Punya Lisensi?'}
            </button>
          ))}
        </div>

        {activeTab === 'paywall' ? (
          <div className="p-6">
            {/* Pricing cards */}
            <div className="space-y-3 mb-6">
              {PRICING.map(plan => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl glass-card border ${plan.color} p-4 flex items-center justify-between`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-black">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <p className="text-white font-bold">{plan.name}</p>
                    <p className="text-[#64748b] text-xs">{plan.generations}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black">{plan.price}</p>
                    <p className="text-[#64748b] text-xs">{plan.period}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to buy */}
            <div className="glass-card border border-white/[0.06] rounded-2xl p-4 mb-4">
              <p className="text-white font-bold text-sm mb-2">📋 Cara Beli:</p>
              <ol className="space-y-1.5 text-[#94a3b8] text-xs list-none">
                <li>1️⃣ Hubungi WhatsApp: <strong>0813-4373-7367</strong></li>
                <li>2️⃣ Lakukan pembayaran sesuai paket</li>
                <li>3️⃣ Terima license key via WhatsApp</li>
                <li>4️⃣ Masukkan key di tab &quot;Punya Lisensi?&quot;</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/6281343737367?text=Halo%20saya%20ingin%20membeli%20lisensi%20AI%20Studio%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                id="paywall-whatsapp-btn"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-all"
              >
                💬 WhatsApp
              </a>
              <button
                onClick={() => setActiveTab('activate')}
                id="paywall-have-key-btn"
                className="px-4 py-3 rounded-xl btn-primary font-bold text-sm"
              >
                🔑 Punya Key
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-white font-bold mb-1">Aktifkan License Key</h3>
            <p className="text-[#94a3b8] text-xs mb-5">
              Masukkan license key yang Anda terima setelah pembelian.
              Format: <span className="text-violet-400 font-mono">AIPRO-XXXX-XXXX-XXXX</span>
            </p>

            {/* Key Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                License Key
              </label>
              <input
                id="license-key-input"
                type="text"
                value={licenseInput}
                onChange={e => {
                  setLicenseInput(e.target.value)
                  setStatus('idle')
                }}
                placeholder="AIPRO-XXXX-XXXX-XXXX"
                className={`w-full glass border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-[#64748b] focus:outline-none transition-colors uppercase tracking-wider ${
                  status === 'error'
                    ? 'border-red-500/50 focus:border-red-500'
                    : status === 'success'
                    ? 'border-emerald-500/50'
                    : 'border-white/10 focus:border-violet-500/50'
                }`}
                onKeyDown={e => e.key === 'Enter' && handleActivate()}
              />
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-1.5">⚠️ {errorMsg}</p>
              )}
              {status === 'success' && (
                <p className="text-emerald-400 text-xs mt-1.5">✅ License berhasil diaktifkan!</p>
              )}
            </div>

            <button
              onClick={handleActivate}
              disabled={status === 'success'}
              id="activate-license-btn"
              className="w-full py-3.5 rounded-xl btn-primary font-black text-base disabled:opacity-50"
            >
              {status === 'success' ? '✅ Berhasil!' : '🔓 Aktifkan Lisensi'}
            </button>

            <p className="text-[#64748b] text-xs text-center mt-4">
              Belum punya lisensi?{' '}
              <button onClick={() => setActiveTab('paywall')} className="text-violet-400 hover:text-violet-300">
                Beli sekarang →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
