// Prompt library — maps Indonesian style options to detailed English AI prompts
// Face preservation instruction appended to all prompts

export const FACE_LOCK_INSTRUCTION = `
IMPORTANT: Preserve the exact face, facial features, skin tone, and identity of the subject from the reference photo. 
Only change clothing, background, and environment as specified. 
The person must be clearly identifiable as the same individual.
Photorealistic quality, professional photography, sharp details, perfect lighting.
`

export type StyleCategory =
  | 'original-hd'
  | 'formal'
  | 'rekreasi'
  | 'futuristik'
  | 'era-klasik'
  | 'romantis'
  | 'custom'

export interface PromptOption {
  id: string
  label: string
  emoji: string
  prompt: string
  gender?: 'all' | 'male' | 'female'
}

export const FORMAL_OPTIONS: PromptOption[] = [
  {
    id: 'ceo',
    label: 'CEO',
    emoji: '💼',
    prompt: 'wearing a premium black tailored business suit, crisp white dress shirt, silk tie, confident CEO pose, modern corporate office background with city skyline',
  },
  {
    id: 'executive',
    label: 'Executive',
    emoji: '🤝',
    prompt: 'wearing a sharp navy executive suit with subtle pinstripe, gold cufflinks, professional executive portrait, blurred modern office background',
  },
  {
    id: 'pilot',
    label: 'Pilot',
    emoji: '✈️',
    prompt: 'wearing a professional airline pilot uniform with gold epaulettes and wings badge, pilot cap, standing in front of an airplane',
  },
  {
    id: 'dokter',
    label: 'Dokter',
    emoji: '🩺',
    prompt: 'wearing a white doctor coat, stethoscope around neck, name badge, standing in a modern hospital or clinic background, professional medical portrait',
  },
  {
    id: 'pengacara',
    label: 'Pengacara',
    emoji: '⚖️',
    prompt: 'wearing a formal dark lawyer suit with white shirt and tie, holding documents, law office with bookshelves in background',
  },
  {
    id: 'asn',
    label: 'ASN / PNS',
    emoji: '🏛️',
    prompt: 'wearing an Indonesian civil servant (ASN) formal uniform with proper insignia, official government office background, professional portrait',
  },
  {
    id: 'polisi',
    label: 'Polisi',
    emoji: '🚔',
    prompt: 'wearing an Indonesian police (POLRI) official uniform with badge and rank insignia, professional police portrait',
  },
  {
    id: 'tentara',
    label: 'Tentara',
    emoji: '🎖️',
    prompt: 'wearing an Indonesian military (TNI) official uniform with medals and rank insignia, patriotic military portrait background',
  },
  {
    id: 'guru',
    label: 'Guru',
    emoji: '📚',
    prompt: 'wearing smart casual professional teacher attire, classroom or school background with bookshelf, warm and approachable expression',
  },
  {
    id: 'ceo-woman',
    label: 'CEO Wanita',
    emoji: '👩‍💼',
    prompt: 'wearing an elegant womens power suit in navy or black, professional blouse, sophisticated business woman executive portrait, modern office',
    gender: 'female',
  },
  {
    id: 'dokter-woman',
    label: 'Dokter Wanita',
    emoji: '👩‍⚕️',
    prompt: 'wearing a white doctor coat, stethoscope, professional female doctor portrait in a modern hospital setting',
    gender: 'female',
  },
  {
    id: 'kebaya',
    label: 'Kebaya',
    emoji: '👘',
    prompt: 'wearing a beautiful traditional Indonesian Kebaya in elegant batik fabric with matching selendang, formal traditional Indonesian attire, elegant portrait',
    gender: 'female',
  },
  {
    id: 'hijab-formal',
    label: 'Hijab Formal',
    emoji: '🧕',
    prompt: 'wearing a professional hijab in elegant silk fabric, coordinated formal blazer outfit, professional Indonesian Muslim woman business portrait',
    gender: 'female',
  },
]

export const REKREASI_OPTIONS: PromptOption[] = [
  { id: 'bali', label: 'Bali', emoji: '🌺', prompt: 'standing in a beautiful Bali rice terrace or near Tanah Lot temple, golden hour lighting, tropical lush greenery, relaxed vacation style' },
  { id: 'raja-ampat', label: 'Raja Ampat', emoji: '🐠', prompt: 'standing on a pristine white sand beach in Raja Ampat Papua with crystal clear turquoise water, tropical paradise, golden hour' },
  { id: 'lombok', label: 'Lombok', emoji: '🏄', prompt: 'at Lombok beach with Mount Rinjani in the background, tropical beach vacation setting, natural beauty' },
  { id: 'jepang', label: 'Jepang', emoji: '🗾', prompt: 'in Japan, surrounded by pink sakura cherry blossom trees in full bloom, Tokyo or Kyoto background, spring light' },
  { id: 'korea', label: 'Korea', emoji: '🌸', prompt: 'in South Korea, N Seoul Tower or Gyeongbokgung Palace background, vibrant K-lifestyle aesthetic, modern Seoul cityscape' },
  { id: 'swiss', label: 'Swiss', emoji: '🏔️', prompt: 'in Switzerland, majestic Swiss Alps mountain backdrop with snow-capped peaks, Interlaken or Lucerne, perfect travel photo' },
  { id: 'paris', label: 'Paris', emoji: '🗼', prompt: 'in Paris, France, with the Eiffel Tower prominently in the background, romantic Parisian atmosphere, golden hour lighting' },
  { id: 'maldives', label: 'Maldives', emoji: '🏝️', prompt: 'in the Maldives, standing on an overwater bungalow deck or white sand beach, crystal clear turquoise Indian Ocean, luxury tropical paradise' },
  { id: 'dubai', label: 'Dubai', emoji: '🌆', prompt: 'in Dubai with the Burj Khalifa and modern skyline in the background, luxury urban atmosphere, dramatic evening golden light' },
]

