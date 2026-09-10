export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Tâches en cours
          </h3>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Projets actifs
          </h3>
          <p className="mt-2 text-3xl font-bold">3</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Notes récentes
          </h3>
          <p className="mt-2 text-3xl font-bold">8</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Événements à venir
          </h3>
          <p className="mt-2 text-3xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
}
