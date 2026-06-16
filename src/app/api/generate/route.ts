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

    // Check client header first, then env variable
    const clientApiKey = request.headers.get('X-Gemini-Key')
    const GEMINI_API_KEY = clientApiKey || process.env.GEMINI_API_KEY

    let faceProfile = ''
    if (GEMINI_API_KEY && imageData) {
      faceProfile = await getFaceDescription(imageData, GEMINI_API_KEY)
    }

    const englishPrompt = buildPrompt(style, option, customPrompt, {
      recreationClothes,
      eraClassicFilter,
      faceProfile
    })

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

async function getFaceDescription(imageData: string, apiKey: string): Promise<string> {
  try {
    const mimeMatch = imageData.match(/^data:(.+?);base64,/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const base64Data = imageData.replace(/^data:.+;base64,/, '')

    // Describe the face details using gemini-2.0-flash
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this portrait. Describe the person's head and face in detail for an image generator prompt (describe age, gender, ethnicity/nationality, skin tone, hair style/color, facial hair, glasses, face shape, and expression). Do not describe clothing, body, or background. Keep the description under 30 words and write it in English." },
              {
                inlineData: { mimeType, data: base64Data }
              }
            ]
          }]
        })
      }
    )

    if (!res.ok) {
      console.warn('Failed to describe face with gemini-2.0-flash, trying 1.5-flash fallback...')
      const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analyze this portrait. Describe the person's head and face in detail for an image generator prompt (describe age, gender, ethnicity/nationality, skin tone, hair style/color, facial hair, glasses, face shape, and expression). Do not describe clothing, body, or background. Keep the description under 30 words and write it in English." },
                {
                  inlineData: { mimeType, data: base64Data }
                }
              ]
            }]
          })
        }
      )
      if (!fallbackRes.ok) return ''
      const data = await fallbackRes.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
    }

    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
  } catch (err) {
    console.error('getFaceDescription error:', err)
    return ''
  }
}