export const FUTURISTIK_OPTIONS: PromptOption[] = [
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖', prompt: 'in a futuristic cyberpunk city, neon lights (blue, purple, pink), holographic billboards, rain-slicked streets, ultra-modern cyberpunk fashion, cinematic lighting' },
  { id: 'astronot', label: 'Astronot', emoji: '🚀', prompt: 'wearing a NASA-style spacesuit or advanced futuristic space suit, in outer space or on a space station, Earth visible in background, dramatic space lighting' },
  { id: 'metaverse', label: 'Metaverse', emoji: '🌐', prompt: 'in a vibrant digital metaverse world, surrounded by floating neon geometric shapes, virtual reality landscape, digital grid environment, glowing avatar aesthetic' },
  { id: 'kota-masa-depan', label: 'Kota Masa Depan', emoji: '🏙️', prompt: 'in a breathtaking utopian futuristic city, flying vehicles in background, towering glass and light skyscrapers, advanced architecture, soft blue and white palette' },
  { id: 'ai-human', label: 'AI Human', emoji: '🧠', prompt: 'half-human half-digital being, glowing circuit patterns on face and body, holographic neural network background, advanced AI visualization, blue glow aesthetic' },
  { id: 'robot', label: 'Robot / Mech', emoji: '⚙️', prompt: 'in advanced futuristic mech armor suit or exoskeleton, industrial sci-fi warehouse background, dramatic metallic lighting, heroic pose' },
]

export const ERA_KLASIK_OPTIONS: PromptOption[] = [
  { id: '1960', label: '1960an', emoji: '🎵', prompt: 'styled in 1960s fashion, vintage mod clothing, bouffant or pompadour hairstyle, retro color palette, classic 60s American or European aesthetic' },
  { id: '1970', label: '1970an', emoji: '🕺', prompt: 'dressed in 1970s fashion, wide collar shirt or disco attire, bell-bottom trousers, warm earth tones and orange palette, groovy 70s atmosphere' },
  { id: '1980', label: '1980an', emoji: '📼', prompt: 'in 1980s fashion, power shoulder blazer or neon colors, big curly hair, Miami Vice or Dynasty style, vibrant 80s aesthetic' },
  { id: '1990', label: '1990an', emoji: '💿', prompt: 'in 1990s grunge or hip-hop fashion, flannel shirt or baggy clothes, frosted tips or curtain hair, 90s film grain aesthetic' },
  {
    id: 'film-analog', label: 'Film Analog', emoji: '📷',
    prompt: 'photographed on 35mm analog film, beautiful film grain, classic kodachrome colors, nostalgic warm tones, vintage photography aesthetic',
  },
  {
    id: 'kodak', label: 'Kodak Gold', emoji: '🟡',
    prompt: 'shot on Kodak Gold 200 film, characteristic warm golden tones, rich colors, slight vignette, classic Kodak film aesthetic, nostalgic feel',
  },
  {
    id: 'polaroid', label: 'Polaroid', emoji: '🖼️',
    prompt: 'polaroid instant photo style, characteristic washed colors, slight overexposure, soft focus, white border frame, nostalgic instant photo aesthetic',
  },
  {
    id: 'vhs', label: 'VHS', emoji: '📹',
    prompt: 'VHS video tape aesthetic, scan lines, color bleeding, retro 80s-90s home video look, slight distortion and grain, lo-fi video aesthetic',
  },
]

export const ROMANTIS_OPTIONS: PromptOption[] = [
  { id: 'sunset', label: 'Sunset', emoji: '🌅', prompt: 'at a breathtaking golden hour sunset beach or hilltop, warm orange and pink sky, romantic silhouette lighting, dreamy bokeh background' },
  { id: 'sakura', label: 'Sakura', emoji: '🌸', prompt: 'under falling cherry blossom (sakura) petals, magical pink and white flowers, soft spring light filtering through branches, romantic Japanese garden' },
  { id: 'paris-romantic', label: 'Paris', emoji: '🥂', prompt: 'romantic Paris at night, Eiffel Tower glowing in the background, warm café lights, elegant and romantic French atmosphere' },
  { id: 'candle-light', label: 'Candle Light', emoji: '🕯️', prompt: 'in a romantic candlelit setting, warm golden flickering candle light, elegant dinner or intimate ambiance, soft bokeh, warm tones' },
  { id: 'garden-wedding', label: 'Garden Wedding', emoji: '💐', prompt: 'in a beautiful garden wedding setting, white floral arch, blooming roses and greenery, magical golden hour light, elegant wedding atmosphere' },
]

