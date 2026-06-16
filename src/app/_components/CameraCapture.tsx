'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  onCapture: (dataUrl: string) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    stopStream()
    setReady(false)
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
      // Check if multiple cameras available
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cams = devices.filter(d => d.kind === 'videoinput')
      setHasMultipleCameras(cams.length > 1)
    } catch (err) {
      const e = err as { name?: string }
      if (e.name === 'NotAllowedError') {
        setError('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.')
      } else if (e.name === 'NotFoundError') {
        setError('Kamera tidak ditemukan di perangkat ini.')
      } else {
        setError('Tidak dapat mengakses kamera. Pastikan browser mendukung WebRTC.')
      }
    }
  }, [])

  useEffect(() => {
    startCamera(facingMode)
    return stopStream
  }, [facingMode, startCamera])

  const handleCapture = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    
    // We want the final image to be portrait (2:3 aspect ratio)
    // to match what the user sees in the object-cover preview
    const targetAspect = 2 / 3
    
    const sourceWidth = video.videoWidth
    const sourceHeight = video.videoHeight
    
    let drawWidth = sourceWidth
    let drawHeight = sourceHeight
    let sx = 0
    let sy = 0

    if (sourceWidth / sourceHeight > targetAspect) {
      // Stream is wider than 2:3, crop sides
      drawWidth = sourceHeight * targetAspect
      sx = (sourceWidth - drawWidth) / 2
    } else {
      // Stream is taller than 2:3, crop top/bottom
      drawHeight = sourceWidth / targetAspect
      sy = (sourceHeight - drawHeight) / 2
    }

    // Capture at high resolution 2:3 portrait format
    canvas.width = 1200
    canvas.height = 1800

    const ctx = canvas.getContext('2d')!

    // Mirror front camera horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(
      video,
      sx, sy, drawWidth, drawHeight, // crop coordinates
      0, 0, canvas.width, canvas.height // output
    )

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    stopStream()
    onCapture(dataUrl)
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) { stopStream(); onClose() } }}
      id="camera-modal"
    >
      <div className="glass-card border border-white/10 rounded-3xl overflow-hidden w-full max-w-md h-[80vh] sm:h-[75vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0 bg-[#0b0f1a]">
          <div>
            <h2 className="text-white font-bold">📸 Kamera</h2>
            <p className="text-[#64748b] text-xs mt-0.5">
              {facingMode === 'user' ? 'Kamera Depan (Selfie)' : 'Kamera Belakang'}
            </p>
          </div>
          <button
            onClick={() => { stopStream(); onClose() }}
            className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
            id="camera-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Camera View - maximized dynamic portrait height */}
        <div className="relative bg-black flex-1 min-h-0 w-full overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6 bg-[#0f1524]">
              <div className="text-4xl">🚫</div>
              <p className="text-[#94a3b8] text-sm">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 rounded-xl btn-primary text-sm font-bold"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              {/* Video element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                id="camera-video"
              />

              {/* Loading overlay */}
              {!ready && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
                  <div className="flex gap-1">
                    <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 inline-block" />
                  </div>
                  <p className="text-[#94a3b8] text-xs">Memuat kamera…</p>
                </div>
              )}

              {/* Focus ring overlay */}
              {ready && (
                <div className="absolute inset-0 border-2 border-violet-500/20 rounded-none pointer-events-none">
                  {/* Corner brackets */}
                  {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 border-violet-400 border-opacity-70
                      ${i === 0 ? 'border-t-2 border-l-2' : ''}
                      ${i === 1 ? 'border-t-2 border-r-2' : ''}
                      ${i === 2 ? 'border-b-2 border-l-2' : ''}
                      ${i === 3 ? 'border-b-2 border-r-2' : ''}
                    `} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 gap-4 shrink-0 bg-[#070a12]">
          {/* Switch camera */}
          {hasMultipleCameras ? (
            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-xl hover:border-white/20 transition-all hover:scale-110"
              title="Ganti kamera"
              id="switch-camera-btn"
            >
              🔄
            </button>
          ) : (
            <div className="w-12" />
          )}

          {/* Capture */}
          <button
            onClick={handleCapture}
            disabled={!ready || !!error}
            id="capture-btn"
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
              ready && !error
                ? 'bg-white hover:bg-white/90 hover:scale-110 active:scale-95 shadow-lg shadow-white/20'
                : 'bg-white/20 cursor-not-allowed'
            }`}
          >
            📸
          </button>

          {/* Flip label */}
          <div className="w-12 text-center">
            <span className="text-[#64748b] text-[10px]">
              {facingMode === 'user' ? '🤳 Depan' : '📷 Belakang'}
            </span>
          </div>
        </div>

        <p className="text-center text-[#64748b] text-[11px] pb-3 shrink-0 bg-[#070a12]">
          Klik tombol untuk mengambil foto
        </p>
      </div>
    </div>
  )
}
