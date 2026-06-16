import { NextResponse } from 'next/server'
import { buildPrompt, translateCustomPrompt, type StyleCategory } from '../../_lib/prompts'

export const runtime = 'nodejs'

interface GenerateRequest {
  imageData: string        // base64 of uploaded photo
  style: StyleCategory
  option: string | null
  customPrompt: string
  recreationClothes?: string | null
  eraClassicFilter?: string | null
  isLicensed?: boolean
  trialsUsed?: number
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { imageData, style, option, customPrompt, recreationClothes, eraClassicFilter, isLicensed, trialsUsed } = body

    if (!style) {
      return NextResponse.json({ error: 'Style wajib dipilih.' }, { status: 400 })
    }

    // Check client header first, then env variable
    const clientApiKey = request.headers.get('X-Gemini-Key')
    let GEMINI_API_KEY = clientApiKey

    if (!GEMINI_API_KEY) {
      const isTrialExhausted = trialsUsed !== undefined && trialsUsed >= 5
      if (isLicensed || isTrialExhausted) {
        return NextResponse.json(
          { error: 'Batas uji coba selesai. Silakan masukkan API Key Gemini Anda sendiri di menu Pengaturan (ikon ⚙️ di kanan atas).' },
          { status: 400 }
        )
      }
      const defaultKeyEncoded = 'QVEuQWI4Uk42SXB4VE9zaVREMV8tb29oZWZlaXBBSVlqRVJmcmpRbk9Mal9sSGRHWkpMbUE='
      const defaultKey = Buffer.from(defaultKeyEncoded, 'base64').toString('utf-8')
      GEMINI_API_KEY = process.env.GEMINI_API_KEY || defaultKey
    }


    let faceProfile = ''
    if (GEMINI_API_KEY && imageData) {
      faceProfile = await getFaceDescription(imageData, GEMINI_API_KEY)
    }

    let translatedCustomPrompt = customPrompt
    if (style === 'custom' && GEMINI_API_KEY && customPrompt) {
      const staticTranslated = translateCustomPrompt(customPrompt)
      if (staticTranslated.startsWith('the subject styled as:')) {
        const aiTranslated = await translatePromptWithAI(customPrompt, GEMINI_API_KEY)
        if (aiTranslated) {
          translatedCustomPrompt = `ai-translated: ${aiTranslated}`
        }
      }
    }

    const englishPrompt = buildPrompt(style, option, translatedCustomPrompt, {
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

        const modelsToTry = [
          { name: 'imagen-4.0-generate-001', type: 'generateImages' },
          { name: 'imagen-4.0-fast-generate-001', type: 'generateImages' },
          { name: 'imagen-3.0-generate-002', type: 'generateImages' },
          { name: 'gemini-2.5-flash-image', type: 'generateContent' },
          { name: 'imagen-3.0-generate-002', type: 'predict' },
        ]

        let geminiRes: Response | null = null
        let lastErrorText = ''
        let successfulModel = modelsToTry[0]
        const errors: string[] = []

        for (const item of modelsToTry) {
          try {
            let endpoint = item.type
            let requestBody: any = {}

            if (endpoint === 'generateImages') {
              requestBody = {
                prompt: {
                  text: englishPrompt
                },
                numberOfImages: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: "2:3"
              }
            } else if (endpoint === 'predict') {
              requestBody = {
                instances: [
                  {
                    prompt: englishPrompt
                  }
                ],
                parameters: {
                  sampleCount: 1,
                  aspectRatio: "2:3",
                  outputMimeType: "image/jpeg"
                }
              }
            } else {
              requestBody = {
                contents: [{ parts }],
                generationConfig: {
                  responseModalities: ['IMAGE', 'TEXT'],
                },
              }
            }

            const tempRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${item.name}:${endpoint}?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
              }
            )

            if (tempRes.ok) {
              geminiRes = tempRes
              successfulModel = item
              break
            } else {
              lastErrorText = await tempRes.text()
              console.warn(`Model ${item.name} (${item.type}) failed (${tempRes.status}):`, lastErrorText)
              errors.push(`${item.name} (${item.type}) -> ${tempRes.status}: ${lastErrorText}`)
            }
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            console.warn(`Fetch for model ${item.name} (${item.type}) threw error:`, e)
            errors.push(`${item.name} (${item.type}) error: ${msg}`)
            lastErrorText = msg
          }
        }

        if (!geminiRes) {
          throw new Error(`Semua model generasi gambar gagal.\n\nDetail:\n${errors.join('\n')}`)
        }

        const geminiData = await geminiRes.json()

        if (successfulModel.type === 'generateImages') {
          const base64Data = geminiData?.generatedImages?.[0]?.image?.imageBytes
          if (base64Data) {
            return NextResponse.json({
              imageUrl: `data:image/jpeg;base64,${base64Data}`,
              prompt: englishPrompt,
              mode: 'ai',
            })
          }
        } else if (successfulModel.type === 'predict') {
          const base64Data = geminiData?.predictions?.[0]?.bytesBase64Encoded
          const mimeType = geminiData?.predictions?.[0]?.mimeType || 'image/jpeg'
          if (base64Data) {
            return NextResponse.json({
              imageUrl: `data:${mimeType};base64,${base64Data}`,
              prompt: englishPrompt,
              mode: 'ai',
            })
          }
        } else {
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
        }

        throw new Error('Respons API tidak mengandung data gambar.')
      } catch (aiError) {
        console.error('AI generation failed:', aiError)
        return NextResponse.json(
          { error: `Gagal memproses gambar AI: ${aiError instanceof Error ? aiError.message : 'Kesalahan tidak diketahui'}` },
          { status: 500 }
        )
      }

    } else {
      return NextResponse.json(
        { error: 'Foto belum diupload atau data gambar tidak valid.' },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error('Generate API error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 },
    )
  }
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

async function translatePromptWithAI(indonesianPrompt: string, apiKey: string): Promise<string> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Translate and expand this Indonesian photo style or modification command into a descriptive English prompt for an AI image generator (focusing on clothing, background, setting, and atmosphere). Keep it descriptive but concise (under 25 words). Do not describe the person's face, body, or gender. Just translate the style request. Example: 'ganti jas hitam' -> 'wearing a formal black suit, studio background'. Command: '" + indonesianPrompt + "'" }
            ]
          }]
        })
      }
    )

    if (!res.ok) {
      console.warn('Failed to translate prompt with gemini-2.0-flash, trying 1.5-flash fallback...')
      const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Translate and expand this Indonesian photo style or modification command into a descriptive English prompt for an AI image generator (focusing on clothing, background, setting, and atmosphere). Keep it descriptive but concise (under 25 words). Do not describe the person's face, body, or gender. Just translate the style request. Example: 'ganti jas hitam' -> 'wearing a formal black suit, studio background'. Command: '" + indonesianPrompt + "'" }
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
    console.error('translatePromptWithAI error:', err)
    return ''
  }
}

