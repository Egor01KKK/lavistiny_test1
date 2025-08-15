import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-base-line mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-600 grid md:grid-cols-3 gap-6">

        {/* Колонка с логотипом */}
        <div>
          <Link
            href="/"
            aria-label="Lavistini — на главную"
            className="inline-flex items-center"
          >
            {/* логотип из /public/logo.svg; регулируй высоту классом h-* */}
            <img
              src="/logo.svg"
              alt="Lavistini"
              className="h-7 sm:h-8 md:h-9 w-auto"
            />
          </Link>

          <p className="mt-3 max-w-xs">
            
          </p>
        </div>

        <div>
          <div className="font-medium text-zinc-800">Правовое</div>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="/privacy" className="hover:text-black transition-colors">
                Политика
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-black transition-colors">
                Условия
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-medium text-zinc-800">Контакты</div>
          <ul className="mt-2 space-y-1">
            <li>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
