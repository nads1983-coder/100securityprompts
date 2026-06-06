export default function LoadingGeneratedContentDetail() {
  return (
    <main className="min-h-screen bg-soft px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-lg border border-line bg-panel p-5 shadow-line">
        <div className="h-4 w-32 animate-pulse rounded bg-line" />
        <div className="mt-6 h-8 w-3/4 animate-pulse rounded bg-line" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-md bg-soft" />
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-4 animate-pulse rounded bg-line" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-line" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
        </div>
      </section>
    </main>
  );
}
