function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} JobMatch. All rights reserved.
        </p>

        <p className="text-sm text-slate-600">
          Skill-based job matching platform.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
