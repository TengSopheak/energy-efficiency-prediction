function Stack() {
    return (
        <section id="stack" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 reveal">
                    <div
                        className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4"
                    >
                        / 05 — Technology Stack
                    </div>
                    <h2
                        className="font-display font-bold text-4xl lg:text-5xl leading-tight max-w-3xl"
                    >
                        Engineered with a
                        <span className="gradient-text"> modern, focused </span>
                        toolchain.
                    </h2>
                </div>

                <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {/* Tech cards injected */}
                    <div id="techGrid" className="contents"></div>
                </div>
            </div>
        </section>
    );
}

export default Stack;