import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Demo() {
    return (
        <section id="demo" className="relative py-28 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 reveal">
                    <div>
                        <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-4">
                            / 02 — Live Prediction
                        </div>
                        <h2 className="font-display font-bold text-4xl lg:text-5xl leading-tight">
                            Shape the building.
                            <br />
                            <span className="text-slate-400">
                                Watch the model respond.
                            </span>
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            id="sampleBtn"
                            className="btn-ghost px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"
                        >
                            <i className="fa-solid fa-vial text-emerald-400 text-xs"></i>{" "}
                            Sample Building
                        </button>
                        <button
                            id="randomBtn"
                            className="btn-ghost px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"
                        >
                            <i className="fa-solid fa-shuffle text-cyan-400 text-xs"></i>{" "}
                            Random
                        </button>
                        <button
                            id="resetBtn"
                            className="btn-ghost px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"
                        >
                            <i className="fa-solid fa-rotate-left text-slate-400 text-xs"></i>{" "}
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* LEFT: 3D Viewer */}
                    <div className="lg:col-span-7 reveal">
                        <div
                            className="glass-strong rounded-3xl overflow-hidden relative"
                            style={{ height: "620px" }}
                        >
                            <div
                                id="three-container"
                                className="w-full h-full"
                            ></div>

                            {/* Top overlay */}
                            <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                                <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-auto">
                                    <span className="glow-dot"></span>
                                    <span className="text-xs font-mono text-slate-300">
                                        LIVE BUILDING
                                    </span>
                                </div>
                                <div
                                    id="viewerBadge"
                                    className="glass rounded-xl px-3 py-2 text-xs font-mono text-slate-300 viewer-badge"
                                >
                                    <span className="text-emerald-400">●</span> Idle
                                </div>
                            </div>

                            {/* Bottom overlay */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                                <div className="glass rounded-xl px-4 py-3 pointer-events-auto">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                                        Active Parameter
                                    </div>
                                    <div
                                        id="activeParam"
                                        className="text-sm font-medium text-white"
                                    >
                                        —
                                    </div>
                                </div>
                                <div className="glass rounded-xl px-4 py-3 pointer-events-auto hidden sm:block">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                                        Controls
                                    </div>
                                    <div className="text-xs text-slate-300 flex items-center gap-3">
                                        <span>
                                            <i className="fa-solid fa-arrows-up-down-left-right text-emerald-400"></i>{" "}
                                            Drag
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-magnifying-glass-plus text-cyan-400"></i>{" "}
                                            Scroll
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Loading skeleton */}
                            <div
                                id="threeLoader"
                                className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur z-10"
                            >
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 spin mx-auto mb-4"></div>
                                    <div className="text-xs font-mono text-slate-400">
                                        Initializing 3D engine...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Inputs */}
                    <div className="lg:col-span-5 reveal reveal-delay-1">
                        <div
                            className="glass-strong rounded-3xl p-6 lg:p-7"
                            style={{ maxHeight: "620px", overflowY: "auto" }}
                        >
                            <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900/80 backdrop-blur py-2 -mx-6 px-6 lg:-mx-7 lg:px-7 z-10">
                                <div>
                                    <h3 className="font-display font-semibold text-xl">
                                        Building Parameters
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        8 inputs · real-time 3D sync
                                    </p>
                                </div>
                                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                                    <span className="glow-dot"></span> SYNCED
                                </div>
                            </div>

                            <div className="space-y-4" id="inputsContainer">
                                {/* Inputs injected by JS */}
                            </div>

                            {/* Predict button */}
                            <button
                                id="predictBtn"
                                className="btn-primary w-full mt-7 py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                <span
                                    id="predictContent"
                                    className="inline-flex items-center gap-3"
                                >
                                    <i className="fa-solid fa-bolt"></i>
                                    Predict Energy Efficiency
                                    <i className="fa-solid fa-arrow-right text-xs"></i>
                                </span>
                            </button>

                            <p className="text-center text-[11px] text-slate-500 mt-3">
                                Inference runs locally · ~50ms
                            </p>
                        </div>
                    </div>
                </div>

                {/* RESULTS */}
                <div id="resultsSection" className="mt-10 hidden">
                    <div className="glass-strong rounded-3xl p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                            <div>
                                <div className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em] mb-2">
                                    Prediction Result
                                </div>
                                <h3 className="font-display font-bold text-3xl">
                                    Energy Efficiency Forecast
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    id="saveCompareBtn"
                                    className="btn-ghost px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-bookmark text-emerald-400 text-xs"></i>{" "}
                                    Save to Compare
                                </button>
                                <button
                                    id="clearResultsBtn"
                                    className="btn-ghost px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-xmark text-slate-400 text-xs"></i>{" "}
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Heating Load Gauge */}
                            <div
                                className="relative glass rounded-2xl p-8 overflow-hidden"
                                style={{ borderColor: "rgba(251, 146, 60, 0.25)" }}
                            >
                                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-orange-400/10 blur-3xl"></div>
                                <div className="relative flex flex-col items-center text-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="fa-solid fa-fire text-orange-400"></i>
                                        <span className="text-xs uppercase tracking-widest text-orange-400 font-medium">
                                            Heating Load
                                        </span>
                                    </div>
                                    <div className="relative w-56 h-56 my-4">
                                        <svg
                                            viewBox="0 0 200 200"
                                            className="w-full h-full gauge-ring"
                                        >
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                strokeWidth="10"
                                                className="gauge-track"
                                            />
                                            <circle
                                                id="heatingGauge"
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke="#FB923C"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray="534"
                                                strokeDashoffset="534"
                                                className="gauge-progress"
                                                style={{ color: "#FB923C" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div
                                                className="font-mono text-5xl font-bold text-orange-400"
                                                id="heatingValue"
                                            >
                                                0.0
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                kWh/m²
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xs text-slate-400 mt-2"
                                        id="heatingLabel"
                                    >
                                        Awaiting prediction...
                                    </div>
                                    {/* Sparkline */}
                                    <svg
                                        viewBox="0 0 200 40"
                                        className="w-full h-10 mt-4"
                                    >
                                        <path
                                            id="heatingSpark"
                                            className="sparkline-path"
                                            d="M0,30 L25,25 L50,28 L75,18 L100,22 L125,12 L150,16 L175,8 L200,14"
                                            fill="none"
                                            stroke="#FB923C"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M0,30 L25,25 L50,28 L75,18 L100,22 L125,12 L150,16 L175,8 L200,14 L200,40 L0,40 Z"
                                            fill="url(#heatFill)"
                                            opacity="0.2"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="heatFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#FB923C"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#FB923C"
                                                    stopOpacity="0"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Cooling Load Gauge */}
                            <div
                                className="relative glass rounded-2xl p-8 overflow-hidden"
                                style={{ borderColor: "rgba(96, 165, 250, 0.25)" }}
                            >
                                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-sky-400/10 blur-3xl"></div>
                                <div className="relative flex flex-col items-center text-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="fa-solid fa-snowflake text-sky-400"></i>
                                        <span className="text-xs uppercase tracking-widest text-sky-400 font-medium">
                                            Cooling Load
                                        </span>
                                    </div>
                                    <div className="relative w-56 h-56 my-4">
                                        <svg
                                            viewBox="0 0 200 200"
                                            className="w-full h-full gauge-ring"
                                        >
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                strokeWidth="10"
                                                className="gauge-track"
                                            />
                                            <circle
                                                id="coolingGauge"
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke="#60A5FA"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray="534"
                                                strokeDashoffset="534"
                                                className="gauge-progress"
                                                style={{ color: "#60A5FA" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div
                                                className="font-mono text-5xl font-bold text-sky-400"
                                                id="coolingValue"
                                            >
                                                0.0
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                kWh/m²
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xs text-slate-400 mt-2"
                                        id="coolingLabel"
                                    >
                                        Awaiting prediction...
                                    </div>

                                    {/* Sparkline */}
                                    <svg
                                        viewBox="0 0 200 40"
                                        className="w-full h-10 mt-4"
                                    >
                                        <path
                                            id="coolingSpark"
                                            className="sparkline-path"
                                            d="M0,25 L25,20 L50,22 L75,15 L100,18 L125,10 L150,14 L175,6 L200,12"
                                            fill="none"
                                            stroke="#60A5FA"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M0,25 L25,20 L50,22 L75,15 L100,18 L125,10 L150,14 L175,6 L200,12 L200,40 L0,40 Z"
                                            fill="url(#coolFill)"
                                            opacity="0.2"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="coolFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#60A5FA"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#60A5FA"
                                                    stopOpacity="0"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Confidence + Feature Importance */}
                        <div className="grid lg:grid-cols-3 gap-6 mt-6">
                            <div className="glass rounded-2xl p-6">
                                <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                                    Model Confidence
                                </div>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span
                                        id="confidenceValue"
                                        className="font-mono text-4xl font-bold text-emerald-400"
                                    >
                                        0
                                    </span>
                                    <span className="text-slate-500 text-sm">
                                        %
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        id="confidenceBar"
                                        className="h-full bg-linear-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-1000"
                                        style={{ width: "0%" }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-3">
                                    Based on input distribution and model
                                    uncertainty.
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 lg:col-span-2">
                                <div className="text-xs uppercase tracking-widest text-slate-400 mb-4">
                                    Feature Contribution
                                </div>
                                <div id="featureImportance" className="space-y-2.5">
                                    {/* Bars injected */}
                                </div>
                            </div>
                        </div>

                        {/* Comparison slots */}
                        <div id="comparisonArea" className="mt-8 hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-display font-semibold text-lg">
                                    Comparison Mode
                                </h4>
                                <button
                                    id="clearCompareBtn"
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div
                                id="compareSlots"
                                className="grid md:grid-cols-2 gap-4"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Demo;