export const ORIGINAL_HD_OPTIONS: PromptOption[] = [
  { id: 'sharpen', label: 'Sharpen', emoji: '🔭', prompt: 'ultra-sharp and crisp image, enhanced clarity, fine detail restoration, tack sharp focus throughout' },
  { id: 'upscale-4k', label: 'Upscale 4K', emoji: '📺', prompt: 'upscaled to 4K resolution, ultra high definition, enhanced pixel density, crystal clear quality' },
  { id: 'upscale-8k', label: 'Upscale 8K', emoji: '🖥️', prompt: 'upscaled to 8K ultra high resolution, maximum detail and clarity, photorealistic enhancement' },
  { id: 'remove-noise', label: 'Remove Noise', emoji: '✨', prompt: 'noise-free, clean image, smooth skin texture, removed digital grain while preserving natural details' },
  { id: 'auto-color', label: 'Auto Color', emoji: '🎨', prompt: 'color corrected and balanced, vibrant and natural colors, professional color grading, perfect white balance and exposure' },
]

export const CUSTOM_AI_QUICK_PROMPTS = [
  'Jadi Presiden Indonesia',
  'Jadi Pebisnis Sukses',
  'Jadi Chef Berbintang',
  'Jadi Atlet Olimpiade',
  'Jadi Musisi Terkenal',
  'Jadi Astronot NASA',
  'Jadi Superstar K-Pop',
  'Lebih Muda 10 Tahun',
  'Lebih Elegan',
  'Tambah Senyum',
  'Ganti Rambut Putih',
  'Ganti ke Luar Angkasa',
]

export function buildPrompt(
  category: StyleCategory,
  optionId: string | null,
  customText: string,
): string {
  let stylePrompt = ''

  if (category === 'custom') {
    stylePrompt = translateCustomPrompt(customText)
  } else {
    const options = getCategoryOptions(category)
    const found = options.find(o => o.id === optionId)
    stylePrompt = found?.prompt ?? ''
  }

  return `
Professional portrait photography of the subject.
Style: ${stylePrompt}
${FACE_LOCK_INSTRUCTION}
High quality, photorealistic, professional studio lighting, sharp focus.
  `.trim()
}

function getCategoryOptions(category: StyleCategory): PromptOption[] {
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

function translateCustomPrompt(indonesian: string): string {
  // Simple keyword translations for common Indonesian phrases
  const translations: Record<string, string> = {
    'presiden': 'as the President of a nation, wearing a formal suit, podium and flags in background',
    'pebisnis': 'as a successful businessman in a luxury office with city view',
    'chef': 'as a professional chef wearing white chef coat, kitchen background',
    'atlet': 'as a professional athlete in sports attire, stadium background',
    'musisi': 'as a famous musician on stage with concert lights',
    'astronot': 'as a NASA astronaut in spacesuit with Earth in background',
    'k-pop': 'as a K-pop idol with colorful stage outfit, concert stage',
    'lebih muda': 'rejuvenated, younger looking face, smooth skin, vibrant appearance',
    'elegan': 'wearing elegant high-fashion attire, sophisticated styling',
    'senyum': 'with a warm, natural, beautiful smile',
    'rambut putih': 'with distinguished silver/white hair, premium look',
    'luar angkasa': 'floating in outer space with stars and nebula background',
    'paris': 'in Paris France with Eiffel Tower background',
    'bali': 'in Bali Indonesia with tropical rice terraces',
    'samurai': 'as a Japanese samurai warrior in traditional armor',
    'viking': 'as a Norse Viking warrior in ancient armor',
    'superhero': 'as a superhero in a dramatic costume with city background',
    'ganti baju': 'wearing elegant formal attire',
    'ganti latar': 'with a professional studio background',
    'tambah': 'enhanced with',
  }

  let result = indonesian.toLowerCase()
  for (const [id, en] of Object.entries(translations)) {
    if (result.includes(id)) {
      return en
    }
  }

  // Fallback: append to generic professional portrait
  return `the subject styled as: ${indonesian}. Professional photography style.`
}

// Mock image URLs for demo mode (no API key)
export const MOCK_IMAGES: Record<string, string[]> = {
  'formal': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=700&fit=crop&crop=face',
  ],
  'rekreasi': [
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=700&fit=crop',
  ],
  'futuristik': [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=500&h=700&fit=crop',
  ],
  'era-klasik': [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=700&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop&crop=face',
  ],
  'romantis': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=700&fit=crop',
    'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=500&h=700&fit=crop',
  ],
  'original-hd': [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=700&fit=crop&crop=face',
  ],
  'custom': [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=700&fit=crop&crop=face',
  ],
}
