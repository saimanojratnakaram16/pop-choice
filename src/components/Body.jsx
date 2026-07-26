import UserChoiceForm from './UserChoiceForm'

function Body({ users, setUsers, usersChoiceData, setUsersChoiceData }) {
  const handleUserCountChange = (event) => {
    const value = Number(event.target.value)
    setUsers(Number.isFinite(value) ? value : 0)
  }

  const isComplete = users > 0 && usersChoiceData.length >= users

  return (
    <section className="mt-8 space-y-8">
      {users <= 0 ? (
        <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/50">
          <label htmlFor="user-count" className="block text-center text-xl font-semibold text-slate-100 sm:text-2xl">
            Please enter the number of users to start the game.
          </label>
          <input
            id="user-count"
            type="number"
            min="1"
            value={users || ''}
            onChange={handleUserCountChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-center text-lg text-slate-100 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
            placeholder="Enter the number of users"
          />
        </div>
      ) : isComplete ? (
        <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/50">
          <h2 className="text-2xl font-bold text-slate-100">All responses submitted</h2>
          <p className="text-sm leading-6 text-slate-400">
            You have entered {usersChoiceData.length} responses for {users} users. The best match results are shown below.
          </p>
        </div>
      ) : (
        <UserChoiceForm
          users={users}
          usersChoiceData={usersChoiceData}
          setUsersChoiceData={setUsersChoiceData}
        />
      )}
    </section>
  )
}

export default Body
