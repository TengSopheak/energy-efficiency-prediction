function Model() {
    const overallMetrics = {
        r2: 0.9943,
        mae: 0.3498,
        rmse: 0.6678,
        mse: 0.5326,
    };

    const heatingMetrics = {
        r2: 0.9987,
        mae: 0.2499,
        rmse: 0.3733,
        mse: 0.1394,
    };

    const coolingMetrics = {
        r2: 0.9900,
        mae: 0.4496,
        rmse: 0.9622,
        mse: 0.9259,
    };

    return (
        <section id="performance" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 reveal">
                    <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4">
                        / 04 — Performance Metrics
                    </div>
                    <h2 className="font-display font-bold text-4xl lg:text-5xl leading-tight max-w-3xl">
                        Final accuracy across
                        <span className="gradient-text"> both targets.</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-4 gap-5 mb-8">
                    {/* R² Score */}
                    <div className="glass-strong rounded-2xl p-7 reveal">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs uppercase tracking-widest text-slate-400">
                                R² Score
                            </span>
                            <i className="fa-solid fa-bullseye text-emerald-400 text-sm"></i>
                        </div>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full gauge-ring"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="rgba(148,163,184,0.15)"
                                    strokeWidth="6"
                                />
                                <circle
                                    className="perf-ring"
                                    data-target={overallMetrics.r2}
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    strokeDashoffset="264"
                                    style={{
                                        color: "#10b981",
                                        filter: "drop-shadow(0 0 6px #10b981)",
                                    }}
                                />
                            </svg>
                            <div
                                className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-emerald-400 perf-value"
                                data-target={overallMetrics.r2}
                            >
                                {overallMetrics.r2.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center text-xs text-slate-400">
                            Coefficient of determination
                        </div>
                    </div>

                    {/* MAE */}
                    <div className="glass-strong rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs uppercase tracking-widest text-slate-400">
                                MAE
                            </span>
                            <i className="fa-solid fa-ruler text-cyan-400 text-sm"></i>
                        </div>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full gauge-ring"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="rgba(148,163,184,0.15)"
                                    strokeWidth="6"
                                />
                                <circle
                                    className="perf-ring"
                                    data-target={overallMetrics.mae}
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#38BDF8"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    strokeDashoffset="264"
                                    style={{
                                        color: "#38bdf8",
                                        filter: "drop-shadow(0 0 6px #38bdf8)",
                                    }}
                                />
                            </svg>
                            <div
                                className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-cyan-400 perf-value"
                                data-target={overallMetrics.mae}
                            >
                                {overallMetrics.mae.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center text-xs text-slate-400">
                            Mean Absolute Error
                        </div>
                    </div>

                    {/* RMSE */}
                    <div className="glass-strong rounded-2xl p-7 reveal reveal-delay-2">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs uppercase tracking-widest text-slate-400">
                                RMSE
                            </span>
                            <i className="fa-solid fa-wave-square text-orange-400 text-sm"></i>
                        </div>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full gauge-ring"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="rgba(148,163,184,0.15)"
                                    strokeWidth="6"
                                />
                                <circle
                                    className="perf-ring"
                                    data-target={overallMetrics.rmse}
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#FB923C"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    strokeDashoffset="264"
                                    style={{
                                        color: "#fb923c",
                                        filter: "drop-shadow(0 0 6px #fb923c)",
                                    }}
                                />
                            </svg>
                            <div
                                className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-orange-400 perf-value"
                                data-target={overallMetrics.rmse}
                            >
                                {overallMetrics.rmse.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center text-xs text-slate-400">
                            Root Mean Squared Error
                        </div>
                    </div>

                    {/* MSE */}
                    <div className="glass-strong rounded-2xl p-7 reveal reveal-delay-3">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs uppercase tracking-widest text-slate-400">
                                MSE
                            </span>
                            <i className="fa-solid fa-square-root-variable text-sky-400 text-sm"></i>
                        </div>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full gauge-ring"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="rgba(148,163,184,0.15)"
                                    strokeWidth="6"
                                />
                                <circle
                                    className="perf-ring"
                                    data-target={overallMetrics.mse}
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#60A5FA"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    strokeDashoffset="264"
                                    style={{
                                        color: "#60a5fa",
                                        filter: "drop-shadow(0 0 6px #60a5fa)",
                                    }}
                                />
                            </svg>
                            <div
                                className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-sky-400 perf-value"
                                data-target={overallMetrics.mse}
                            >
                                {overallMetrics.mse.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center text-xs text-slate-400">
                            Mean Squared Error
                        </div>
                    </div>
                </div>

                {/* Comparison bars */}
                <div className="grid lg:grid-cols-2 gap-5">
                    <div className="glass-strong rounded-2xl p-7 reveal">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-semibold text-lg">
                                Heating Load — Metric Breakdown
                            </h3>
                            <span className="text-xs font-mono text-orange-400">
                                Target 1
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        R² Score
                                    </span>
                                    <span className="font-mono text-orange-400">
                                        {heatingMetrics.r2.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-orange-500 to-orange-300 rounded-full"
                                        data-target={heatingMetrics.r2 * 100}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        MAE (lower better)
                                    </span>
                                    <span className="font-mono text-orange-400">
                                        {heatingMetrics.mae.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-orange-500 to-orange-300 rounded-full"
                                        data-target={((1 - heatingMetrics.mae / 1.5) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        RMSE (lower better)
                                    </span>
                                    <span className="font-mono text-orange-400">
                                        {heatingMetrics.rmse.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-orange-500 to-orange-300 rounded-full"
                                        data-target={((1 - heatingMetrics.rmse / 2.5) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        MSE (lower better)
                                    </span>
                                    <span className="font-mono text-orange-400">
                                        {heatingMetrics.mse.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-orange-500 to-orange-300 rounded-full"
                                        data-target={((1 - heatingMetrics.mse / 1.5) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-strong rounded-2xl p-7 reveal reveal-delay-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-semibold text-lg">
                                Cooling Load — Metric Breakdown
                            </h3>
                            <span className="text-xs font-mono text-sky-400">
                                Target 2
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        R² Score
                                    </span>
                                    <span className="font-mono text-sky-400">
                                        {coolingMetrics.r2.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-sky-500 to-cyan-300 rounded-full"
                                        data-target={coolingMetrics.r2 * 100}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        MAE (lower better)
                                    </span>
                                    <span className="font-mono text-sky-400">
                                        {coolingMetrics.mae.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-sky-500 to-cyan-300 rounded-full"
                                        data-target={((1 - coolingMetrics.mae / 2.0) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        RMSE (lower better)
                                    </span>
                                    <span className="font-mono text-sky-400">
                                        {coolingMetrics.rmse.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-sky-500 to-cyan-300 rounded-full"
                                        data-target={((1 - coolingMetrics.rmse / 3.0) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">
                                        MSE (lower better)
                                    </span>
                                    <span className="font-mono text-sky-400">
                                        {coolingMetrics.mse.toFixed(4)}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="perf-bar h-full bg-linear-to-r from-sky-500 to-cyan-300 rounded-full"
                                        data-target={((1 - coolingMetrics.mse / 2.5) * 100).toFixed(0)}
                                        style={{
                                            width: "0%",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Model;
