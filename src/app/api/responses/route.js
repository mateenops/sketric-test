// File: ./app/api/responses/route.js
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request) {
  try {
    const { instructions, input } = await request.json()

    // Validate required parameters
    if (!input) {
      return NextResponse.json(
        { error: 'Missing required parameter: input' },
        { status: 400 }
      )
    }

    // Kick off the Responses API call without streaming
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      instructions,
      input,
      stream: false
    })

    // Return the complete output
    const { output } = await response
    return NextResponse.json({ output })

  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
