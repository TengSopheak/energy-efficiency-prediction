function Nav() {
    const handleNavClick = (event) => {
        const href = event.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();

        const navHeight = document.getElementById('mainNav')?.offsetHeight ?? 80;
        const top =
            target.getBoundingClientRect().top + window.scrollY - navHeight - 18;

        window.scrollTo({
            top,
            behavior: 'smooth',
        });

        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
        }
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            id="mainNav"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
                <a href="#hero" className="flex items-center gap-3 group" onClick={handleNavClick}>
                    <div className="relative w-9 h-9 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <i className="fa-solid fa-bolt text-slate-900 text-sm"></i>
                        <div className="absolute inset-0 rounded-lg bg-emerald-400 blur-md opacity-40 group-hover:opacity-70 transition"></div>
                    </div>
                    <div className="leading-tight">
                        <div className="font-display font-bold text-[15px] tracking-tight">
                            EE-ML
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                            Building Intelligence
                        </div>
                    </div>
                </a>

                <div className="hidden lg:flex items-center gap-8">
                    <a href="#hero" className="nav-link active" onClick={handleNavClick}>
                        Home
                    </a>
                    <a href="#about" className="nav-link" onClick={handleNavClick}>
                        About
                    </a>
                    <a href="#demo" className="nav-link" onClick={handleNavClick}>
                        Predict
                    </a>
                    <a href="#model" className="nav-link" onClick={handleNavClick}>
                        Model
                    </a>
                    <a href="#performance" className="nav-link" onClick={handleNavClick}>
                        Performance
                    </a>
                    <a href="#stack" className="nav-link" onClick={handleNavClick}>
                        Stack
                    </a>
                    <a href="#contact" className="nav-link" onClick={handleNavClick}>
                        Contact
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="#demo"
                        className="hidden md:inline-flex btn-primary px-5 py-2.5 rounded-lg text-sm items-center gap-2"
                        onClick={handleNavClick}
                    >
                        <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                        Try Demo
                    </a>
                    <button
                        className="lg:hidden w-10 h-10 rounded-lg glass flex items-center justify-center"
                        id="menuBtn"
                        aria-label="Toggle menu"
                    >
                        <i className="fa-solid fa-bars text-sm"></i>
                    </button>
                </div>
            </div>

            <div
                id="mobile-menu"
                className="lg:hidden glass-strong mx-4 rounded-xl"
            >
                <div className="px-6 py-4 flex flex-col gap-3">
                    <a href="#hero" className="nav-link py-2" onClick={handleNavClick}>
                        Home
                    </a>
                    <a href="#about" className="nav-link py-2" onClick={handleNavClick}>
                        About
                    </a>
                    <a href="#demo" className="nav-link py-2" onClick={handleNavClick}>
                        Predict
                    </a>
                    <a href="#model" className="nav-link py-2" onClick={handleNavClick}>
                        Model
                    </a>
                    <a href="#performance" className="nav-link py-2" onClick={handleNavClick}>
                        Performance
                    </a>
                    <a href="#stack" className="nav-link py-2" onClick={handleNavClick}>
                        Stack
                    </a>
                    <a href="#contact" className="nav-link py-2" onClick={handleNavClick}>
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Nav;