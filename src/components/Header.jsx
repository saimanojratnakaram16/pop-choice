function Header() {
  return (
    <header className="rounded-3xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 p-6 text-center shadow-2xl shadow-fuchsia-500/20">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">PopChoice</h1>
      <p className="mt-2 text-sm text-slate-200 sm:text-base">
        Collect movie preferences from a group and make the next watch session easy.
      </p>
    </header>
  )
}

export default Header
