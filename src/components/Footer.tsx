export default function Footer() {
  return (
    <footer className="bg-dark px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <a href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
          <span className="text-yellow">🤙</span>
          <span><span className="text-white">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span><span className="text-white">.com</span></span>
        </a>
        <div className="flex flex-col items-center gap-1 text-center sm:items-end">
          <a
            href="mailto:halo@webkalcer.com"
            className="font-bold text-zinc-400 underline underline-offset-2 hover:text-pink transition-colors"
          >
            halo@webkalcer.com
          </a>
          <p className="font-bold text-zinc-500">
            Jual website, bukan jasa koding kakak. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
