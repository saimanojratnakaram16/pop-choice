import { useState } from 'react'

const RESULTS_PER_PAGE = 3

const Results = ({ recommendations }) => {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(recommendations.length / RESULTS_PER_PAGE))
  const pageStart = page * RESULTS_PER_PAGE
  const pageSlice = recommendations.slice(pageStart, pageStart + RESULTS_PER_PAGE)

  if (!recommendations || recommendations.length === 0) {
    return <div className="mt-6 text-slate-300">No movie recommendations were found.</div>
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {pageSlice.map((item, index) => (
          <article key={`${item.movie ?? 'movie'}-${pageStart + index}`} className="rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-xl shadow-slate-950/20">
            <h3 className="text-xl font-semibold text-slate-100">{item.movie || `Movie ${pageStart + index + 1}`}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.reason || 'No reason provided.'}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Showing {pageStart + 1} – {Math.min(pageStart + RESULTS_PER_PAGE, recommendations.length)} of {recommendations.length} movies.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage(Math.max(page - 1, 0))}
            disabled={page === 0}
            className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-700"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="rounded-2xl border border-slate-700 bg-violet-500 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-violet-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results