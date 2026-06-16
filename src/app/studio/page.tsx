'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  MODIFICATION_SUGGESTIONS,
  type StyleCategory,
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

// ─── Main Component ───────────────────────────────────────────
export default function StudioPage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  // Liked generated image IDs
  const [likedImages, setLikedImages] = useState<string[]>([])

  // Modals
  const [showCamera, setShowCamera] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [license, setLicense] = useState<LicenseStatus | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load license on mount
  useEffect(() => {
    setLicense(getLicenseStatus())
  }, [])

  const refreshLicense = useCallback(() => {
    setLicense(getLicenseStatus())
  }, [])

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
  const handleGenerateDirectly = async (promptText: string) => {
    if (!uploadedPhoto) {
      alert('Silakan ambil selfie atau upload foto terlebih dahulu.')
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
          imageData: uploadedPhoto,
          style: 'custom',
          option: null,
          customPrompt: promptText,
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
        style: 'custom',
        optionLabel: promptText,
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

  const handleGenerate = async () => {
    if (!customPrompt.trim()) {
      alert('Silakan ketik perintah Anda terlebih dahulu.')
      return
    }
    await handleGenerateDirectly(customPrompt)
  }

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a')
    a.href = img.url
    a.download = `ai-studio-${img.optionLabel.replace(/\s+/g, '-')}-${img.id}.jpg`
    a.click()
  }

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

          {/* Guide/Sidebar Note */}
          <div className="p-4 text-xs text-[#64748b] space-y-2 mt-auto">
            <p>💡 **Tips Kunci Wajah**:</p>
            <p>AI akan otomatis memindai kacamata, warna kulit, potongan rambut, dan ekspresi asli wajah Anda untuk dikunci di hasil generate.</p>
          </div>
        </aside>

        {/* ── CENTER/RIGHT: Prompt Input + Results ── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#080b14] lg:h-full lg:overflow-y-auto">

          {/* Main Input Area */}
          <div className="p-4 sm:p-6 border-b border-white/[0.06] bg-[#090d18] space-y-4">
            <div>
              <h2 className="text-white font-black text-lg mb-1 flex items-center gap-2">
                <span>🤖</span> Perintah Gaya AI
              </h2>
              <p className="text-[#94a3b8] text-xs">
                Ketik instruksi gaya (baju, latar belakang) dalam Bahasa Indonesia. Wajah Anda akan tetap dikunci identitasnya.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="custom-prompt-input"
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder='Contoh: "ganti jas hitam", "ganti ke gaya pantai Bali", "senyum sedikit", "lebih muda 10 tahun"...'
                className="flex-1 glass border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-[#64748b] text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate()
                  }
                }}
              />
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !uploadedPhoto}
                className={`px-6 py-3.5 rounded-2xl font-black text-sm shrink-0 transition-all ${
                  !uploadedPhoto || isGenerating
                    ? 'bg-white/5 text-[#64748b] cursor-not-allowed border border-white/5'
                    : trialsLeft === 0 && !isLicensed
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90'
                    : 'btn-primary shadow-lg shadow-violet-500/20 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current inline-block" />
                    </span>
                    AI Bekerja…
                  </span>
                ) : trialsLeft === 0 && !isLicensed ? (
                  '🔒 Beli Lisensi'
                ) : (
                  '⚡ Proses Foto'
                )}
              </button>
            </div>

            {/* Categorized suggestion chips */}
            <div className="space-y-2">
              <p className="text-xs text-[#64748b] font-bold uppercase tracking-wider">💡 Rekomendasi Gaya Instan (Klik untuk memproses):</p>
              
              <div className="space-y-2.5">
                {/* Row 1: Formal & Profesi */}
                <div className="flex items-start">
                  <span className="text-[10px] text-violet-400 font-bold uppercase mr-2 mt-1.5 shrink-0 w-16">👔 Formal:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['jas hitam resmi', 'jas biru', 'batik premium', 'ceo', 'dokter', 'polisi', 'tentara', 'kebaya', 'hijab', 'blazer', 'pengacara'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => {
                          setCustomPrompt(chip)
                          handleGenerateDirectly(chip)
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 text-xs text-[#94a3b8] hover:text-white transition-all font-semibold capitalize"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Wisata & Latar */}
                <div className="flex items-start">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase mr-2 mt-1.5 shrink-0 w-16">🏖️ Wisata:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['pantai bali', 'raja ampat', 'swiss', 'jepang', 'paris malam', 'maldives', 'lombok', 'korea', 'london', 'dubai'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => {
                          setCustomPrompt(chip)
                          handleGenerateDirectly(chip)
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-xs text-[#94a3b8] hover:text-white transition-all font-semibold capitalize"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 3: Koreksi Wajah */}
                <div className="flex items-start">
                  <span className="text-[10px] text-amber-400 font-bold uppercase mr-2 mt-1.5 shrink-0 w-16">✨ Efek:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['lebih muda 10 tahun', 'senyum sedikit', 'kulit lebih cerah', 'auto enhance', 'cyberpunk', 'astronot', 'polaroid', 'kodak'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => {
                          setCustomPrompt(chip)
                          handleGenerateDirectly(chip)
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-xs text-[#94a3b8] hover:text-white transition-all font-semibold capitalize"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div ref={resultsRef} className="flex-1 p-4 sm:p-6">
            {generateError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
                ⚠️ {generateError}
              </div>
            )}

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
                          onClick={() => {
                            document.getElementById('custom-prompt-input')?.focus()
                            // Scroll to input
                            document.getElementById('custom-prompt-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }}
                          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10 text-xs font-bold transition-all col-span-2"
                        >
                          <span>🔄</span>
                          <span className="text-[11px]">Ganti / Edit Gaya</span>
                        </button>
                      </div>
                    </div>
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
                <h3 className="text-white font-bold text-xl mb-2">Siap Proses Foto!</h3>
                <p className="text-[#94a3b8] text-sm max-w-sm">
                  {!uploadedPhoto
                    ? 'Ambil selfie atau upload foto dari galeri untuk mulai.'
                    : 'Ketik gaya yang diinginkan atau pilih rekomendasi di atas lalu klik Proses Foto.'}
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
