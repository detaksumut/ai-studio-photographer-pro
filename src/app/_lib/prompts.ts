// Prompt library — maps Indonesian style options to detailed English AI prompts
// Face preservation instruction appended to all prompts

export const FACE_LOCK_INSTRUCTION = `
IMPORTANT: Preserve the exact face, facial features, skin tone, gender, hair style, and identity of the subject from the reference photo. 
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
  gender?: 'all' | 'pria' | 'wanita'
}

// 1. ORIGINAL HD
export const ORIGINAL_HD_OPTIONS: PromptOption[] = [
  { id: 'auto-enhance', label: 'Auto Enhance', emoji: '✨', prompt: 'auto enhanced photo quality, color corrected, balanced exposure, optimized contrast, high fidelity portrait' },
  { id: '4k', label: '4K', emoji: '📺', prompt: 'ultra-high resolution 4K photo, crystal clear details, sharp focus, professional camera quality' },
  { id: '8k', label: '8K', emoji: '🖥️', prompt: 'maximum detail 8K ultra high resolution, perfect rendering of textures, photorealistic masterpiece' },
  { id: 'sharpen', label: 'Sharpen', emoji: '🔭', prompt: 'tack sharp focus, enhanced fine details, high clarity, crisp edges' },
  { id: 'remove-noise', label: 'Remove Noise', emoji: '🧹', prompt: 'clean image, smooth noise-free surfaces, high ISO reduction, preserved details' },
]

// 2. FORMAL
export const FORMAL_OPTIONS: PromptOption[] = [
  // Pria / Umum
  { id: 'ceo', label: 'CEO', emoji: '💼', prompt: 'wearing a premium black tailored business suit, crisp white dress shirt, silk tie, confident CEO pose, modern corporate office background with city skyline', gender: 'pria' },
  { id: 'executive', label: 'Executive', emoji: '🤝', prompt: 'wearing a sharp navy executive suit with subtle pinstripe, gold cufflinks, professional executive portrait, blurred modern office background', gender: 'pria' },
  { id: 'jas-hitam', label: 'Jas Hitam', emoji: '🧥', prompt: 'wearing a formal classic black suit, white dress shirt, black tie, formal professional portrait, clean studio background', gender: 'pria' },
  { id: 'jas-biru', label: 'Jas Biru', emoji: '👔', prompt: 'wearing an elegant navy blue suit, white shirt, patterned blue tie, professional executive pose, modern office setting', gender: 'pria' },
  { id: 'batik', label: 'Batik', emoji: '🥻', prompt: 'wearing a premium Indonesian traditional batik shirt with elegant patterns, formal modern batik attire, professional portrait', gender: 'pria' },
  { id: 'polisi', label: 'Polisi', emoji: '🚔', prompt: 'wearing an Indonesian police (POLRI) official uniform with badge and rank insignia, professional police portrait', gender: 'pria' },
  { id: 'tentara', label: 'Tentara', emoji: '🎖️', prompt: 'wearing an Indonesian military (TNI) official uniform with medals and rank insignia, patriotic military portrait background', gender: 'pria' },
  { id: 'dokter', label: 'Dokter', emoji: '🩺', prompt: 'wearing a white doctor coat, stethoscope around neck, name badge, standing in a modern hospital or clinic background, professional medical portrait', gender: 'pria' },
  { id: 'pengacara', label: 'Pengacara', emoji: '⚖️', prompt: 'wearing a formal dark lawyer suit with white shirt and tie, holding documents, law office with bookshelves in background', gender: 'pria' },
  { id: 'pilot', label: 'Pilot', emoji: '✈️', prompt: 'wearing a professional airline pilot uniform with gold epaulettes and wings badge, pilot cap, standing in front of an airplane', gender: 'pria' },
  { id: 'guru', label: 'Guru', emoji: '📚', prompt: 'wearing smart casual professional teacher attire, classroom or school background with bookshelf, warm and approachable expression', gender: 'pria' },
  { id: 'perawat', label: 'Perawat', emoji: '🏥', prompt: 'wearing a clean professional nurse uniform, stethoscope, warm friendly smiling nurse portrait in clinical setting', gender: 'pria' },

  // Wanita
  { id: 'blazer', label: 'Blazer', emoji: '🧥', prompt: 'wearing an elegant tailored womens business blazer, professional chic attire, modern studio background, confident female executive portrait', gender: 'wanita' },
  { id: 'kebaya', label: 'Kebaya', emoji: '👗', prompt: 'wearing a beautiful traditional Indonesian Kebaya with intricate lace and elegant batik sarong, traditional Indonesian wedding or formal look, elegant female portrait', gender: 'wanita' },
  { id: 'hijab-formal', label: 'Hijab Formal', emoji: '🧕', prompt: 'wearing a professional high-quality hijab, matching elegant formal blazer and blouse, professional modern Muslim woman portrait, corporate office background', gender: 'wanita' },
  { id: 'dokter-wanita', label: 'Dokter', emoji: '🩺', prompt: 'wearing a professional white doctor coat over a stylish blouse, stethoscope around neck, standing in a clean modern hospital clinic, warm friendly female doctor portrait', gender: 'wanita' },
  { id: 'ceo-woman', label: 'CEO Woman', emoji: '👩‍💼', prompt: 'wearing an elegant designer womens power suit, chic blouse, sophisticated business woman leader portrait, high-end corporate office background', gender: 'wanita' },
  { id: 'pengacara-wanita', label: 'Pengacara', emoji: '⚖️', prompt: 'wearing a sharp female lawyer business suit, white blouse, professional attorney portrait, law office bookshelves background', gender: 'wanita' },
]

// 3. REKREASI
export const REKREASI_DESTINATIONS = [
  { id: 'bali', label: 'Bali', emoji: '🌺', prompt: 'in beautiful Bali, tropical rice terrace or beach backdrop' },
  { id: 'raja-ampat', label: 'Raja Ampat', emoji: '🐠', prompt: 'in Raja Ampat Papua, pristine tropical beach with crystal clear turquoise water' },
  { id: 'lombok', label: 'Lombok', emoji: '🏄', prompt: 'in Lombok, pristine beaches and scenic Mount Rinjani backdrop' },
  { id: 'jepang', label: 'Jepang', emoji: '🗾', prompt: 'in Japan, cherry blossom sakura gardens in full bloom, Kyoto pagoda in background' },
  { id: 'korea', label: 'Korea', emoji: '🗼', prompt: 'in South Korea, vibrant Seoul streets or historic Gyeongbokgung palace background' },
  { id: 'swiss', label: 'Swiss', emoji: '🏔️', prompt: 'in Switzerland, majestic snowy Swiss Alps mountain view, scenic travel photo' },
  { id: 'paris', label: 'Paris', emoji: '🗼', prompt: 'in Paris France, Eiffel Tower backdrop, romantic European setting' },
  { id: 'london', label: 'London', emoji: '🌉', prompt: 'in London UK, Big Ben and Westminster bridge in background, classic British setting' },
  { id: 'maldives', label: 'Maldives', emoji: '🏝️', prompt: 'in the Maldives, luxury overwater bungalow deck, turquoise ocean background' },
  { id: 'dubai', label: 'Dubai', emoji: '🌆', prompt: 'in Dubai, high-tech skyscrapers and Burj Khalifa skyline backdrop, golden evening sun' },
]

export const REKREASI_CLOTHES = [
  { id: 'casual', label: 'Casual', emoji: '👕', prompt: 'wearing clean relaxed casual wear like polo or t-shirt' },
  { id: 'fashion', label: 'Fashion', emoji: '🕶️', prompt: 'wearing trendy high-fashion outfit, modern stylish dress or outfit' },
  { id: 'resort', label: 'Resort', emoji: '👒', prompt: 'wearing breezy resort-wear, linen shirt or summer dress' },
  { id: 'elegant', label: 'Elegant', emoji: '✨', prompt: 'wearing elegant smart casual blazer or elegant designer dress' },
  { id: 'beachwear', label: 'Beachwear', emoji: '🏖️', prompt: 'wearing tropical beachwear, floral summer shirt or light sundress' },
]

// Fallback flat list for backward compatibility
export const REKREASI_OPTIONS: PromptOption[] = REKREASI_DESTINATIONS.map(d => ({
  id: d.id,
  label: d.label,
  emoji: d.emoji,
  prompt: `${d.prompt}, wearing resort attire`,
}))

// 4. FUTURISTIK
export const FUTURISTIK_OPTIONS: PromptOption[] = [
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖', prompt: 'in a futuristic cyberpunk city, neon lights (blue, purple, pink), holographic billboards, rain-slicked streets, ultra-modern cyberpunk fashion, cinematic lighting' },
  { id: 'robot', label: 'Robot', emoji: '⚙️', prompt: 'in advanced futuristic mech armor suit or exoskeleton, industrial sci-fi warehouse background, dramatic metallic lighting, heroic pose' },
  { id: 'astronot', label: 'Astronot', emoji: '🚀', prompt: 'wearing a NASA-style spacesuit or advanced futuristic space suit, in outer space or on a space station, Earth visible in background, dramatic space lighting' },
  { id: 'kota-masa-depan', label: 'Kota Masa Depan', emoji: '🏙️', prompt: 'in a breathtaking utopian futuristic city, flying vehicles in background, towering glass and light skyscrapers, advanced architecture, soft blue and white palette' },
  { id: 'ai-human', label: 'AI Human', emoji: '🧠', prompt: 'half-human half-digital being, glowing circuit patterns on face and body, holographic neural network background, advanced AI visualization, blue glow aesthetic' },
  { id: 'metaverse', label: 'Metaverse', emoji: '🌐', prompt: 'in a vibrant digital metaverse world, surrounded by floating neon geometric shapes, virtual reality landscape, digital grid environment, glowing avatar aesthetic' },
  { id: 'space-station', label: 'Space Station', emoji: '🛰️', prompt: 'inside an advanced space station observation deck, giant window showing deep space, stars, and nebula, high tech sci-fi environment' },
]

// 5. ERA KLASIK
export const ERA_KLASIK_DECADES = [
  { id: '1960', label: '1960', emoji: '🎵', prompt: 'styled in 1960s mod fashion, vintage attire, retro hair' },
  { id: '1970', label: '1970', emoji: '🕺', prompt: 'styled in 1970s disco and groovy fashion, wide collars, warm earth tones' },
  { id: '1980', label: '1980', emoji: '📼', prompt: 'styled in 1980s neon fashion, power shoulders, retro pop aesthetic' },
  { id: '1990', label: '1990', emoji: '💿', prompt: 'styled in 1990s grunge or hip-hop fashion, casual retro streetwear' },
]

export const ERA_KLASIK_FILTERS = [
  { id: 'kodak', label: 'Kodak', emoji: '🟡', prompt: 'photographed with Kodak Gold film filter, warm golden tones, vintage analog texture' },
  { id: 'polaroid', label: 'Polaroid', emoji: '🖼️', prompt: 'polaroid instant photo style, soft focus, faded vintage colors, retro white border frame' },
  { id: 'vhs', label: 'VHS', emoji: '📹', prompt: 'VHS tape screenshot effect, retro tracking lines, analog scan lines, nostalgic home video look' },
  { id: 'film-camera', label: 'Film Camera', emoji: '📷', prompt: 'shot on 35mm film camera, classic grain, authentic analog film look, rich colors' },
]

// Fallback flat list for backward compatibility
export const ERA_KLASIK_OPTIONS: PromptOption[] = ERA_KLASIK_DECADES.map(d => ({
  id: d.id,
  label: d.label,
  emoji: d.emoji,
  prompt: `${d.prompt}, vintage film feel`,
}))

// 6. ROMANTIS
export const ROMANTIS_OPTIONS: PromptOption[] = [
  { id: 'sunset', label: 'Sunset', emoji: '🌅', prompt: 'at a breathtaking golden hour sunset beach or hilltop, warm orange and pink sky, romantic silhouette lighting, dreamy bokeh background' },
  { id: 'taman-bunga', label: 'Taman Bunga', emoji: '💐', prompt: 'standing in a lush blooming flower garden, surrounded by thousands of colorful roses and tulips, soft magical sunlight, dreamy atmosphere' },
  { id: 'sakura', label: 'Sakura', emoji: '🌸', prompt: 'under falling cherry blossom (sakura) petals, magical pink and white flowers, soft spring light filtering through branches, romantic Japanese garden' },
  { id: 'paris-romantic', label: 'Paris', emoji: '🗼', prompt: 'romantic Paris at night, Eiffel Tower glowing in the background, warm café lights, elegant and romantic French atmosphere' },
  { id: 'candle-light', label: 'Candle Light', emoji: '🕯️', prompt: 'in a romantic candlelit setting, warm golden flickering candle light, elegant dinner or intimate ambiance, soft bokeh, warm tones' },
  { id: 'wedding-style', label: 'Wedding Style', emoji: '👰', prompt: 'in a beautiful garden wedding setting, white floral arch, blooming roses and greenery, magical golden hour light, elegant wedding atmosphere' },
]

// 7. CUSTOM AI
export const CUSTOM_AI_QUICK_PROMPTS = [
  'jadi presiden',
  'jadi pemain golf',
  'jadi chef',
  'jadi kapten kapal',
  'jadi petani modern',
  'jadi pebisnis sukses',
]

// Suggested modification prompts (for GANTI button)
export const MODIFICATION_SUGGESTIONS = [
  'ganti baju merah',
  'ganti ke Paris malam',
  'lebih muda 10 tahun',
  'senyum sedikit',
  'kulit lebih cerah',
]

export function buildPrompt(
  category: StyleCategory,
  optionId: string | null,
  customText: string,
  extraParams?: {
    recreationClothes?: string | null
    eraClassicFilter?: string | null
    faceProfile?: string | null
  }
): string {
  let stylePrompt = ''

  if (category === 'custom') {
    stylePrompt = translateCustomPrompt(customText)
  } else if (category === 'rekreasi') {
    const dest = REKREASI_DESTINATIONS.find(d => d.id === optionId)
    const clothesId = extraParams?.recreationClothes
    const clothes = REKREASI_CLOTHES.find(c => c.id === clothesId)
    stylePrompt = `${dest ? dest.prompt : 'in a vacation spot'}, ${clothes ? clothes.prompt : 'wearing stylish vacation clothes'}`
  } else if (category === 'era-klasik') {
    const decade = ERA_KLASIK_DECADES.find(d => d.id === optionId)
    const filterId = extraParams?.eraClassicFilter
    const filter = ERA_KLASIK_FILTERS.find(f => f.id === filterId)
    stylePrompt = `${decade ? decade.prompt : 'in a classic retro style'}, ${filter ? filter.prompt : 'vintage look'}`
  } else {
    const options = getCategoryOptions(category)
    const found = options.find(o => o.id === optionId)
    stylePrompt = found?.prompt ?? ''
  }

  let faceDesc = extraParams?.faceProfile?.trim() || ''
  if (faceDesc && faceDesc.endsWith('.')) {
    faceDesc = faceDesc.slice(0, -1).trim()
  }

  const promptSentence = faceDesc
    ? `Professional portrait photography of the subject: ${faceDesc}, ${stylePrompt}.`
    : `Professional portrait photography of the subject, ${stylePrompt}.`

  return `
