export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-text-muted md:flex-row">
        <p>&copy; 2024 EvenSAX. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">
            Privacidad
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Términos
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Ayuda
          </a>
        </div>
      </div>
    </footer>
  )
}
