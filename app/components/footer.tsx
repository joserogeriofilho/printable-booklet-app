function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mb-16 mt-16 border-t border-dashed border-stone-300 dark:border-stone-700 pt-8">
      <ul className="font-sm flex flex-col space-x-0 space-y-2 text-stone-500 dark:text-stone-400 md:flex-row md:space-x-4 md:space-y-0">
        <li>
          <a
            className="flex items-center text-sm transition-all hover:text-stone-800 dark:hover:text-stone-200"
            rel="noopener noreferrer"
            target="_blank"
            href="/"
          >
            <ArrowIcon />
            <span className="ml-2 h-7">site</span>
          </a>
        </li>
      </ul>
      <p className="mt-4 text-xs text-stone-400 dark:text-stone-500">
        &copy; {new Date().getFullYear()} &mdash; MIT Licensed
      </p>
    </footer>
  );
}
