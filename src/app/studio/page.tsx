'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  FORMAL_OPTIONS,
  REKREASI_OPTIONS,
  FUTURISTIK_OPTIONS,
  ERA_KLASIK_OPTIONS,
  ROMANTIS_OPTIONS,
  ORIGINAL_HD_OPTIONS,
  CUSTOM_AI_QUICK_PROMPTS,
  type StyleCategory,
  type PromptOption,
} from '../_lib/prompts'

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
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'rekreasi', label: 'Rekreasi', icon: '🌏' },
  { id: 'futuristik', label: 'Futuristik', icon: '🚀' },
  { id: 'era-klasik', label: 'Era Klasik', icon: '🎞️' },
  { id: 'romantis', label: 'Romantis', icon: '🌸' },
  { id: 'original-hd', label: 'Original HD', icon: '✨' },
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
  const [selectedMenu, setSelectedMenu] = useState<StyleCategory>('formal')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // ── Upload Handlers ──────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang didukung (JPG, PNG, WEBP, dll)')
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

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const optionLabel =
        selectedMenu === 'custom'
          ? customPrompt
          : (getOptions(selectedMenu).find(o => o.id === selectedOption)?.label ?? selectedOption ?? '')

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: uploadedPhoto,
          style: selectedMenu,
          option: selectedOption,
          customPrompt,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Generate gagal')
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

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a')
    a.href = img.url
    a.download = `ai-studio-${img.optionLabel.replace(/\s+/g, '-')}-${img.id}.jpg`
    a.click()
  }

  const options = getOptions(selectedMenu)

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col">
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

          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            {isGenerating && (
              <span className="flex items-center gap-2 text-violet-400">
                <span className="flex gap-1">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                </span>
                AI sedang bekerja…
              </span>
            )}
            <span className="hidden sm:block">AI Studio Photographer Pro</span>
          </div>

          <Link
            href="/"
            className="text-xs text-[#64748b] hover:text-white transition-colors"
            id="studio-back-home"
          >
            ← Beranda
          </Link>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row gap-0">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="lg:w-80 xl:w-96 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.06]">
          {/* Upload Zone */}
          <div className="p-4 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-3">📸 Upload Foto</p>

            {uploadedPhoto ? (
              <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedPhoto}
                  alt="Foto yang diupload"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl glass border border-white/20 text-white text-sm font-semibold"
                    id="change-photo-btn"
                  >
                    Ganti Foto
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold">
                    ✓ Uploaded
                  </span>
                </div>
              </div>
            ) : (
              <div
                id="upload-zone"
                className={`upload-zone rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${dragOver ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <div className="text-5xl">{dragOver ? '📂' : '📸'}</div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">Drag & Drop</p>
                  <p className="text-[#64748b] text-xs mt-1">atau klik untuk pilih foto</p>
                  <p className="text-[#64748b] text-[10px] mt-2">JPG · PNG · WEBP · Max 10MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              id="file-input"
            />
          </div>

          {/* Version History Toggle */}
          {generatedImages.length > 0 && (
            <div className="p-4 border-b border-white/[0.06]">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="flex items-center justify-between w-full text-xs font-bold text-[#64748b] uppercase tracking-widest"
                id="version-history-toggle"
              >
                <span>🕐 Riwayat Versi ({generatedImages.length})</span>
                <span className={`transition-transform ${showVersionHistory ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showVersionHistory && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {generatedImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentImage?.id === img.id
                          ? 'bg-violet-500/15 border border-violet-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.optionLabel}
                        className="w-10 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">V{generatedImages.length - i}: {img.optionLabel}</p>
                        <p className="text-[#64748b] text-[10px]">
                          {img.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generate Button (sticky at bottom of sidebar) */}
          <div className="p-4 mt-auto">
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !uploadedPhoto}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                isGenerating || !uploadedPhoto
                  ? 'bg-white/5 text-[#64748b] cursor-not-allowed'
                  : 'btn-primary animate-pulse-glow'
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
              ) : (
                '⚡ Generate Foto'
              )}
            </button>

            {generateError && (
              <p className="text-red-400 text-xs mt-2 text-center">{generateError}</p>
            )}

            {!uploadedPhoto && (
              <p className="text-[#64748b] text-xs mt-2 text-center">Upload foto dulu untuk mulai</p>
            )}
          </div>
        </aside>

        {/* ── CENTER/RIGHT: Options + Results ── */}
        <main className="flex-1 flex flex-col min-w-0">

          {/* Menu Tab Bar */}
          <div className="border-b border-white/[0.06] px-4 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {MENU_TABS.map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => {
                    setSelectedMenu(tab.id)
                    setSelectedOption(null)
                  }}
                  className={`tab-item flex items-center gap-1.5 px-4 py-4 text-sm font-semibold text-[#94a3b8] hover:text-white transition-colors ${
                    selectedMenu === tab.id ? 'active text-white' : ''
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options Panel */}
          <div className="p-4 sm:p-6 border-b border-white/[0.06]">
            {selectedMenu === 'custom' ? (
              /* Custom AI Input */
              <div className="max-w-2xl" id="custom-ai-panel">
                <h2 className="text-white font-bold text-lg mb-2">🤖 Custom AI</h2>
                <p className="text-[#94a3b8] text-sm mb-4">
                  Ketik perintah bebas dalam Bahasa Indonesia. AI otomatis mengembangkan prompt.
                </p>
                <textarea
                  id="custom-prompt-input"
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder='Contoh: "Jadikan saya terlihat seperti CEO perusahaan teknologi besar di Silicon Valley"'
                  className="w-full glass border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#64748b] text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                  rows={4}
                />
                <div className="mt-3">
                  <p className="text-xs text-[#64748b] mb-2">Ide cepat:</p>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_AI_QUICK_PROMPTS.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => setCustomPrompt(prompt)}
                        className="px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-[#94a3b8] hover:text-white hover:border-white/20 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Options Grid */
              <div>
                <h2 className="text-white font-bold text-lg mb-4">
                  {MENU_TABS.find(t => t.id === selectedMenu)?.icon}{' '}
                  {MENU_TABS.find(t => t.id === selectedMenu)?.label}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {options.map(opt => (
                    <button
                      key={opt.id}
                      id={`option-${opt.id}`}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`option-card glass-card border border-white/[0.07] rounded-2xl p-4 text-center ${
                        selectedOption === opt.id ? 'selected' : ''
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
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">✅ Hasil Generate</h3>
                  <div className="flex items-center gap-2">
                    {currentImage.mode === 'mock' && (
                      <span className="px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                        DEMO MODE
                      </span>
                    )}
                    {currentImage.mode === 'ai' && (
                      <span className="px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                        🤖 AI GENERATED
                      </span>
                    )}
                    <button
                      onClick={() => handleDownload(currentImage)}
                      id="download-btn"
                      className="px-4 py-2 rounded-xl btn-primary text-sm font-bold"
                    >
                      ⬇ Download
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                  {/* Original */}
                  {uploadedPhoto && (
                    <div className="glass-card border border-white/[0.07] rounded-2xl overflow-hidden">
                      <div className="px-3 py-2 border-b border-white/[0.06]">
                        <p className="text-[#94a3b8] text-xs font-semibold">📸 Original</p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedPhoto}
                        alt="Foto original"
                        className="result-image w-full aspect-[3/4] object-cover"
                      />
                    </div>
                  )}

                  {/* Generated */}
                  <div className="glass-card border border-violet-500/20 rounded-2xl overflow-hidden glow-border">
                    <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
                      <p className="text-violet-300 text-xs font-semibold">✨ {currentImage.optionLabel}</p>
                      <button
                        onClick={() => handleDownload(currentImage)}
                        className="text-[#64748b] hover:text-white transition-colors text-xs"
                      >
                        ⬇
                      </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentImage.url}
                      alt={currentImage.optionLabel}
                      className="result-image w-full aspect-[3/4] object-cover"
                    />
                  </div>
                </div>

                {/* All versions mini gallery */}
                {generatedImages.length > 1 && (
                  <div className="mt-6">
                    <p className="text-xs text-[#64748b] font-bold uppercase tracking-widest mb-3">Semua Versi</p>
                    <div className="flex flex-wrap gap-3">
                      {generatedImages.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImage(img)}
                          className={`relative rounded-xl overflow-hidden transition-all ${
                            currentImage.id === img.id
                              ? 'ring-2 ring-violet-500 scale-105'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.optionLabel}
                            className="w-16 h-22 object-cover"
                            style={{ height: '88px' }}
                          />
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
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
                <div className="text-6xl mb-4 animate-float">🎨</div>
                <h3 className="text-white font-bold text-xl mb-2">Siap Generate!</h3>
                <p className="text-[#94a3b8] text-sm max-w-sm">
                  {!uploadedPhoto
                    ? 'Upload foto Anda di sidebar kiri untuk mulai.'
                    : 'Pilih gaya yang diinginkan lalu klik tombol Generate.'}
                </p>
                {!uploadedPhoto && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-5 px-6 py-3 rounded-xl btn-primary font-bold text-sm"
                  >
                    📸 Upload Foto Sekarang
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