${promptSentence}
${FACE_LOCK_INSTRUCTION}
High quality, photorealistic, professional studio lighting, sharp focus.
  `.trim()
}

function getCategoryOptions(category: StyleCategory): PromptOption[] {
  switch (category) {
    case 'formal':      return FORMAL_OPTIONS
    case 'original-hd': return ORIGINAL_HD_OPTIONS
    case 'futuristik':  return FUTURISTIK_OPTIONS
    case 'romantis':    return ROMANTIS_OPTIONS
    default:            return []
  }
}

export function translateCustomPrompt(indonesian: string): string {
  if (indonesian.startsWith('ai-translated:')) {
    return indonesian.replace('ai-translated:', '').trim()
  }

  const translations: Record<string, string> = {
    'jadi presiden': 'as a distinguished national President, wearing a premium custom tailored formal suit with a patriotic flag pin, standing behind a stately press conference podium with national flags in a grand hall background, professional presidential portrait, confident expression',
    'jadi pemain golf': 'as a professional golfer in stylish golf attire (polo shirt, golf glove, cap), standing on a lush green golf course fairway under clear blue sky, holding a golf club, mid-swing or confident post-shot pose, beautiful morning light',
    'jadi chef': 'as an executive professional chef, wearing a clean double-breasted white chef jacket, standing in a busy modern high-end restaurant kitchen with blurred stainless steel equipment and warm lights, warm and confident expression',
    'jadi kapten kapal': 'as an authoritative ship captain, wearing a white naval officer uniform with gold epaulettes and officer hat, standing on the bridge of a luxury vessel or cruise ship, ocean background visible through the window, strong and confident pose',
    'jadi petani modern': 'as a modern high-tech farmer, wearing smart casual work wear, standing in a high-tech smart greenhouse or vertical farm with hydroponic plants and LED grow lights, holding a digital tablet, clean and optimistic expression',
    'jadi pebisnis sukses': 'as a highly successful global business tycoon, wearing an ultra-luxurious tailored business suit, sitting in a penthouse corner office with floor-to-ceiling windows showing a modern city skyline at sunset, premium and powerful portrait',
    
    // Professional profiles
    'jas hitam resmi': 'wearing a formal classic black suit, white dress shirt, black tie, formal professional portrait, clean studio background',
    'jas hitam': 'wearing a formal classic black suit, white dress shirt, black tie, formal professional portrait, clean studio background',
    'jas biru': 'wearing an elegant navy blue suit, white shirt, patterned blue tie, professional executive pose, modern office setting',
    'batik premium': 'wearing a premium Indonesian traditional batik shirt with elegant patterns, formal modern batik attire, professional portrait',
    'batik': 'wearing a premium Indonesian traditional batik shirt with elegant patterns, formal modern batik attire, professional portrait',
    'ceo': 'wearing a premium black tailored business suit, crisp white dress shirt, silk tie, confident CEO pose, modern corporate office background with city skyline',
    'polisi': 'wearing an Indonesian police (POLRI) official uniform with badge and rank insignia, professional police portrait',
    'tentara': 'wearing an Indonesian military (TNI) official uniform with medals and rank insignia, patriotic military portrait background',
    'dokter': 'wearing a white doctor coat, stethoscope around neck, name badge, standing in a modern hospital or clinic background, professional medical portrait',
    'perawat': 'wearing a clean professional nurse uniform, stethoscope, warm friendly smiling nurse portrait in clinical setting',
    'pilot': 'wearing a professional airline pilot uniform with gold epaulettes and wings badge, pilot cap, standing in front of an airplane',
    'kebaya': 'wearing a beautiful traditional Indonesian Kebaya with intricate lace and elegant batik sarong, traditional Indonesian wedding or formal look, elegant female portrait',
    'hijab': 'wearing a professional hijab, matching elegant formal blazer and blouse, professional modern Muslim woman portrait, corporate office background',
    'blazer': 'wearing an elegant tailored womens business blazer, professional chic attire, modern studio background, confident female executive portrait',
    'pengacara': 'wearing a formal dark lawyer suit with white shirt and tie, holding documents, law office with bookshelves in background',
    
    // Travel profiles
    'pantai bali': 'in beautiful Bali, tropical rice terrace or beach backdrop, wearing clean relaxed casual resort wear',
    'bali': 'in beautiful Bali, tropical rice terrace or beach backdrop, wearing clean relaxed casual resort wear',
    'raja ampat': 'in Raja Ampat Papua, pristine tropical beach with crystal clear turquoise water, wearing resort linen clothes',
    'swiss': 'in Switzerland, majestic snowy Swiss Alps mountain view, wearing a stylish winter jacket, scenic travel photo',
    'jepang': 'in Japan, cherry blossom sakura gardens in full bloom, Kyoto pagoda in background, casual fashion wear',
    'paris malam': 'standing in Paris at night, romantic glowing Eiffel Tower in the background, warm city lights, ambient night portrait',
    'paris': 'standing in Paris, Eiffel Tower in the background, golden hour lighting, stylish clothes',
    'maldives': 'in the Maldives, luxury overwater bungalow deck, turquoise ocean background, wearing beachwear',
    'lombok': 'in Lombok, pristine beaches and scenic Mount Rinjani backdrop, wearing light vacation clothes',
    'korea': 'in South Korea, vibrant Seoul streets or historic Gyeongbokgung palace background, modern casual wear',
    'london': 'in London UK, Big Ben and Westminster bridge in background, classic British setting',
    'dubai': 'in Dubai, high-tech skyscrapers and Burj Khalifa skyline backdrop, golden evening sun, elegant outfit',

    // Creative / Sci-fi / Romance
    'cyberpunk': 'in a futuristic cyberpunk city, neon lights (blue, purple, pink), holographic billboards, rain-slicked streets, ultra-modern cyberpunk fashion, cinematic lighting',
    'astronot': 'wearing a NASA-style spacesuit or advanced futuristic space suit, in outer space or on a space station, Earth visible in background, dramatic space lighting',
    'kota masa depan': 'in a breathtaking utopian futuristic city, flying vehicles in background, towering glass and light skyscrapers, advanced architecture, soft blue and white palette',
    'robot': 'in advanced futuristic mech armor suit or exoskeleton, industrial sci-fi warehouse background, dramatic metallic lighting, heroic pose',
    'metaverse': 'in a vibrant digital metaverse world, surrounded by floating neon geometric shapes, virtual reality landscape, digital grid environment, glowing avatar aesthetic',
    'taman bunga': 'standing in a lush blooming flower garden, surrounded by thousands of colorful roses and tulips, soft magical sunlight, dreamy atmosphere',
    'sakura': 'under falling cherry blossom (sakura) petals, magical pink and white flowers, soft spring light filtering through branches, romantic Japanese garden',
    'candle light': 'in a romantic candlelit setting, warm golden flickering candle light, elegant dinner or intimate ambiance, soft bokeh, warm tones',
    'wedding': 'in a beautiful garden wedding setting, white floral arch, blooming roses and greenery, magical golden hour light, elegant wedding atmosphere',
    
    // Filters
    'kodak': 'photographed with Kodak Gold film filter, warm golden tones, vintage analog texture',
    'polaroid': 'polaroid instant photo style, soft focus, faded vintage colors, retro white border frame',
    'vhs': 'VHS tape screenshot effect, retro tracking lines, analog scan lines, nostalgic home video look',
    'film camera': 'shot on 35mm film camera, classic grain, authentic analog film look, rich colors',
    
    // Original HD
    'auto enhance': 'auto enhanced photo quality, color corrected, balanced exposure, optimized contrast, high fidelity portrait',
    'upscale 4k': 'ultra-high resolution 4K photo, crystal clear details, sharp focus, professional camera quality',
    'upscale 8k': 'maximum detail 8K ultra high resolution, perfect rendering of textures, photorealistic masterpiece',
    'sharpen': 'tack sharp focus, enhanced fine details, high clarity, crisp edges',
    'remove noise': 'clean image, smooth noise-free surfaces, high ISO reduction, preserved details',

    // Modification prompts
    'ganti baju merah': 'wearing a stunning tailored vibrant red formal outfit, red blazer or red suit, elegant fashion portrait',
    'ganti ke paris malam': 'standing in Paris at night, romantic glowing Eiffel Tower in the background, warm city lights, ambient night portrait',
    'lebih muda 10 tahun': 'rejuvenated appearance, 10 years younger look, smooth flawless skin, youthful facial features, fresh and energetic expression',
    'senyum sedikit': 'with a gentle subtle warm smile, friendly facial expression, approachable portrait',
    'kulit lebih cerah': 'bright glowing skin, radiant luminous skin tone, flawless complexion, professional portrait lighting',
  }

  let result = indonesian.toLowerCase().trim()
  
  // Direct matching
  if (translations[result]) {
    return translations[result]
  }

  // Soft/Partial matches
  for (const [id, en] of Object.entries(translations)) {
    if (result.includes(id)) {
      return en
    }
  }

  // Dynamic replacements for colors/locations
  if (result.startsWith('ganti baju ') || result.startsWith('ganti pakaian ')) {
    const color = result.replace(/ganti baju |ganti pakaian /, '').trim()
    return `wearing elegant clothing in a beautiful tailored ${color} shade, formal outfit`
  }

  if (result.startsWith('ganti ke ') || result.startsWith('ganti latar ')) {
    const place = result.replace(/ganti ke |ganti latar /, '').trim()
    return `standing in ${place}, beautiful professional photographic background`
  }

  // Fallback
  return `the subject styled as: ${indonesian}. Professional photography style.`
}

// Mock image pool
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
