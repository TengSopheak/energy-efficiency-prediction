function Contact() {
    return (
        <section id="contact" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-5xl mx-auto">
                <div className="glass-strong rounded-3xl p-10 lg:p-16 relative overflow-hidden reveal">
                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"></div>

                    <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4">
                                / 06 — Get in touch
                            </div>
                            <h2 className="font-display font-bold text-3xl lg:text-4xl leading-tight mb-5">
                                Let's build something
                                <span className="gradient-text">
                                    energy-intelligent.
                                </span>
                            </h2>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                Interested in the model, the architecture, or
                                collaborating on sustainable ML projects? The
                                full source code lives on GitHub — feel free to
                                explore, fork, and reach out.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://github.com/TengSopheak/energy-efficiency-prediction"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary px-6 py-3.5 rounded-xl text-sm inline-flex items-center gap-3"
                                >
                                    <i className="fa-brands fa-github"></i>
                                    View on GitHub
                                </a>
                                <a
                                    href="mailto:sopheakteng14@gmail.com"
                                    className="btn-ghost px-6 py-3.5 rounded-xl text-sm inline-flex items-center gap-3"
                                >
                                    <i className="fa-solid fa-envelope text-cyan-400"></i>
                                    Email Me
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass rounded-2xl p-5 min-w-0">
                                <i className="fa-brands fa-github text-2xl text-slate-300 mb-3"></i>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                    GitHub
                                </div>
                                <div className="text-sm font-medium mt-1">
                                    @SopheakTeng
                                </div>
                            </div>
                            <div className="glass rounded-2xl p-5 min-w-0">
                                <i className="fa-brands fa-linkedin text-2xl text-cyan-400 mb-3"></i>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                    LinkedIn
                                </div>
                                <div className="text-sm font-medium mt-1">
                                    /in/sopheak-teng-78b0082b3
                                </div>
                            </div>
                            <div className="glass rounded-2xl p-5 min-w-0">
                                <i className="fa-solid fa-envelope text-2xl text-emerald-400 mb-3"></i>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                    Email
                                </div>
                                <div className="text-sm font-medium mt-1 break-all min-w-0">
                                    sopheakteng14@gmail.com
                                </div>
                            </div>
                            <div className="glass rounded-2xl p-5 min-w-0">
                                <i className="fa-solid fa-location-dot text-2xl text-orange-400 mb-3"></i>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                    Location
                                </div>
                                <div className="text-sm font-medium mt-1">
                                    KS, USA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
