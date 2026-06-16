import Link from 'next/link'
import Navbar from './_components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Studio Photographer Pro — Satu Foto, Puluhan Karya Profesional',
  description:
    'Transformasi foto Anda dengan AI dalam hitungan detik. Foto formal, wisuda, wedding, rekreasi, futuristik — tanpa Photoshop, tanpa skill editing.',
}

const FEATURES = [
  {
    id: 'original-hd',
    icon: '✨',
    title: 'Original HD',
    desc: 'Sharpen · Upscale 4K/8K · Remove Noise · Auto Color',
    gradient: 'from-yellow-500/[0.12] to-amber-600/[0.12]',
    border: 'border-yellow-500/20',
    iconBg: 'bg-yellow-500/10',
    glow: 'hover:shadow-yellow-500/10',
  },
  {
    id: 'formal',
    icon: '👔',
    title: 'Formal',
    desc: 'CEO · Pilot · Dokter · ASN · Polisi · Tentara · Pengacara',
    gradient: 'from-blue-500/[0.12] to-indigo-600/[0.12]',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    glow: 'hover:shadow-blue-500/10',
  },
  {
    id: 'rekreasi',
    icon: '🌏',
    title: 'Rekreasi',
    desc: 'Bali · Raja Ampat · Paris · Jepang · Korea · Swiss · Maldives',
    gradient: 'from-emerald-500/[0.12] to-green-600/[0.12]',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    glow: 'hover:shadow-emerald-500/10',
  },
  {
    id: 'futuristik',
    icon: '🚀',
    title: 'Futuristik',
    desc: 'Cyberpunk · Astronot · Metaverse · Kota Masa Depan · AI Human',
    gradient: 'from-violet-500/[0.12] to-purple-600/[0.12]',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/10',
    glow: 'hover:shadow-violet-500/10',
  },
  {
    id: 'era-klasik',
    icon: '🎞️',
    title: 'Era Klasik',
    desc: 'Tahun 60s–90s · Film Analog · Kodak · Polaroid · VHS',
    gradient: 'from-amber-500/[0.12] to-orange-600/[0.12]',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10',
    glow: 'hover:shadow-amber-500/10',
  },
  {
    id: 'romantis',
    icon: '🌸',
    title: 'Romantis',
    desc: 'Sunset · Sakura · Paris · Candle Light · Garden Wedding',
    gradient: 'from-pink-500/[0.12] to-rose-600/[0.12]',
    border: 'border-pink-500/20',
    iconBg: 'bg-pink-500/10',
    glow: 'hover:shadow-pink-500/10',
  },
  {
    id: 'custom-ai',
    icon: '🤖',
    title: 'Custom AI',
    desc: 'Ketik apa saja dalam Bahasa Indonesia — AI kembangkan otomatis',
    gradient: 'from-cyan-500/[0.12] to-teal-600/[0.12]',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/10',
    glow: 'hover:shadow-cyan-500/10',
  },
]

const STEPS = [
  {
    num: '01',
    icon: '📸',
    title: 'Upload Foto',
    desc: 'Drag & drop atau pilih foto dari perangkat Anda. Semua format didukung (JPG, PNG, WEBP).',
  },
  {
    num: '02',
    icon: '🎨',
    title: 'Pilih Gaya',
    desc: 'Pilih dari 7 menu utama dan ratusan sub-tema. Atau ketik perintah bebas dalam Bahasa Indonesia.',
  },
  {
    num: '03',
    icon: '⚡',
    title: 'Generate & Download',
    desc: 'AI menghasilkan foto profesional dalam hitungan detik. Download langsung dalam resolusi tinggi.',
  },
]

const PRICING = [
  {
    name: 'Basic',
    price: 'Rp 99.000',
    period: '/bulan',
    desc: 'Untuk fotografer pemula',
    features: ['100 foto/bulan', '7 menu gaya', 'HD download (2MP)', 'Email support', 'Version history 3x'],
    cta: 'Mulai Basic',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'Rp 299.000',
    period: '/bulan',
    desc: 'Studio foto profesional',
    features: [
      '1.000 foto/bulan',
      'Semua menu + Custom AI',
      '4K download (8MP)',
      'Face Lock Technology',
      'Version history unlimited',
      'Priority support',
    ],
    cta: 'Mulai Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Solusi untuk bisnis besar',
    features: [
      'Unlimited foto',
      'API access',
      'White-label',
      '8K download',
      'Dedicated account manager',
      'Custom integrasi',
    ],
    cta: 'Hubungi Sales',
    popular: false,
  },
]

