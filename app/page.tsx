export default function Home() {
  return (
    <>
      <header className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-[720px] items-center justify-between px-4 py-5 sm:px-0">
          <div className="flex flex-col">
            <a
              href="/"
              aria-label="Home"
              className="font-sans text-[15px] font-medium tracking-[-0.04em] text-[var(--color-foreground)]"
            >
              kevinrizki
            </a>

            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
              You can't improve what you can't measure.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center text-[11px] leading-none text-[var(--color-foreground)]"
          >
            ○
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[720px] flex-1 items-center px-4 py-20 sm:px-0 sm:py-28">
        <p className="font-mono text-sm tracking-[0.12em] text-[var(--color-muted)] uppercase">
          Coming soon.
        </p>
      </main>
    </>
  );
}
