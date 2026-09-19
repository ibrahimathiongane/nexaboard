import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">nexaBoard</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Application de productivité moderne et intuitive pour les petites équipes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Connexion
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}
