export const metadata = {
  title: 'nexaBoard - Dashboard',
  description: 'Tableau de bord nexaBoard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">nexaBoard</h2>
        </div>
        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Tableau de bord
          </a>
          <a
            href="/dashboard/tasks"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Taches
          </a>
          <a
            href="/dashboard/notes"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Notes
          </a>
          <a
            href="/dashboard/calendar"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Calendrier
          </a>
          <a
            href="/dashboard/projects"
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Projets
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
