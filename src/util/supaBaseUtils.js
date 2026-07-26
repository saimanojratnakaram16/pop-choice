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

function splitRecommendationBlocks(text) {
  const normalizedText = text.replace(/\r\n/g, '\n').trim()
  if (!normalizedText) return []

  const listBlocks = normalizedText
    .split(/\n(?=(?:\d+[.)]|[-*•])\s)/)
    .map((block) => block.trim())
    .filter(Boolean)

  if (listBlocks.length > 1) return listBlocks

  return normalizedText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
}

function parseRecommendationBlock(block) {
  const cleanedBlock = block.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, '').trim()
  if (!cleanedBlock) return null

  const separatorMatch = cleanedBlock.match(/^(.*?)\s*(?:[:\-–—|])\s*(.+)$/)
  if (separatorMatch) {
    const movie = separatorMatch[1].trim().replace(/^['"“]+|['"”]+$/g, '')
    const reason = separatorMatch[2].trim()

    if (movie && reason) return { movie, reason }
  }

  const lines = cleanedBlock.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  if (lines.length === 0) return null
  if (lines.length === 1) return { movie: lines[0], reason: '' }

  return { movie: lines[0], reason: lines.slice(1).join(' ') }
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
      Return 3 to 5 recommendations as a simple numbered list.
      Format each line like this: "Movie Title — short reason".
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
    if (typeof text !== 'string' || !text.trim()) return []

    return splitRecommendationBlocks(text)
      .map(parseRecommendationBlock)
      .filter(Boolean)
  } catch (err) {
    console.error('Error generating movie recommendations:', err)
    return []
  }
}
