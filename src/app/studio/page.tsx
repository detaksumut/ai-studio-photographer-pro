'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  FORMAL_OPTIONS,
  REKREASI_OPTIONS,
  FUTURISTIK_OPTIONS,
  ERA_KLASIK_OPTIONS,
  ROMANTIS_OPTIONS,
  ORIGINAL_HD_OPTIONS,
  CUSTOM_AI_QUICK_PROMPTS,
  REKREASI_DESTINATIONS,
  REKREASI_CLOTHES,
  ERA_KLASIK_DECADES,
  ERA_KLASIK_FILTERS,
  MODIFICATION_SUGGESTIONS,
  type StyleCategory,
  type PromptOption,
} from '../_lib/prompts'
import {
  getLicenseStatus,
  incrementTrialCount,
  type LicenseStatus,
} from '../_lib/license'
import CameraCapture from '../_components/CameraCapture'
import PaywallModal from '../_components/PaywallModal'
import SettingsPanel from '../_components/SettingsPanel'

// ─── Types ───────────────────────────────────────────────────
interface GeneratedImage {
  id: string
  url: string
  style: StyleCategory
  optionLabel: string
  timestamp: Date
  prompt: string
  mode: 'ai' | 'mock'
}

// ─── Constants ───────────────────────────────────────────────
const MENU_TABS: { id: StyleCategory; label: string; icon: string }[] = [
  { id: 'original-hd', label: 'Original HD', icon: '✨' },
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'rekreasi', label: 'Rekreasi', icon: '🌏' },
  { id: 'futuristik', label: 'Futuristik', icon: '🚀' },
  { id: 'era-klasik', label: 'Era Klasik', icon: '🎞️' },
  { id: 'romantis', label: 'Romantis', icon: '🌸' },
  { id: 'custom', label: 'Custom AI', icon: '🤖' },
]

function getOptions(category: StyleCategory): PromptOption[] {
  switch (category) {
    case 'formal':      return FORMAL_OPTIONS
    case 'rekreasi':    return REKREASI_OPTIONS
    case 'futuristik':  return FUTURISTIK_OPTIONS
    case 'era-klasik':  return ERA_KLASIK_OPTIONS
    case 'romantis':    return ROMANTIS_OPTIONS
    case 'original-hd': return ORIGINAL_HD_OPTIONS
    default:            return []
  }
}

