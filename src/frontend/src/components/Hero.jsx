function Hero() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden"
        >
            <canvas id="hero-canvas"></canvas>

            {/* Floating geometric shapes */}
            <div
                className="absolute top-32 right-[12%] w-20 h-20 rounded-2xl glass float-anim pointer-events-none hidden md:block"
                style={{ transform: "rotate(15deg)" }}
            >
                <div className="w-full h-full rounded-2xl border border-emerald-400/20 flex items-center justify-center">
                    <i className="fa-solid fa-cube text-emerald-400/60 text-2xl"></i>
                </div>
            </div>
            <div className="absolute bottom-40 left-[8%] w-16 h-16 rounded-full glass float-anim-2 pointer-events-none md:block flex items-center justify-center">
                <i className="fa-solid fa-temperature-half text-orange-400/60 text-xl"></i>
            </div>
            <div
                className="absolute top-[55%] right-[6%] w-12 h-12 rounded-xl glass float-anim pointer-events-none hidden md:block"
                style={{ animationDelay: "-4s" }}
            >
                <div className="w-full h-full rounded-xl border border-cyan-400/20 flex items-center justify-center">
                    <i className="fa-solid fa-snowflake text-cyan-400/60 text-base"></i>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 reveal">
                            <span className="glow-dot"></span>
                            <span className="text-xs font-medium tracking-wide text-slate-300">
                                Machine Learning · Sustainable Architecture
                            </span>
                        </div>

                        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 reveal reveal-delay-1">
                            Energy Efficiency
                            <br />
                            <span className="gradient-text">Detection</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 reveal reveal-delay-2">
                            Predict{" "}
                            <span className="text-orange-400 font-medium">
                                Heating
                            </span>{" "}
                            and{" "}
                            <span className="text-sky-400 font-medium">
                                Cooling Loads
                            </span>{" "}
                            of residential buildings using a trained machine
                            learning model. Eight architectural parameters in,
                            two precise energy metrics out.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 reveal reveal-delay-3">
                            <a
                                href="#demo"
                                className="btn-primary px-7 py-4 rounded-xl text-base inline-flex items-center gap-3 group"
                            >
                                <i className="fa-solid fa-play text-xs"></i>
                                Start Prediction
                                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition"></i>
                            </a>
                            <a
                                href="#model"
                                className="btn-ghost px-7 py-4 rounded-xl text-base inline-flex items-center gap-3"
                            >
                                <i className="fa-solid fa-brain text-xs text-cyan-400"></i>
                                View Model
                            </a>
                        </div>

                        {/* Mini stats */}
                        <div className="grid grid-cols-3 gap-6 mt-16 max-w-xl reveal reveal-delay-4">
                            <div>
                                <div className="font-mono text-3xl font-bold text-white">
                                    8
                                </div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                                    Input Features
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-3xl font-bold text-emerald-400">
                                    2
                                </div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                                    Output Targets
                                </div>
                            </div>
                            <div>
                                <div className="font-mono text-3xl font-bold text-cyan-400">
                                    0.99
                                </div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                                    R² Score
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative hidden lg:block reveal reveal-delay-2">
                        {/* Hero AI illustration / abstract building */}
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 rounded-3xl glass-strong overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
                                {/* Animated building silhouette */}
                                <svg
                                    viewBox="0 0 400 400"
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <defs>
                                        <linearGradient
                                            id="bldgGrad"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10B981"
                                                stopOpacity="0.8"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#38BDF8"
                                                stopOpacity="0.4"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="windowGrad"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#FB923C"
                                                stopOpacity="0.9"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#FB923C"
                                                stopOpacity="0.3"
                                            />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid floor */}
                                    <g
                                        stroke="rgba(148,163,184,0.15)"
                                        strokeWidth="1"
                                    >
                                        <line
                                            x1="0"
                                            y1="320"
                                            x2="400"
                                            y2="320"
                                        />
                                        <line
                                            x1="80"
                                            y1="360"
                                            x2="320"
                                            y2="360"
                                        />
                                        <line
                                            x1="60"
                                            y1="320"
                                            x2="100"
                                            y2="360"
                                        />
                                        <line
                                            x1="180"
                                            y1="320"
                                            x2="220"
                                            y2="360"
                                        />
                                        <line
                                            x1="300"
                                            y1="320"
                                            x2="340"
                                            y2="360"
                                        />
                                    </g>

                                    {/* Building */}
                                    <g transform="translate(200, 200)">
                                        {/* Main body */}
                                        <rect
                                            x="-80"
                                            y="-100"
                                            width="160"
                                            height="220"
                                            fill="url(#bldgGrad)"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeWidth="1.5"
                                            rx="2"
                                        >
                                            <animate
                                                attributeName="height"
                                                values="220;225;220"
                                                dur="6s"
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="y"
                                                values="-100;-105;-100"
                                                dur="6s"
                                                repeatCount="indefinite"
                                            />
                                        </rect>

                                        {/* Roof */}
                                        <rect
                                            x="-90"
                                            y="-115"
                                            width="180"
                                            height="15"
                                            fill="#1E293B"
                                            stroke="rgba(56,189,248,0.5)"
                                            strokeWidth="1"
                                            rx="2"
                                        />

                                        {/* Windows grid */}
                                        <g>
                                            <rect
                                                x="-65"
                                                y="-80"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            >
                                                <animate
                                                    attributeName="opacity"
                                                    values="0.7;1;0.7"
                                                    dur="3s"
                                                    repeatCount="indefinite"
                                                />
                                            </rect>
                                            <rect
                                                x="-30"
                                                y="-80"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            >
                                                <animate
                                                    attributeName="opacity"
                                                    values="1;0.7;1"
                                                    dur="3.5s"
                                                    repeatCount="indefinite"
                                                />
                                            </rect>
                                            <rect
                                                x="8"
                                                y="-80"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            >
                                                <animate
                                                    attributeName="opacity"
                                                    values="0.8;1;0.8"
                                                    dur="2.8s"
                                                    repeatCount="indefinite"
                                                />
                                            </rect>
                                            <rect
                                                x="43"
                                                y="-80"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            >
                                                <animate
                                                    attributeName="opacity"
                                                    values="1;0.8;1"
                                                    dur="3.2s"
                                                    repeatCount="indefinite"
                                                />
                                            </rect>

                                            <rect
                                                x="-65"
                                                y="-30"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.6"
                                                rx="1"
                                            />
                                            <rect
                                                x="-30"
                                                y="-30"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.8"
                                                rx="1"
                                            />
                                            <rect
                                                x="8"
                                                y="-30"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.6"
                                                rx="1"
                                            />
                                            <rect
                                                x="43"
                                                y="-30"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.8"
                                                rx="1"
                                            />

                                            <rect
                                                x="-65"
                                                y="20"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            />
                                            <rect
                                                x="-30"
                                                y="20"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            />
                                            <rect
                                                x="8"
                                                y="20"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            />
                                            <rect
                                                x="43"
                                                y="20"
                                                width="22"
                                                height="30"
                                                fill="url(#windowGrad)"
                                                rx="1"
                                            />

                                            <rect
                                                x="-65"
                                                y="70"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.7"
                                                rx="1"
                                            />
                                            <rect
                                                x="-30"
                                                y="70"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.6"
                                                rx="1"
                                            />
                                            <rect
                                                x="8"
                                                y="70"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.8"
                                                rx="1"
                                            />
                                            <rect
                                                x="43"
                                                y="70"
                                                width="22"
                                                height="30"
                                                fill="#60A5FA"
                                                opacity="0.7"
                                                rx="1"
                                            />
                                        </g>

                                        {/* Door */}
                                        <rect
                                            x="-12"
                                            y="90"
                                            width="24"
                                            height="30"
                                            fill="#1E293B"
                                            stroke="rgba(16,185,129,0.5)"
                                            rx="1"
                                        />
                                    </g>

                                    {/* Energy flow arrows */}
                                    <g
                                        stroke="#10B981"
                                        strokeWidth="1.5"
                                        fill="none"
                                        opacity="0.6"
                                    >
                                        <path
                                            d="M 50 200 Q 100 180 130 200"
                                            strokeDasharray="3,3"
                                        >
                                            <animate
                                                attributeName="stroke-dashoffset"
                                                from="0"
                                                to="-12"
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        </path>
                                        <path
                                            d="M 350 200 Q 300 220 270 200"
                                            strokeDasharray="3,3"
                                        >
                                            <animate
                                                attributeName="stroke-dashoffset"
                                                from="0"
                                                to="-12"
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        </path>
                                    </g>

                                    {/* Floating data points */}
                                    <g fill="#38BDF8">
                                        <circle cx="60" cy="100" r="3">
                                            <animate
                                                attributeName="cy"
                                                values="100;90;100"
                                                dur="3s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                        <circle cx="340" cy="120" r="3">
                                            <animate
                                                attributeName="cy"
                                                values="120;110;120"
                                                dur="3.5s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                        <circle
                                            cx="350"
                                            cy="280"
                                            r="3"
                                            fill="#FB923C"
                                        >
                                            <animate
                                                attributeName="cy"
                                                values="280;270;280"
                                                dur="2.8s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </g>
                                </svg>
                            </div>

                            {/* Floating metrics */}
                            <div className="absolute -top-4 -left-4 glass-strong rounded-2xl px-4 py-3 float-anim">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                                    Heating
                                </div>
                                <div className="font-mono text-orange-400 text-lg font-bold">
                                    21.4{" "}
                                    <span className="text-xs text-slate-500">
                                        kWh/m²
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl px-4 py-3 float-anim-2">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                                    Cooling
                                </div>
                                <div className="font-mono text-sky-400 text-lg font-bold">
                                    24.8{" "}
                                    <span className="text-xs text-slate-500">
                                        kWh/m²
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs">
                <span className="uppercase tracking-widest">Scroll</span>
                <div className="w-px h-12 bg-linear-to-b from-slate-500 to-transparent"></div>
            </div>
        </section>
    );
}
export default Hero;
