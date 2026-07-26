import { useEffect, useState } from 'react'

import Header from './components/Header'
import Body from './components/Body'
import Results from './components/Results'
import {
  findClosestMovies,
  generateMovieRecommendations,
} from './util/supaBaseUtils.js'

function App() {
  const [users, setUsers] = useState(0)
  const [usersChoiceData, setUsersChoiceData] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [resultsError, setResultsError] = useState(null)


  useEffect(() => {
    const loadRecommendations = async () => {
      if (users > 0 && usersChoiceData.length >= users) {
        setIsLoadingResults(true)
        setResultsError(null)
        setRecommendations([])

        try {
          const movies = await findClosestMovies(usersChoiceData)
          const nextRecommendations = await generateMovieRecommendations(movies, usersChoiceData)
          setRecommendations(nextRecommendations)
        } catch (error) {
          setResultsError(error?.message || 'Unable to fetch movie recommendations.')
          setRecommendations([])
        } finally {
          setIsLoadingResults(false)
        }
      } else {
        setRecommendations([])
      }
    }

    loadRecommendations()
  }, [users, usersChoiceData])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <Body
          users={users}
          setUsers={setUsers}
          usersChoiceData={usersChoiceData}
          setUsersChoiceData={setUsersChoiceData}
        />

        {users > 0 && usersChoiceData.length >= users && (
          <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/50">
            <h2 className="text-2xl font-bold text-slate-100">Recommendations</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              We found the closest movies, then used AI to summarize the options based on the group&apos;s choices.
            </p>
            {isLoadingResults ? (
              <div className="mt-6 text-slate-200">Loading movie recommendations...</div>
            ) : resultsError ? (
              <div className="mt-6 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">
                {resultsError}
              </div>
            ) : (
              <Results recommendations={recommendations} />
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default App
