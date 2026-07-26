import { openai, supabase } from '../config/ai-config.js';

function buildQuery(usersChoiceData) {
  return usersChoiceData
    .map((choice, index) => {
      const favMovie = choice.favMovie?.trim() || 'none'
      const mood = choice.mood?.trim() || 'any'
      const genre = choice.genre?.trim() || 'any'
      return `User ${index + 1}: favorite movie=${favMovie}, mood=${mood}, genre=${genre}`
    })
    .join(' | ')
}

async function createEmbedding(query) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  })
  return response.data?.[0]?.embedding
}

export async function findClosestMovies(usersChoiceData) {
  if (!Array.isArray(usersChoiceData) || usersChoiceData.length === 0) {
    return []
  }

  const query = buildQuery(usersChoiceData)
  const embedding = await createEmbedding(query)

  const { data, error } = await supabase.rpc('match_movies', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 4,
  })

  if (error) {
    console.error('Supabase vector search error:', error)
    throw new Error('Unable to retrieve movie recommendations from the database.')
  }

  return Array.isArray(data) ? data : []
}

export async function generateRecommendationText(matches, usersChoiceData) {
  const userContext = usersChoiceData
    .map((choice, index) => `User ${index + 1}: favorite movie=${choice.favMovie || 'none'}, mood=${choice.mood || 'any'}, genre=${choice.genre || 'any'}`)
    .join('\n')

  const movieContext = matches
    .map((item, index) => `Movie ${index + 1}: ${item.content}`)
    .join('\n\n')

  const messages = [
    {
      role: 'system',
      content: `You are an enthusiastic movie expert who recommends the best matches for a small group. 
      Use the provided movies and user preferences to make a helpful recommendation. 
      If you cannot answer from the available context, say you are unsure.`,
    },
    {
      role: 'user',
      content: `User preferences:\n${userContext}\n\nMatched movies:\n${movieContext}`,
    },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 1,
    frequency_penalty: 0.5,
    max_tokens: 250,
  })

  return response.choices?.[0]?.message?.content || ''
}

export async function generateMovieRecommendations(matches, usersChoiceData) {
  try {
    const text = await generateRecommendationText(matches, usersChoiceData)
    if (!text || typeof text !== 'string') return []

    // Try splitting by numbered list (e.g., "1. Title - reason")
    let parts = text.split(/\n\s*\d+\.\s*/).map(p => p.trim()).filter(Boolean)

    // If that yields only one part, try splitting by double newlines
    if (parts.length === 1) {
      parts = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    }

    const recommendations = parts.map(part => {
      // Try to extract a title and reason separated by common separators
      const sepMatch = part.match(/^\s*["“]?([^"”\n]+?)["”]?\s*(?:[:\-–—]\s*)([\s\S]*)$/)
      if (sepMatch) {
        return { movie: sepMatch[1].trim(), reason: sepMatch[2].trim() }
      }

      // Fallback: find first separator character
      const dashIdx = part.search(/[:\-–—]/)
      if (dashIdx !== -1) {
        return { movie: part.slice(0, dashIdx).trim(), reason: part.slice(dashIdx + 1).trim() }
      }

      // Fallback: first line as title, rest as reason
      const lines = part.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length >= 2) {
        return { movie: lines[0], reason: lines.slice(1).join(' ') }
      }

      // Last resort: return the whole chunk as movie title with empty reason
      return { movie: lines[0] || '', reason: '' }
    })

    return recommendations
  } catch (err) {
    console.error('Error generating movie recommendations:', err)
    return []
  }
}