const QUICK_PROMPTS = [
  '"Ganti jas biru"',
  '"Ke Paris malam"',
  '"Lebih muda 10 tahun"',
  '"Jadi CEO"',
  '"Foto di Bali"',
  '"Cyberpunk"',
  '"Pilot pesawat"',
  '"Tambah senyum"',
]

const PAKET_KHUSUS = [
  { icon: '📄', title: 'Pas Foto', sub: '2×3 · 3×4 · 4×6 cm', color: 'from-blue-500/10' },
  { icon: '🎓', title: 'Wisuda', sub: 'Toga · Kampus · Sertifikat', color: 'from-purple-500/10' },
  { icon: '💍', title: 'Pernikahan', sub: 'Adat Jawa · Sunda · Batak · Bali', color: 'from-pink-500/10' },
  { icon: '🕌', title: 'Haji & Umrah', sub: 'Ihram · Masjidil Haram · Madinah', color: 'from-green-500/10' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080b14] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-4"
      >
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-[700px] h-[700px] bg-violet-700 top-[-250px] left-[-250px]" />
          <div className="orb w-[600px] h-[600px] bg-cyan-600 bottom-[-200px] right-[-200px]" />
          <div className="orb w-[350px] h-[350px] bg-fuchsia-600 top-[50%] left-[20%]" />
          <div className="absolute inset-0 grid-overlay" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/25 mb-8 animate-fade-in-up"
            id="hero-badge"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm text-[#94a3b8]">
              Powered by Gemini AI · FLUX · SDXL · RealESRGAN
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight animate-fade-in-up animate-delay-100"
            id="hero-headline"
          >
            <span className="text-white">Satu Foto,</span>
            <br />
            <span className="gradient-text">Puluhan Karya</span>
            <br />
            <span className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">Profesional.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
            Tidak perlu Photoshop. Tidak perlu kamera mahal.<br className="hidden sm:block" />
            Ketik perintah sederhana dalam{' '}
            <strong className="text-white">Bahasa Indonesia</strong> — AI mengerjakan sisanya.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-fade-in-up animate-delay-300">
            <Link
              href="/studio"
              id="hero-cta-primary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl btn-primary text-base sm:text-lg font-bold animate-pulse-glow"
            >
              🚀 Mulai Gratis Sekarang
            </Link>
            <a
              href="#cara-kerja"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-base sm:text-lg hover:border-white/20 transition-all"
            >
              ▶ Lihat Demo
            </a>
          </div>

          {/* Quick Prompt Chips */}
          <div
            className="flex flex-wrap gap-2 justify-center animate-fade-in-up animate-delay-400"
            aria-label="Contoh perintah AI"
          >
            {QUICK_PROMPTS.map(prompt => (
              <span
                key={prompt}
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm glass border border-white/[0.08] text-[#94a3b8]"
              >
                {prompt}
              </span>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[#64748b] text-xs animate-fade-in-up animate-delay-500">
            {['🏆 10.000+ Studio Foto', '⚡ Generate < 10 Detik', '🔒 Face Lock Technology', '🆓 Gratis Untuk Dicoba'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ─────────────────────────────────── */}
      <section id="cara-kerja" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Semudah 1-2-3</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Cara Kerjanya
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-[calc(33.33%-1px)] right-[calc(33.33%-1px)] h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-violet-500/40" />

            {STEPS.map((step, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-8 border border-white/[0.06] hover:border-violet-500/25 transition-all group hover:-translate-y-2 duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">{step.num}</p>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FITUR UTAMA ─────────────────────────────────── */}
      <section id="fitur" className="py-28 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-[500px] h-[500px] bg-violet-700 top-0 right-[-200px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">7 Menu Kreatif</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Transformasi Tanpa Batas
            </h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              Dari foto formal profesional hingga destinasi wisata impian — semua tersedia dengan satu klik.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <Link
                key={f.id}
                href="/studio"
                id={`feature-${f.id}`}
                className={`feature-card group relative rounded-2xl p-6 border ${f.border} bg-gradient-to-br ${f.gradient} cursor-pointer overflow-hidden hover:shadow-2xl ${f.glow}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-[#94a3b8] text-xs leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-4 right-4 text-white/20 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-1">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACE LOCK DEMO ─────────────────────────────── */}
      <section id="face-lock" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-[500px] h-[500px] bg-cyan-600 bottom-0 left-[-200px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-3">Face Lock Technology</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Wajah Tetap Sama,
              <br />
              <span className="gradient-text">Gaya Berubah Total</span>
            </h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              AI kami menjaga identitas wajah asli Anda di semua hasil. Hanya latar, pakaian, dan gaya yang berubah.
            </p>
          </div>

          {/* Demo cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Foto Original', emoji: '📸', badge: 'INPUT', badgeColor: 'bg-white/10' },
              { label: 'CEO Executive', emoji: '👔', badge: 'FORMAL', badgeColor: 'bg-blue-500/20' },
              { label: 'Sunset Bali', emoji: '🌅', badge: 'REKREASI', badgeColor: 'bg-emerald-500/20' },
              { label: 'Cyberpunk 2077', emoji: '🤖', badge: 'FUTURISTIK', badgeColor: 'bg-violet-500/20' },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl border border-white/[0.07] overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="aspect-[3/4] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/[0.03] to-transparent">
                  <div className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white/60 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/studio"
              id="facelook-cta"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl btn-primary font-bold"
            >
              🎯 Coba Face Lock Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ── PAKET KHUSUS ───────────────────────────────── */}
      <section id="paket-khusus" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Paket Spesial</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Kebutuhan Foto Khusus</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAKET_KHUSUS.map(p => (
              <Link
                key={p.title}
                href="/studio"
                className={`glass-card border border-white/[0.07] rounded-2xl p-6 hover:border-white/15 transition-all hover:-translate-y-2 duration-300 bg-gradient-to-br ${p.color} to-transparent group`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{p.icon}</div>
                <h3 className="text-white font-bold text-lg mb-1">{p.title}</h3>
                <p className="text-[#94a3b8] text-xs">{p.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────── */}
      <section id="paket" className="py-28 px-4 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb w-[400px] h-[400px] bg-violet-700 top-0 left-[50%] -translate-x-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: '#f59e0b' }}
            >
              Harga Transparan
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Pilih Paket Anda</h2>
            <p className="text-[#94a3b8] text-lg">Mulai gratis · Upgrade kapan saja · Batalkan kapan saja</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan, i) => (
              <div
                key={i}
                id={`pricing-${plan.name.toLowerCase()}`}
                className={`relative rounded-3xl p-8 border transition-all hover:-translate-y-2 duration-300 ${
                  plan.popular
                    ? 'pricing-popular border-transparent'
                    : 'glass-card border-white/[0.07] hover:border-white/15'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-black shadow-lg">
                      ⭐ PALING POPULER
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                  <p className="text-[#64748b] text-sm">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-[#94a3b8] text-sm ml-1">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/studio"
                  className={`block w-full text-center px-6 py-3.5 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'glass border border-white/10 text-white hover:border-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────── */}
      <section id="cta-final" className="py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl glass border border-violet-500/20 p-12 sm:p-16 overflow-hidden text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb w-[350px] h-[350px] bg-violet-700 top-[-100px] left-[-100px]" />
              <div className="orb w-[350px] h-[350px] bg-cyan-600 bottom-[-100px] right-[-100px]" />
              <div className="absolute inset-0 grid-overlay opacity-50" />
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                Siap Mulai <span className="gradient-text">Transformasi</span>?
              </h2>
              <p className="text-[#94a3b8] text-lg mb-10 max-w-xl mx-auto">
                Bergabung dengan{' '}
                <strong className="text-white">10.000+ fotografer dan studio</strong> yang sudah menggunakan AI Studio Pro untuk menghasilkan karya luar biasa.
              </p>
              <Link
                href="/studio"
                id="final-cta"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl btn-primary text-lg font-black"
              >
                🎯 Buka Studio Sekarang — Gratis!
              </Link>
              <p className="text-[#64748b] text-xs mt-4">Tidak perlu kartu kredit · Mulai dalam 30 detik</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">AI</span>
              </div>
              <span className="font-bold text-white">AI Studio Photographer Pro</span>
            </div>

            {/* Copyright */}
            <p className="text-[#64748b] text-sm">© 2026 AI Studio Pro. Semua hak dilindungi.</p>

            {/* Links */}
            <nav className="flex gap-5">
              {['Privasi', 'Syarat & Ketentuan', 'Bantuan'].map(item => (
                <a
                  key={item}
                  href="#"
                  className="text-[#64748b] hover:text-white text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