// ─── Main Component ───────────────────────────────────────────
export default function StudioPage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<StyleCategory>('original-hd')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  // Submenu states
  const [formalGender, setFormalGender] = useState<'pria' | 'wanita'>('pria')
  const [recreationClothes, setRecreationClothes] = useState<string>('casual')
  const [eraClassicFilter, setEraClassicFilter] = useState<string>('kodak')

  // Liked generated image IDs
  const [likedImages, setLikedImages] = useState<string[]>([])
  
  // Modification states (Ganti/Edit)
  const [showModification, setShowModification] = useState(false)
  const [modificationInput, setModificationInput] = useState('')

  // New modals
  const [showCamera, setShowCamera] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [license, setLicense] = useState<LicenseStatus | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load license on mount (client only)
  useEffect(() => {
    setLicense(getLicenseStatus())
  }, [])

  const refreshLicense = useCallback(() => {
    setLicense(getLicenseStatus())
  }, [])

  // Sensible defaults on menu change
  useEffect(() => {
    if (selectedMenu === 'formal') {
      setSelectedOption(formalGender === 'pria' ? 'ceo' : 'blazer')
    } else if (selectedMenu === 'rekreasi') {
      setSelectedOption('bali')
      setRecreationClothes('casual')
    } else if (selectedMenu === 'era-klasik') {
      setSelectedOption('1960')
      setEraClassicFilter('kodak')
    } else {
      const opts = getOptions(selectedMenu)
      if (opts.length > 0) {
        setSelectedOption(opts[0].id)
      } else {
        setSelectedOption(null)
      }
    }
  }, [selectedMenu, formalGender])

  // ── Upload Handlers ──────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang didukung (JPG, PNG, WEBP, dll)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = e => {
      setUploadedPhoto(e.target?.result as string)
      setGeneratedImages([])
      setCurrentImage(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  // ── Camera Capture ───────────────────────────────────────
  const handleCameraCapture = (dataUrl: string) => {
    setUploadedPhoto(dataUrl)
    setGeneratedImages([])
    setCurrentImage(null)
    setShowCamera(false)
  }

  // ── Generate ─────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!uploadedPhoto) {
      alert('Silakan upload foto terlebih dahulu.')
      return
    }
    if (selectedMenu !== 'custom' && !selectedOption) {
      alert('Silakan pilih gaya/tema yang diinginkan.')
      return
    }
    if (selectedMenu === 'custom' && !customPrompt.trim()) {
      alert('Silakan ketik perintah Anda.')
      return
    }

    // ── Trial / License Check ──
    const currentLicense = getLicenseStatus()
    if (!currentLicense.canGenerate) {
      setShowPaywall(true)
      return
    }

    setIsGenerating(true)
    setGenerateError(null)

    try {
      let optionLabel = ''
      if (selectedMenu === 'custom') {
        optionLabel = customPrompt
      } else if (selectedMenu === 'rekreasi') {
        const dest = REKREASI_DESTINATIONS.find(d => d.id === selectedOption)?.label ?? ''
        const cloth = REKREASI_CLOTHES.find(c => c.id === recreationClothes)?.label ?? ''
        optionLabel = `${dest} (${cloth})`
      } else if (selectedMenu === 'era-klasik') {
        const dec = ERA_KLASIK_DECADES.find(d => d.id === selectedOption)?.label ?? ''
        const filt = ERA_KLASIK_FILTERS.find(f => f.id === eraClassicFilter)?.label ?? ''
        optionLabel = `Era ${dec}an (${filt})`
      } else {
        const optList = getOptions(selectedMenu)
        optionLabel = optList.find(o => o.id === selectedOption)?.label ?? selectedOption ?? ''
      }

      const geminiKey = currentLicense.geminiApiKey

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiKey ? { 'X-Gemini-Key': geminiKey } : {}),
        },
        body: JSON.stringify({
          imageData: uploadedPhoto,
          style: selectedMenu,
          option: selectedOption,
          customPrompt,
          recreationClothes: selectedMenu === 'rekreasi' ? recreationClothes : null,
          eraClassicFilter: selectedMenu === 'era-klasik' ? eraClassicFilter : null,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Generate gagal')
      }

      // Increment trial count only on success
      if (!currentLicense.isLicensed) {
        incrementTrialCount()
        refreshLicense()
      }

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        style: selectedMenu,
        optionLabel,
        timestamp: new Date(),
        prompt: data.prompt ?? '',
        mode: data.mode ?? 'mock',
      }

      setGeneratedImages(prev => [newImage, ...prev])
      setCurrentImage(newImage)

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      setGenerateError(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Ganti/Modify Generate ────────────────────────────────
  const handleModifyGenerate = async (instruction: string) => {
    if (!uploadedPhoto) {
      alert('Silakan upload foto terlebih dahulu.')
      return
    }
    const currentLicense = getLicenseStatus()
    if (!currentLicense.canGenerate) {
      setShowPaywall(true)
      return
    }

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const geminiKey = currentLicense.geminiApiKey

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiKey ? { 'X-Gemini-Key': geminiKey } : {}),
        },
        body: JSON.stringify({
          imageData: uploadedPhoto, // locking identity from the original photo!
          style: 'custom',
          option: null,
          customPrompt: instruction,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Modifikasi gagal')
      }

      if (!currentLicense.isLicensed) {
        incrementTrialCount()
        refreshLicense()
      }

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        style: 'custom',
        optionLabel: instruction,
        timestamp: new Date(),
        prompt: data.prompt ?? '',
        mode: data.mode ?? 'mock',
      }

      setGeneratedImages(prev => [newImage, ...prev])
      setCurrentImage(newImage)
      setModificationInput('')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      setGenerateError(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a')
    a.href = img.url
    a.download = `ai-studio-${img.optionLabel.replace(/\s+/g, '-')}-${img.id}.jpg`
    a.click()
  }

  const options = getOptions(selectedMenu)

  // Trial indicator
  const trialsLeft = license?.trialsRemaining ?? 3
  const isLicensed = license?.isLicensed ?? false

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col text-slate-100 selection:bg-violet-500/30 selection:text-white">
      {/* ── Top Nav ── */}
      <header className="glass border-b border-white/[0.06] sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" id="studio-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">AI</span>
            </div>
            <span className="font-bold text-white hidden sm:block" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Studio<span className="gradient-text">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* AI status */}
            {isGenerating && (
              <span className="hidden sm:flex items-center gap-2 text-violet-400 text-xs">
                <span className="flex gap-1">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                </span>
                AI sedang bekerja…
              </span>
            )}

            {/* Trial badge */}
            {license !== null && !isLicensed && (
              <button
                onClick={() => setShowPaywall(true)}
                id="trial-badge"
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  trialsLeft === 0
                    ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
                    : trialsLeft === 1
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-white/5 border-white/10 text-[#94a3b8]'
                }`}
              >
                {trialsLeft === 0 ? '🔒 Uji coba habis' : `⏳ ${trialsLeft} sisa`}
              </button>
            )}

            {/* Licensed badge */}
            {isLicensed && (
              <span id="licensed-badge" className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                ✅ {license?.plan?.toUpperCase()}
              </span>
            )}

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              id="settings-btn"
              className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-white/20 transition-all"
              title="Pengaturan"
            >
              ⚙️
            </button>
          </div>

          <Link
            href="/"
            className="text-xs text-[#64748b] hover:text-white transition-colors hidden sm:block"
            id="studio-back-home"
          >
            ← Beranda
          </Link>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row gap-0 lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="lg:w-80 xl:w-96 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#0b0f1a] lg:h-full lg:overflow-y-auto">

          {/* Upload Zone */}
          <div className="p-4 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-3">📸 Foto Anda</p>

            {uploadedPhoto ? (
              <div className="relative group rounded-2xl overflow-hidden aspect-[2/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedPhoto}
                  alt="Foto yang diupload"
                  className="w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl glass border border-white/20 text-white text-sm font-semibold w-40"
                    id="change-photo-gallery-btn"
                  >
                    🖼️ Dari Galeri
                  </button>
                  <button
                    onClick={() => setShowCamera(true)}
                    className="px-4 py-2 rounded-xl glass border border-violet-500/40 text-violet-300 text-sm font-semibold w-40"
                    id="change-photo-camera-btn"
                  >
                    📸 Ambil Selfie
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold">
                    ✓ Ready
                  </span>
                </div>
              </div>
            ) : (
              /* Upload + Camera options */
              <div className="space-y-3">
                {/* Camera button */}
                <button
                  onClick={() => setShowCamera(true)}
                  id="open-camera-btn"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 text-white font-semibold text-sm hover:border-violet-500/60 transition-all hover:scale-[1.02]"
                >
                  <span className="text-xl">📸</span> Ambil Selfie / Foto
                </button>

                {/* Drag & drop zone */}
                <div
                  id="upload-zone"
                  className={`upload-zone rounded-2xl aspect-[2/3] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <div className="text-5xl">{dragOver ? '📂' : '🖼️'}</div>
                  <div className="text-center px-4">
                    <p className="text-white font-semibold text-sm">Dari Galeri / File</p>
                    <p className="text-[#64748b] text-xs mt-1">Drag & drop atau klik pilih foto</p>
                    <p className="text-[#64748b] text-[10px] mt-2">JPG · PNG · WEBP · Max 10MB</p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInput}
              id="file-input"
            />
          </div>

          {/* Version History */}
          {generatedImages.length > 0 && (
            <div className="p-4 border-b border-white/[0.06]">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="flex items-center justify-between w-full text-xs font-bold text-[#64748b] uppercase tracking-widest"
                id="version-history-toggle"
              >
                <span>🕐 Riwayat ({generatedImages.length})</span>
                <span className={`transition-transform ${showVersionHistory ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showVersionHistory && (
                <div className="mt-3 space-y-2 animate-fade-in max-h-60 overflow-y-auto pr-1">
                  {generatedImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentImage?.id === img.id
                          ? 'bg-violet-500/15 border border-violet-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.optionLabel} className="w-10 shrink-0 rounded-lg object-cover" style={{ height: '52px' }} />
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">V{generatedImages.length - i}: {img.optionLabel}</p>
                        <p className="text-[#64748b] text-[10px]">{img.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <div className="p-4 mt-auto">
            {/* Trial warning */}
            {license !== null && !isLicensed && trialsLeft <= 1 && trialsLeft > 0 && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs text-center font-semibold">
                ⚠️ Sisa {trialsLeft} uji coba gratis
              </div>
            )}

            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !uploadedPhoto}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                !uploadedPhoto || isGenerating
                  ? 'bg-white/5 text-[#64748b] cursor-not-allowed border border-white/5'
                  : trialsLeft === 0 && !isLicensed
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90 shadow-lg shadow-red-500/10'
                  : 'btn-primary shadow-lg shadow-violet-500/20 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="flex gap-1">
                    <span className="typing-dot w-2 h-2 rounded-full bg-current inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-current inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-current inline-block" />
                  </span>
                  AI Bekerja…
                </span>
              ) : trialsLeft === 0 && !isLicensed ? (
                '🔒 Beli Lisensi'
              ) : (
                '⚡ Generate Foto'
              )}
            </button>

            {generateError && (
              <p className="text-red-400 text-xs mt-2 text-center font-medium">{generateError}</p>
            )}
            {!uploadedPhoto && (
              <p className="text-[#64748b] text-xs mt-2 text-center">Upload foto dulu untuk mulai</p>
            )}
          </div>
        </aside>

        {/* ── CENTER/RIGHT: Options + Results ── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#080b14] lg:h-full lg:overflow-y-auto">

          {/* Menu Tab Bar */}
          <div className="border-b border-white/[0.06] px-4 overflow-x-auto bg-[#0b0f1a]">
            <div className="flex gap-1 min-w-max">
              {MENU_TABS.map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => { setSelectedMenu(tab.id); setSelectedOption(null) }}
                  className={`tab-item flex items-center gap-1.5 px-4 py-4 text-sm font-semibold text-[#94a3b8] hover:text-white transition-colors relative ${selectedMenu === tab.id ? 'active text-white' : ''}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {selectedMenu === tab.id && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Options Panel */}
          <div className="p-4 sm:p-6 border-b border-white/[0.06] bg-[#090d18]">
            {/* Custom AI menu (menu 7) */}
            {selectedMenu === 'custom' && (
              <div className="max-w-2xl animate-fade-in" id="custom-ai-panel">
                <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <span>🤖</span> Custom AI
                </h2>
                <p className="text-[#94a3b8] text-sm mb-4">Tulis instruksi dalam Bahasa Indonesia — AI otomatis membuat prompt profesional.</p>
                <textarea
                  id="custom-prompt-input"
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder='Contoh: "jadi presiden" atau "jadi pebisnis sukses di helipad"'
                  className="w-full glass border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#64748b] text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                  rows={4}
                />
                <div className="mt-3">
                  <p className="text-xs text-[#64748b] mb-2 font-semibold">Ide cepat (klik untuk mengisi):</p>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_AI_QUICK_PROMPTS.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => setCustomPrompt(prompt)}
                        className="px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-[#94a3b8] hover:text-white hover:border-white/20 transition-all font-semibold"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rekreasi menu (menu 3) */}
            {selectedMenu === 'rekreasi' && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <span>🌏</span> Rekreasi
                </h2>
                
                <div>
                  <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">🏖️ 1. Pilih Destinasi Wisata</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {REKREASI_DESTINATIONS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedOption(d.id)}
                        className={`glass-card border rounded-2xl p-3 text-center transition-all ${
                          selectedOption === d.id 
                            ? 'border-violet-500 bg-violet-500/10 text-white font-bold scale-[1.02] shadow-lg shadow-violet-500/5' 
                            : 'border-white/10 hover:border-white/20 text-[#94a3b8]'
                        }`}
                      >
                        <div className="text-2xl mb-1">{d.emoji}</div>
                        <p className="text-xs">{d.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">🧥 2. Pilihan Pakaian</p>
                  <div className="flex flex-wrap gap-2">
                    {REKREASI_CLOTHES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setRecreationClothes(c.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          recreationClothes === c.id
                            ? 'bg-violet-600 border-violet-500 text-white shadow shadow-violet-500/20'
                            : 'bg-white/5 border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Era Klasik menu (menu 5) */}
            {selectedMenu === 'era-klasik' && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <span>🎞️</span> Era Klasik
                </h2>
                
                <div>
                  <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">📅 1. Pilih Dekade Era</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {ERA_KLASIK_DECADES.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedOption(d.id)}
                        className={`glass-card border rounded-2xl p-3.5 text-center transition-all ${
                          selectedOption === d.id 
                            ? 'border-violet-500 bg-violet-500/10 text-white font-bold scale-[1.02] shadow-lg shadow-violet-500/5' 
                            : 'border-white/10 hover:border-white/20 text-[#94a3b8]'
                        }`}
                      >
                        <div className="text-2xl mb-1">{d.emoji}</div>
                        <p className="text-xs font-semibold">{d.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">📸 2. Pilihan Filter</p>
                  <div className="flex flex-wrap gap-2">
                    {ERA_KLASIK_FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setEraClassicFilter(f.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          eraClassicFilter === f.id
                            ? 'bg-violet-600 border-violet-500 text-white shadow shadow-violet-500/20'
                            : 'bg-white/5 border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{f.emoji}</span>
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Standard menus (Original HD, Formal, Futuristik, Romantis) */}
            {selectedMenu !== 'custom' && selectedMenu !== 'rekreasi' && selectedMenu !== 'era-klasik' && (
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>{MENU_TABS.find(t => t.id === selectedMenu)?.icon}</span>
                    <span>{MENU_TABS.find(t => t.id === selectedMenu)?.label}</span>
                  </h2>

                  {/* Gender filter toggle for Formal */}
                  {selectedMenu === 'formal' && (
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 max-w-xs shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => { setFormalGender('pria'); setSelectedOption('ceo') }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          formalGender === 'pria'
                            ? 'bg-violet-600 text-white shadow shadow-violet-500/10'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        <span>👔</span> Pria / Umum
                      </button>
                      <button
                        onClick={() => { setFormalGender('wanita'); setSelectedOption('blazer') }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          formalGender === 'wanita'
                            ? 'bg-violet-600 text-white shadow shadow-violet-500/10'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        <span>👗</span> Wanita
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {(selectedMenu === 'formal' ? options.filter(o => o.gender === formalGender) : options).map(opt => (
                    <button
                      key={opt.id}
                      id={`option-${opt.id}`}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`option-card glass-card border rounded-2xl p-4 text-center transition-all ${
                        selectedOption === opt.id 
                          ? 'border-violet-500 bg-violet-500/10 scale-102 shadow-lg shadow-violet-500/5' 
                          : 'border-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      <div className="text-3xl mb-2">{opt.emoji}</div>
                      <p className="text-white text-xs font-semibold leading-tight">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div ref={resultsRef} className="flex-1 p-4 sm:p-6">
            {currentImage ? (
              <div className="animate-fade-in max-w-4xl">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>✨</span> Hasil Foto AI
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {currentImage.mode === 'mock' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black tracking-wider">DEMO</span>
                    )}
                    {currentImage.mode === 'ai' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider">🤖 AI</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Left Column: Original */}
                  {uploadedPhoto && (
                    <div className="glass-card border border-white/[0.07] rounded-3xl overflow-hidden shadow-xl shadow-black/20">
                      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                        <p className="text-[#94a3b8] text-xs font-bold tracking-wider uppercase">📸 Foto Original</p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedPhoto} alt="Foto original" className="result-image w-full aspect-[2/3] object-cover" />
                    </div>
                  )}

                  {/* Right Column: AI Result + Action Buttons */}
                  <div className="space-y-4">
                    <div className="glass-card border border-violet-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/5 glow-border flex flex-col bg-[#0b0f1a]">
                      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-violet-500/[0.01]">
                        <p className="text-violet-300 text-xs font-bold tracking-wider uppercase">✨ {currentImage.optionLabel}</p>
                        <span className="text-[10px] text-[#64748b] font-black bg-white/5 px-2 py-0.5 rounded">V{generatedImages.length - generatedImages.indexOf(currentImage)}</span>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={currentImage.url} alt={currentImage.optionLabel} className="result-image w-full aspect-[2/3] object-cover" />
                      
                      {/* ❤️ Simpan / Suka / Ganti / Edit buttons */}
                      <div className="p-3 bg-black/35 border-t border-white/[0.06] grid grid-cols-4 gap-2">
                        <button
                          onClick={() => {
                            const isLiked = likedImages.includes(currentImage.id)
                            if (isLiked) {
                              setLikedImages(prev => prev.filter(id => id !== currentImage.id))
                            } else {
                              setLikedImages(prev => [...prev, currentImage.id])
                            }
                          }}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            likedImages.includes(currentImage.id)
                              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 font-extrabold scale-95'
                              : 'bg-white/5 border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>{likedImages.includes(currentImage.id) ? '❤️' : '🤍'}</span>
                          <span className="text-[11px]">{likedImages.includes(currentImage.id) ? 'Suka' : 'Suka'}</span>
                        </button>

                        <button
                          onClick={() => handleDownload(currentImage)}
                          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
                        >
                          <span>💾</span>
                          <span className="text-[11px]">Simpan</span>
                        </button>

                        <button
                          onClick={() => setShowModification(!showModification)}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            showModification
                              ? 'bg-violet-500/20 border-violet-500/35 text-violet-300'
                              : 'bg-white/5 border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>🔄</span>
                          <span className="text-[11px]">Ganti</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowModification(true)
                            setTimeout(() => {
                              document.getElementById('modification-input-field')?.focus()
                            }, 50)
                          }}
                          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
                        >
                          <span>📝</span>
                          <span className="text-[11px]">Edit</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Ganti/Modification Panel */}
                    {showModification && (
                      <div className="p-4 rounded-3xl glass border border-violet-500/20 bg-violet-500/[0.01] animate-slide-up shadow-xl shadow-black/10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white text-sm font-bold flex items-center gap-1.5">
                            <span>🔄</span> Modifikasi Foto Hasil
                          </p>
                          <button 
                            onClick={() => setShowModification(false)}
                            className="text-[#64748b] hover:text-white text-xs"
                          >
                            Batal
                          </button>
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <input
                            id="modification-input-field"
                            type="text"
                            value={modificationInput}
                            onChange={e => setModificationInput(e.target.value)}
                            placeholder="Ketik modifikasi (cth: ganti baju merah)"
                            className="flex-1 glass border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#64748b] text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && modificationInput.trim()) {
                                handleModifyGenerate(modificationInput)
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (modificationInput.trim()) {
                                handleModifyGenerate(modificationInput)
                              }
                            }}
                            disabled={isGenerating || !modificationInput.trim()}
                            className="px-4 py-2.5 rounded-xl btn-primary font-bold text-sm shrink-0 disabled:opacity-50"
                          >
                            Ganti
                          </button>
                        </div>

                        <div>
                          <p className="text-xs text-[#64748b] mb-2 font-semibold">Saran cepat (klik langsung memproses):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {MODIFICATION_SUGGESTIONS.map(suggestion => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setModificationInput(suggestion)
                                  handleModifyGenerate(suggestion)
                                }}
                                className="px-2.5 py-1.5 rounded-lg glass border border-white/10 text-[11px] text-[#94a3b8] hover:text-white hover:border-white/20 transition-all font-semibold"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {generatedImages.length > 1 && (
                  <div className="mt-8">
                    <p className="text-xs text-[#64748b] font-bold uppercase tracking-widest mb-3">Semua Versi Foto</p>
                    <div className="flex flex-wrap gap-3">
                      {generatedImages.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImage(img)}
                          className={`relative rounded-xl overflow-hidden transition-all duration-200 ${currentImage.id === img.id ? 'ring-2 ring-violet-500 scale-105 shadow-md shadow-violet-500/10' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.optionLabel} className="w-16 object-cover" style={{ height: '88px' }} />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 font-bold">
                            V{generatedImages.length - i}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
                <div className="text-6xl mb-4 animate-float">🎨</div>
                <h3 className="text-white font-bold text-xl mb-2">Siap Generate!</h3>
                <p className="text-[#94a3b8] text-sm max-w-sm">
                  {!uploadedPhoto
                    ? 'Ambil selfie atau upload foto dari galeri untuk mulai.'
                    : 'Pilih gaya yang diinginkan lalu klik Generate Foto.'}
                </p>
                {!uploadedPhoto && (
                  <div className="mt-5 flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="px-5 py-3 rounded-xl btn-primary font-bold text-sm shadow-md shadow-violet-500/10 active:scale-95 transition-all"
                    >
                      📸 Selfie
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-3 rounded-xl glass border border-white/10 text-white font-bold text-sm hover:border-white/20 active:scale-95 transition-all"
                    >
                      🖼️ Galeri
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showPaywall && license && (
        <PaywallModal
          trialsUsed={license.trialsUsed}
          onLicenseActivated={refreshLicense}
          onClose={() => setShowPaywall(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSettingsChanged={refreshLicense}
        />
      )}
    </div>
  )
}
