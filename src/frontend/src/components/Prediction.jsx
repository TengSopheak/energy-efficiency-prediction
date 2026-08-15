function Prediction() {
    return (
        <section id="model" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 reveal">
                    <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4">
                        / 03 — Model Architecture
                    </div>
                    <h2 className="font-display font-bold text-4xl lg:text-5xl leading-tight max-w-3xl">
                        From blueprint to
                        <span className="gradient-text">
                            {" "}
                            prediction pipeline.
                        </span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                    <div className="feature-card glass rounded-2xl p-7 reveal">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center font-mono text-emerald-400 text-sm font-bold">
                                01
                            </div>
                            <i className="fa-solid fa-database text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Dataset
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            768 simulated residential buildings from the UCI
                            Energy Efficiency Dataset, spanning diverse
                            architectural configurations.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                                768 samples
                            </span>
                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                                8 features
                            </span>
                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                                2 targets
                            </span>
                        </div>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center font-mono text-cyan-400 text-sm font-bold">
                                02
                            </div>
                            <i className="fa-solid fa-sliders text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Features
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Architectural parameters including compactness,
                            surface areas, height, orientation, and glazing
                            properties.
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono leading-relaxed">
                            Relative Compactness · Surface Area · Wall Area ·
                            Roof Area · Overall Height · Orientation · Glazing
                            Area · Glazing Distribution
                        </div>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-2">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-orange-400/10 border border-orange-400/20 flex items-center justify-center font-mono text-orange-400 text-sm font-bold">
                                03
                            </div>
                            <i className="fa-solid fa-network-wired text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Regression Model
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Ensemble of gradient-boosted trees trained on
                            standardized features, optimized for both targets
                            via multi-output regression.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400">
                                GradientBoosting
                            </span>
                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-cyan-400">
                                MultiOutput
                            </span>
                        </div>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center font-mono text-sky-400 text-sm font-bold">
                                04
                            </div>
                            <i className="fa-solid fa-gears text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Training Process
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            StandardScaler preprocessing, 5-fold
                            cross-validation, Bayesian hyperparameter
                            optimization, early stopping.
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono">
                            5-fold CV · 400 estimators · lr=0.05 · max_depth=5
                        </div>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center font-mono text-emerald-400 text-sm font-bold">
                                05
                            </div>
                            <i className="fa-solid fa-arrow-right-arrow-left text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Prediction Pipeline
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Input validation → feature scaling → model inference
                            → output denormalization → confidence estimation.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="px-2 py-1 rounded bg-slate-800">
                                validate
                            </span>
                            <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            <span className="px-2 py-1 rounded bg-slate-800">
                                scale
                            </span>
                            <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            <span className="px-2 py-1 rounded bg-slate-800">
                                infer
                            </span>
                            <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            <span className="px-2 py-1 rounded bg-emerald-400/20 text-emerald-400">
                                output
                            </span>
                        </div>
                    </div>

                    <div className="feature-card glass rounded-2xl p-7 reveal reveal-delay-2">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center font-mono text-cyan-400 text-sm font-bold">
                                06
                            </div>
                            <i className="fa-solid fa-chart-simple text-slate-500"></i>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                            Evaluation Metrics
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            R², MAE, RMSE, MSE computed on held-out test set
                            (20% split) for both heating and cooling targets.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                                R² → 0.92
                            </div>
                            <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                                MAE → 1.84
                            </div>
                            <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                                RMSE → 2.41
                            </div>
                            <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                                MSE → 5.81
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature importance chart */}
                <div className="glass-strong rounded-3xl p-8 mt-8 reveal">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-display font-semibold text-xl mb-1">
                                Feature Importance (Correlation)
                            </h3>
                            <p className="text-xs text-slate-400">
                                Permutation importance from trained model ·
                                higher = more influential
                            </p>
                        </div>
                        <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                            <i className="fa-solid fa-circle-info"></i>{" "}
                            SHAP-validated
                        </div>
                    </div>
                    <div id="importanceChart" className="space-y-3"></div>
                </div>
            </div>
        </section>
    );
}

export default Prediction;
