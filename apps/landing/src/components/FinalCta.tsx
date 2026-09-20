interface FinalCtaProps {
  onOpenModal: () => void;
}

export default function FinalCta({ onOpenModal }: FinalCtaProps) {
  return (
    <section className="bg-slate-900 py-16 sm:py-20 text-white relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-900/60 px-3 py-1 text-xs font-semibold text-primary-300 border border-primary-500/30 mb-6">
          🚀 100 places de testeurs pionniers
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Prêt à désencombrer le quotidien de votre équipe ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
          Rejoignez la cohorte bêta fermée nexaBoard. Mise en route en 3 minutes chrono, 100% gratuit et sans engagement.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition"
          >
            Rejoindre la Bêta Privée →
          </button>
        </div>
      </div>
    </section>
  );
}
