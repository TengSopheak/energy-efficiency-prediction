function Footer() {
    return (
        <footer className="relative py-12 px-6 lg:px-10 border-t border-slate-800/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                            <i className="fa-solid fa-bolt text-slate-900 text-sm"></i>
                        </div>
                        <div>
                            <div className="font-display font-bold text-sm">
                                EE-ML
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                                Energy Efficiency Detection
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 text-xs text-slate-400">
                        <a
                            href="#hero"
                            className="hover:text-emerald-400 transition"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="hover:text-emerald-400 transition"
                        >
                            About
                        </a>
                        <a
                            href="#demo"
                            className="hover:text-emerald-400 transition"
                        >
                            Demo
                        </a>
                        <a
                            href="#model"
                            className="hover:text-emerald-400 transition"
                        >
                            Model
                        </a>
                        <a
                            href="#stack"
                            className="hover:text-emerald-400 transition"
                        >
                            Stack
                        </a>
                        <a
                            href="#contact"
                            className="hover:text-emerald-400 transition"
                        >
                            Contact
                        </a>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        v1.0.0 · built with ML & 3D
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800/50 text-center text-xs text-slate-500">
                    © 2026 EE-ML Portfolio · Predicting sustainable architecture
                    with machine learning.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
