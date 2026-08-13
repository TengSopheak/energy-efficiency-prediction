function About() {
    return (
        <section id="about" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 mb-20">
                    <div className="lg:col-span-5 reveal">
                        <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4">
                            / 01 — About
                        </div>
                        <h2 className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-6">
                            Architectural intelligence,
                            <br />
                            <span className="text-slate-400">
                                decoded by machine learning.
                            </span>
                        </h2>
                    </div>
                    <div className="lg:col-span-7 reveal reveal-delay-1">
                        <p className="text-lg text-slate-300 leading-relaxed mb-6">
                            This project predicts two critical energy efficiency
                            metrics —{" "}
                            <span className="text-orange-400 font-medium">
                                Heating Load
                            </span>{" "}
                            and{" "}
                            <span className="text-sky-400 font-medium">
                                Cooling Load
                            </span>{" "}
                            (both in kWh/m²) — directly from eight building
                            characteristics. The model learns the physical
                            relationship between architectural form and thermal
                            behavior, allowing architects and engineers to
                            estimate energy demand before construction.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Trained on 768 simulated building variants, the
                            regression pipeline transforms compactness, surface
                            area, wall and roof geometry, height, orientation,
                            and glazing into precise, actionable energy
                            forecasts — bridging sustainable design and modern
                            AI.
                        </p>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="feature-card glass rounded-2xl p-7 reveal">
                        <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-brain text-emerald-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Machine Learning
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Trained regression models that learn non-linear
                            relationships between building form and energy
                            demand patterns.
                        </p>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-database text-cyan-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Data Driven
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Built on 768 parametric building simulations
                            covering diverse architectural configurations and
                            climate responses.
                        </p>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-2">
                        <div className="w-12 h-12 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-chart-line text-orange-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Energy Analysis
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Quantifies thermal performance in kWh/m² — the
                            industry standard unit for building energy intensity
                            benchmarking.
                        </p>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-leaf text-sky-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Sustainable Buildings
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Empowers architects to design low-carbon homes by
                            predicting energy footprint during early-stage
                            planning.
                        </p>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-wand-sparkles text-emerald-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Smart Predictions
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Sub-second inference returns both heating and
                            cooling loads simultaneously, with a confidence
                            estimate per prediction.
                        </p>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5">
                            <i className="fa-solid fa-cube text-cyan-400 text-lg"></i>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2">
                            Live 3D Feedback
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Every parameter morphs an interactive 3D building in
                            real-time — making abstract ML inputs tangible and
                            inspectable.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;