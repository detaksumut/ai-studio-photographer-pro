export default function StudioLoading() {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-4">
          <span className="typing-dot w-3 h-3 rounded-full bg-violet-500 inline-block" />
          <span className="typing-dot w-3 h-3 rounded-full bg-violet-500 inline-block" />
          <span className="typing-dot w-3 h-3 rounded-full bg-violet-500 inline-block" />
        </div>
        <p className="text-[#94a3b8] text-sm">Memuat AI Studio…</p>
      </div>
    </div>
  )
}
