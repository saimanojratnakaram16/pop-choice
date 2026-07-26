const UserChoiceForm = ({ users, usersChoiceData, setUsersChoiceData }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    setUsersChoiceData([...usersChoiceData, data])
    event.target.reset()
  }

  return (
    <section className="space-y-8 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/50">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Create responses for {users} users</h2>
        <p className="text-sm leading-6 text-slate-400 sm:text-base">
          Enter each user&apos;s preferences and track submissions below.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="favMovie" className="block text-lg font-semibold text-slate-100">
            What&apos;s your favorite movie and why?
          </label>
          <textarea
            id="favMovie"
            name="favMovie"
            required
            rows="4"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
            placeholder="Type your answer here"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/90 p-4">
            <legend className="text-lg font-semibold text-slate-100">New or classic?</legend>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="mood" value="new" required className="h-4 w-4 accent-violet-500" />
              New
            </label>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="mood" value="classic" className="h-4 w-4 accent-violet-500" />
              Classic
            </label>
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/90 p-4">
            <legend className="text-lg font-semibold text-slate-100">What mood do you want?</legend>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="genre" value="fun" required className="h-4 w-4 accent-violet-500" />
              Fun
            </label>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="genre" value="serious" className="h-4 w-4 accent-violet-500" />
              Serious
            </label>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="genre" value="inspiring" className="h-4 w-4 accent-violet-500" />
              Inspiring
            </label>
            <label className="flex items-center gap-3 text-slate-200">
              <input type="radio" name="genre" value="scary" className="h-4 w-4 accent-violet-500" />
              Scary
            </label>
          </fieldset>
        </div>

        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-2xl bg-violet-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-violet-500/30 transition hover:bg-violet-400"
        >
          Submit response
        </button>
      </form>

      {/* {usersChoiceData.length > 0 && (
        <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-950/95 p-5">
          <h3 className="text-xl font-semibold text-slate-100">Previous responses</h3>
          <ul className="space-y-4">
            {usersChoiceData.map((entry, index) => (
              <li key={index} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
                <p className="text-sm text-slate-300">Favorite movie: {entry.favMovie}</p>
                <p className="text-sm text-slate-300">Mood: {entry.mood}</p>
                <p className="text-sm text-slate-300">Genre: {entry.genre}</p>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </section>
  )
}

export default UserChoiceForm
