function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <img
        src="/static/imgs/logo.png"
        alt="Company Logo"
        className="h-16"
      />
      <nav>
        <ul className="flex gap-6">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;