import { NextResponse } from 'next/server'
import { buildPrompt, MOCK_IMAGES, type StyleCategory } from '../../_lib/prompts'

export const runtime = 'nodejs'

interface GenerateRequest {
  imageData: string        // base64 of uploaded photo
  style: StyleCategory
  option: string | null
  customPrompt: string
  recreationClothes?: string | null
  eraClassicFilter?: string | null
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { imageData, style, option, customPrompt, recreationClothes, eraClassicFilter } = body

    if (!style) {
      return NextResponse.json({ error: 'Style wajib dipilih.' }, { status: 400 })
    }

    const englishPrompt = buildPrompt(style, option, customPrompt, { recreationClothes, eraClassicFilter })
    
    // Check client header first, then env variable
    const clientApiKey = request.headers.get('X-Gemini-Key')
    const GEMINI_API_KEY = clientApiKey || process.env.GEMINI_API_KEY

    // ── Real AI Mode (Gemini) ────────────────────────────────
    if (GEMINI_API_KEY && imageData) {
      try {
        const parts: unknown[] = [{ text: englishPrompt }]

        // Attach reference image if provided
        if (imageData && imageData.startsWith('data:')) {
          const mimeMatch = imageData.match(/^data:(.+?);base64,/)
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
          const base64Data = imageData.replace(/^data:.+;base64,/, '')
          parts.push({
            inlineData: { mimeType, data: base64Data },
          })
        }

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                responseModalities: ['IMAGE', 'TEXT'],
              },
            }),
          },
        )

        if (!geminiRes.ok) {
          const errText = await geminiRes.text()
          console.error('Gemini API error:', errText)
          throw new Error('Gemini API error: ' + geminiRes.status)
        }

        const geminiData = await geminiRes.json()
        const candidate = geminiData?.candidates?.[0]
        const imagePart = candidate?.content?.parts?.find(
          (p: { inlineData?: { mimeType?: string; data?: string } }) => p.inlineData?.data,
        )

        if (imagePart?.inlineData?.data) {
          const { mimeType, data } = imagePart.inlineData
          return NextResponse.json({
            imageUrl: `data:${mimeType};base64,${data}`,
            prompt: englishPrompt,
            mode: 'ai',
          })
        }
      } catch (aiError) {
        console.error('AI generation failed, falling back to mock:', aiError)
      }
    }

    // ── Mock / Demo Mode ─────────────────────────────────────
    await simulateDelay(1500)
    const mockPool = MOCK_IMAGES[style] ?? MOCK_IMAGES['formal']
    const randomIndex = Math.floor(Math.random() * mockPool.length)
    const mockImageUrl = mockPool[randomIndex] + `&t=${Date.now()}`

    return NextResponse.json({
      imageUrl: mockImageUrl,
      prompt: englishPrompt,
      mode: 'mock',
      notice: GEMINI_API_KEY
        ? 'AI generation failed. Showing demo result.'
        : 'Demo mode — Tambahkan GEMINI_API_KEY di .env.local untuk hasil AI asli.',
    })
  } catch (err) {
    console.error('Generate API error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 },
    )
  }
}

function simulateDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
