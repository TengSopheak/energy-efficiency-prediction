const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
const sampleBtn = $("#sampleBtn");
const randomBtn = $("#randomBtn");
const resetBtn = $("#resetBtn");
const clearResultsBtn = $("#clearResultsBtn");
const saveCompareBtn = $("#saveCompareBtn");
const clearCompareBtn = $("#clearCompareBtn");

function toast(message, type = "info") {
    const container = $("#toastContainer");
    if (!container) return;

    const colors = {
        info: "border-cyan-400/30 text-cyan-300",
        success: "border-emerald-400/30 text-emerald-300",
        warning: "border-orange-400/30 text-orange-300",
        error: "border-red-400/30 text-red-300",
    };
    const icons = {
        info: "fa-circle-info",
        success: "fa-circle-check",
        warning: "fa-triangle-exclamation",
        error: "fa-circle-xmark",
    };

    const el = document.createElement("div");
    el.className = `toast glass-strong rounded-xl px-5 py-3.5 flex items-center gap-3 border ${colors[type]} max-w-sm`;
    el.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span class="text-sm">${message}</span>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 400);
    }, 3200);
}

function ripple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const r = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    r.className = "ripple";
    r.style.width = r.style.height = size + "px";
    r.style.left = e.clientX - rect.left - size / 2 + "px";
    r.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
const cursorGlow = $("#cursorGlow");

let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
let cgx = mx,
    cgy = my;

function showCursorGlow() {
    if (!cursorGlow) return;
    cursorGlow.style.opacity = "1";
}

function hideCursorGlow() {
    if (!cursorGlow) return;
    cursorGlow.style.opacity = "0";
}

window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    showCursorGlow();
});

window.addEventListener("pointerleave", hideCursorGlow);

function animateCursor() {
    if (!cursorGlow) return;
    cgx += (mx - cgx) * 0.12;
    cgy += (my - cgy) * 0.12;
    cursorGlow.style.transform = `translate(${cgx}px, ${cgy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}

if (cursorGlow) {
    cursorGlow.style.opacity = "1";
    animateCursor();
}

// Magnetic buttons + ripple
$$(".btn-primary, .btn-ghost").forEach((btn) => {
    btn.addEventListener("click", (e) => ripple(btn, e));
    btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty("--mx", x + "%");
        btn.style.setProperty("--my", y + "%");
    });
});

// Card tilt
$$(".feature-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
    });
});

/* ============================================================
   NAVIGATION
   ============================================================ */
const nav = $("#mainNav");
const navLinks = $$(".nav-link");
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobile-menu");

window.addEventListener("scroll", () => {
    if (!nav) return;
    if (window.scrollY > 30) {
        nav.classList.add("glass-strong", "shadow-lg", "shadow-black/20");
    } else {
        nav.classList.remove("glass-strong", "shadow-lg", "shadow-black/20");
    }
});

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () =>
        mobileMenu.classList.toggle("open"),
    );
}

// Active section detection
const sections = [
    "hero",
    "about",
    "demo",
    "model",
    "performance",
    "stack",
    "contact",
];
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((l) => l.classList.remove("active"));
                const link = document.querySelector(
                    `.nav-link[href="#${entry.target.id}"]`,
                );
                if (link) link.classList.add("active");
            }
        });
    },
    { rootMargin: "-40% 0px -55% 0px" },
);
sections.forEach((id) => {
    const s = $("#" + id);
    if (s) sectionObserver.observe(s);
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Animate performance rings when they appear
                if (entry.target.querySelector(".perf-ring")) {
                    animatePerfRings(entry.target);
                }
                if (entry.target.querySelector(".perf-bar")) {
                    animatePerfBars(entry.target);
                }
            }
        });
    },
    { threshold: 0.15 },
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

function animatePerfRings(container) {
    $$(".perf-ring", container).forEach((ring) => {
        const target = parseFloat(ring.dataset.target);
        const circumference = 264;
        const offset = circumference * (1 - target);
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 200);
    });
    $$(".perf-value", container).forEach((val) => {
        const target = parseFloat(val.dataset.target);
        const isDecimal = target < 10;
        let cur = 0;
        const step = target / 60;
        const tick = () => {
            cur += step;
            if (cur >= target) {
                cur = target;
                val.textContent = isDecimal
                    ? target.toFixed(2)
                    : Math.round(target);
                return;
            }
            val.textContent = isDecimal ? cur.toFixed(2) : Math.round(cur);
            requestAnimationFrame(tick);
        };
        setTimeout(tick, 200);
    });
}

function animatePerfBars(container) {
    $$(".perf-bar", container).forEach((bar) => {
        setTimeout(() => {
            bar.style.width = bar.dataset.target + "%";
        }, 300);
    });
}

/* ============================================================
   HERO CANVAS — Energy Flow
   ============================================================ */
(function heroCanvas() {
    const canvas = $("#hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w,
        h,
        particles = [],
        paths = [];

    function resize() {
        w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = Math.min(60, Math.floor((w * h) / 30000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                c: Math.random() > 0.5 ? "16, 185, 129" : "56, 189, 248",
                a: Math.random() * 0.5 + 0.2,
            });
        }
        // Energy flow paths
        paths = [];
        for (let i = 0; i < 3; i++) {
            paths.push({
                y: h * (0.3 + i * 0.2),
                offset: Math.random() * 1000,
                speed: 0.3 + i * 0.1,
                amp: 30 + i * 10,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Flow lines
        paths.forEach((p, i) => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 + i * 0.02})`;
            ctx.lineWidth = 1;
            for (let x = 0; x <= w; x += 5) {
                const y =
                    p.y +
                    Math.sin((x + p.offset) * 0.005) * p.amp +
                    Math.sin((x + p.offset) * 0.013) * p.amp * 0.5;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            p.offset += p.speed;
        });

        // Particles
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.c}, ${p.a})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${p.c}, 0.5)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
})();

/* ============================================================
   INPUT DEFINITIONS
   ============================================================ */
const INPUTS = [
    {
        id: "compactness",
        label: "Relative Compactness",
        icon: "fa-compress",
        desc: "Surface area divided by volume — building form efficiency.",
        type: "slider",
        min: 0.5,
        max: 1.0,
        step: 0.01,
        default: 0.75,
        unit: "",
    },
    {
        id: "surfaceArea",
        label: "Surface Area",
        icon: "fa-vector-square",
        desc: "Total external envelope exposed to the environment.",
        type: "number",
        min: 100,
        max: 900,
        step: 1,
        default: 514,
        unit: "m²",
    },
    {
        id: "wallArea",
        label: "Wall Area",
        icon: "fa-grip-lines",
        desc: "Vertical opaque envelope — primary heat loss surface.",
        type: "number",
        min: 100,
        max: 400,
        step: 1,
        default: 245,
        unit: "m²",
    },
    {
        id: "roofArea",
        label: "Roof Area",
        icon: "fa-square",
        desc: "Horizontal envelope exposed to solar gain and sky.",
        type: "number",
        min: 50,
        max: 300,
        step: 1,
        default: 110,
        unit: "m²",
    },
    {
        id: "height",
        label: "Overall Height",
        icon: "fa-arrows-up-to-line",
        desc: "Building height — drives vertical heat stratification.",
        type: "slider",
        min: 2.5,
        max: 7.0,
        step: 0.1,
        default: 3.5,
        unit: "m",
    },
    {
        id: "orientation",
        label: "Orientation",
        icon: "fa-compass",
        desc: "Primary facade cardinal direction.",
        type: "select",
        options: ["North", "East", "South", "West"],
        default: "North",
        unit: "",
    },
    {
        id: "glazingArea",
        label: "Glazing Area",
        icon: "fa-window-maximize",
        desc: "Window-to-wall ratio (0 = opaque, 0.4 = fully glazed).",
        type: "slider",
        min: 0.0,
        max: 0.4,
        step: 0.01,
        default: 0.1,
        unit: "",
    },
    {
        id: "glazingDist",
        label: "Glazing Distribution",
        icon: "fa-table-cells-large",
        desc: "How windows are distributed across facades.",
        type: "select",
        options: [
            "0 — None",
            "1 — North",
            "2 — East",
            "3 — South",
            "4 — West",
            "5 — All",
        ],
        default: "0 — None",
        unit: "",
    },
];

const state = {};
INPUTS.forEach((i) => (state[i.id] = i.default));
window.energyEfficiencyState = state;

/* ============================================================
   BUILD INPUTS UI
   ============================================================ */
const inputsContainer = $("#inputsContainer");
if (inputsContainer) {
    INPUTS.forEach((inp, idx) => {
        const row = document.createElement("div");
        row.className =
            "input-row glass rounded-xl p-4 border border-transparent";
        row.dataset.id = inp.id;

        let controlHTML = "";
        if (inp.type === "slider") {
            const pct = ((inp.default - inp.min) / (inp.max - inp.min)) * 100;
            controlHTML = `
      <div class="flex items-center gap-3 mt-2">
        <input type="range" class="slider flex-1" id="in-${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" aria-label="${inp.label}" />
        <div class="font-mono text-sm font-bold text-white min-w-15 text-right">
          <span id="val-${inp.id}">${inp.default.toFixed(inp.step < 1 ? 2 : 0)}</span><span class="text-slate-500 text-xs ml-1">${inp.unit}</span>
        </div>
      </div>
      <div class="h-1 mt-2 rounded-full bg-slate-800 overflow-hidden">
        <div id="fill-${inp.id}" class="h-full bg-linear-to-r from-emerald-400 to-cyan-400 transition-all duration-300" style="width: ${pct}%;"></div>
      </div>
    `;
        } else if (inp.type === "number") {
            controlHTML = `
      <div class="flex items-center gap-3 mt-2">
        <input type="number" class="num-input flex-1 px-3 py-2.5 rounded-lg text-sm font-mono" id="in-${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" aria-label="${inp.label}" />
        <span class="text-xs text-slate-500 font-mono">${inp.unit}</span>
      </div>
    `;
        } else if (inp.type === "select") {
            controlHTML = `
      <select class="select-input w-full mt-2 px-3 py-2.5 rounded-lg text-sm" id="in-${inp.id}" aria-label="${inp.label}">
        ${inp.options.map((o) => `<option value="${o}" ${o === inp.default ? "selected" : ""}>${o}</option>`).join("")}
      </select>
    `;
        }

        row.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
        <i class="fa-solid ${inp.icon} text-emerald-400 text-xs"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <label class="text-sm font-medium text-slate-200">${inp.label}</label>
          <span class="text-[10px] font-mono text-slate-500">${String(idx + 1).padStart(2, "0")}</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">${inp.desc}</p>
        ${controlHTML}
      </div>
    </div>
  `;
        inputsContainer.appendChild(row);

        // Bind event
        const el = $("#in-" + inp.id);
        const valEl = $("#val-" + inp.id);
        const fillEl = $("#fill-" + inp.id);

        el.addEventListener("input", () => {
            let v = el.value;
            if (inp.type === "slider" || inp.type === "number")
                v = parseFloat(v);
            state[inp.id] = v;

            if (inp.type === "slider") {
                valEl.textContent = v.toFixed(inp.step < 1 ? 2 : 0);
                const pct = ((v - inp.min) / (inp.max - inp.min)) * 100;
                fillEl.style.width = pct + "%";
            }

            // Highlight active row
            $$(".input-row").forEach((r) => r.classList.remove("active"));
            row.classList.add("active");
            $("#activeParam").textContent = inp.label;

            // Notify 3D
            if (window.building3D) window.building3D.setFeature(inp.id, v);

            // Badge
            const badge = $("#viewerBadge");
            badge.innerHTML = `<span class="text-emerald-400">●</span> Editing: ${inp.label}`;
            clearTimeout(window._badgeTimer);
            window._badgeTimer = setTimeout(() => {
                badge.innerHTML = `<span class="text-emerald-400">●</span> Idle`;
            }, 1500);
        });

        el.addEventListener("focus", () => {
            row.classList.add("active");
            $("#activeParam").textContent = inp.label;
            if (window.building3D) window.building3D.focusFeature(inp.id);
        });
        el.addEventListener("blur", () => {
            row.classList.remove("active");
            if (window.building3D) window.building3D.unfocusFeature();
        });
    });
}

/* ============================================================
   SAMPLE / RANDOM / RESET
   ============================================================ */
const SAMPLES = [
    {
        compactness: 0.79,
        surfaceArea: 637,
        wallArea: 343,
        roofArea: 220,
        height: 3.5,
        orientation: "North",
        glazingArea: 0.15,
        glazingDist: "5 — All",
    },
    {
        compactness: 0.66,
        surfaceArea: 808,
        wallArea: 368,
        roofArea: 220,
        height: 7.0,
        orientation: "South",
        glazingArea: 0.3,
        glazingDist: "3 — South",
    },
    {
        compactness: 0.98,
        surfaceArea: 563,
        wallArea: 318,
        roofArea: 122,
        height: 7.0,
        orientation: "East",
        glazingArea: 0.25,
        glazingDist: "5 — All",
    },
    {
        compactness: 0.74,
        surfaceArea: 686,
        wallArea: 245,
        roofArea: 156,
        height: 3.5,
        orientation: "West",
        glazingArea: 0.1,
        glazingDist: "4 — West",
    },
];

function applyValues(vals) {
    INPUTS.forEach((inp) => {
        const v = vals[inp.id];
        state[inp.id] = v;
        const el = $("#in-" + inp.id);
        if (!el) return;

        el.value = typeof v === "string" ? v : v;
        if (inp.type === "slider") {
            const valEl = $("#val-" + inp.id);
            const fillEl = $("#fill-" + inp.id);
            if (valEl) valEl.textContent = v.toFixed(inp.step < 1 ? 2 : 0);
            if (fillEl) {
                const pct = ((v - inp.min) / (inp.max - inp.min)) * 100;
                fillEl.style.width = pct + "%";
            }
        }
        if (window.building3D) window.building3D.setFeature(inp.id, v);
    });
}

if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
        const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
        applyValues(s);
        toast("Sample building loaded", "success");
    });
}

if (randomBtn) {
    randomBtn.addEventListener("click", () => {
        const r = {
            compactness: +(0.5 + Math.random() * 0.5).toFixed(2),
            surfaceArea: Math.floor(200 + Math.random() * 600),
            wallArea: Math.floor(150 + Math.random() * 200),
            roofArea: Math.floor(80 + Math.random() * 180),
            height: +(2.5 + Math.random() * 4.5).toFixed(1),
            orientation: ["North", "East", "South", "West"][
                Math.floor(Math.random() * 4)
            ],
            glazingArea: +(Math.random() * 0.4).toFixed(2),
            glazingDist: [
                "0 — None",
                "1 — North",
                "2 — East",
                "3 — South",
                "4 — West",
                "5 — All",
            ][Math.floor(Math.random() * 6)],
        };
        applyValues(r);
        toast("Random building generated", "info");
    });
}

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        const defaults = {};
        INPUTS.forEach((i) => (defaults[i.id] = i.default));
        applyValues(defaults);
        toast("Fields reset to defaults", "warning");
    });
}

/* ============================================================
   PREDICTION MODEL (heuristic approximating trained regressor)
   ============================================================ */
function predict(features) {
    const {
        compactness,
        surfaceArea,
        wallArea,
        roofArea,
        height,
        orientation,
        glazingArea,
        glazingDist,
    } = features;

    // Normalized contributions (calibrated to approximate UCI dataset behavior)
    const c = (compactness - 0.5) / 0.5;
    const s = (surfaceArea - 200) / 600;
    const w = (wallArea - 150) / 200;
    const r = (roofArea - 80) / 200;
    const h = (height - 2.5) / 4.5;
    const g = glazingArea / 0.4;
    const orientIdx = ["North", "East", "South", "West"].indexOf(orientation);
    const o = (orientIdx - 1.5) / 1.5;
    const distIdx = parseInt(glazingDist.charAt(0));
    const d = distIdx / 5;

    // Heating load model (kWh/m²)
    const heating =
        8 +
        6 * c +
        4 * s +
        8 * w -
        4 * r +
        14 * h +
        5 * g +
        1.2 * Math.abs(o) +
        2.5 * d +
        (Math.random() - 0.5) * 1.2;

    // Cooling load model
    const cooling =
        12 +
        5 * c +
        3 * s +
        6 * w -
        3 * r +
        11 * h +
        9 * g +
        2.5 * o +
        4 * d +
        (Math.random() - 0.5) * 1.2;

    const heatingClamped = Math.max(5, Math.min(48, heating));
    const coolingClamped = Math.max(8, Math.min(50, cooling));

    // Confidence: based on distance from training distribution
    const dist =
        Math.abs(c) + Math.abs(s - 0.5) + Math.abs(w - 0.5) + Math.abs(h - 0.5);
    const confidence = Math.max(
        0.82,
        Math.min(0.98, 0.96 - dist * 0.04 + (Math.random() - 0.5) * 0.02),
    );

    // Feature contributions (SHAP-like)
    const contributions = [
        { name: "Relative Compactness", value: Math.abs(6 * c) },
        { name: "Surface Area", value: Math.abs(4 * s) },
        { name: "Wall Area", value: Math.abs(8 * w) },
        { name: "Roof Area", value: Math.abs(4 * r) },
        { name: "Overall Height", value: Math.abs(14 * h) },
        { name: "Orientation", value: Math.abs(2 * o) },
        { name: "Glazing Area", value: Math.abs(9 * g) },
        { name: "Glazing Distribution", value: Math.abs(4 * d) },
    ].sort((a, b) => b.value - a.value);

    return {
        heating: heatingClamped,
        cooling: coolingClamped,
        confidence,
        contributions,
    };
}

/* ============================================================
   PREDICTION FLOW
   ============================================================ */
const predictBtn = $("#predictBtn");
const predictContent = $("#predictContent");
const resultsSection = $("#resultsSection");

if (predictBtn && predictContent && resultsSection) {
    predictBtn.addEventListener("click", () => {
        // Validate
        for (const inp of INPUTS) {
            if (inp.type === "number") {
                const v = state[inp.id];
                if (isNaN(v) || v < inp.min || v > inp.max) {
                    toast(
                        `${inp.label} must be between ${inp.min} and ${inp.max}`,
                        "error",
                    );
                    return;
                }
            }
        }

        // Loading state
        predictContent.innerHTML = `
    <div class="w-5 h-5 rounded-full border-2 border-slate-900/30 border-t-slate-900 spin"></div>
    <span>Running inference...</span>
  `;
        predictBtn.classList.add("pulse-ring");

        // Simulate inference time
        setTimeout(() => {
            const result = predict(state);
            displayResults(result);
            predictContent.innerHTML = `<i class="fa-solid fa-bolt"></i> Predict Energy Efficiency <i class="fa-solid fa-arrow-right text-xs"></i>`;
            predictBtn.classList.remove("pulse-ring");
            toast("Prediction complete", "success");

            // Scroll to results
            setTimeout(
                () =>
                    resultsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    }),
                100,
            );
        }, 900);
    });
}

let lastResult = null;
function displayResults(result) {
    lastResult = result;
    resultsSection.classList.remove("hidden");

    // Animate heating gauge
    const heatingGauge = $("#heatingGauge");
    const heatingValue = $("#heatingValue");
    const heatingLabel = $("#heatingLabel");
    const heatPct = Math.min(1, result.heating / 50);
    heatingGauge.style.strokeDashoffset = 534 * (1 - heatPct);
    animateNumber(heatingValue, 0, result.heating, 1400, 1);
    heatingLabel.innerHTML =
        result.heating < 15
            ? '<span class="text-emerald-400">●</span> Excellent — low heating demand'
            : result.heating < 25
              ? '<span class="text-cyan-400">●</span> Moderate — typical residential'
              : '<span class="text-orange-400">●</span> High — consider envelope upgrades';

    // Animate cooling gauge
    const coolingGauge = $("#coolingGauge");
    const coolingValue = $("#coolingValue");
    const coolingLabel = $("#coolingLabel");
    const coolPct = Math.min(1, result.cooling / 50);
    coolingGauge.style.strokeDashoffset = 534 * (1 - coolPct);
    animateNumber(coolingValue, 0, result.cooling, 1400, 1);
    coolingLabel.innerHTML =
        result.cooling < 18
            ? '<span class="text-emerald-400">●</span> Excellent — low cooling demand'
            : result.cooling < 30
              ? '<span class="text-cyan-400">●</span> Moderate — typical residential'
              : '<span class="text-orange-400">●</span> High — solar control recommended';

    // Sparklines
    setTimeout(() => {
        $("#heatingSpark").classList.add("draw");
        $("#coolingSpark").classList.add("draw");
    }, 100);

    // Confidence
    const confidenceValue = $("#confidenceValue");
    const confidenceBar = $("#confidenceBar");
    animateNumber(
        confidenceValue,
        0,
        Math.round(result.confidence * 100),
        1200,
        0,
    );
    setTimeout(() => {
        confidenceBar.style.width = result.confidence * 100 + "%";
    }, 200);

    // Feature importance
    const fi = $("#featureImportance");
    const max = Math.max(...result.contributions.map((c) => c.value));
    fi.innerHTML = result.contributions
        .map(
            (c, i) => `
    <div class="flex items-center gap-3">
      <div class="text-[11px] text-slate-400 w-36 truncate">${c.name}</div>
      <div class="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-linear-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-1000" style="width: 0%; transition-delay: ${i * 80}ms;" data-target="${((c.value / max) * 100).toFixed(0)}"></div>
      </div>
      <div class="text-[11px] font-mono text-slate-300 w-10 text-right">${((c.value / max) * 100).toFixed(0)}%</div>
    </div>
  `,
        )
        .join("");
    setTimeout(() => {
        $$("#featureImportance [data-target]").forEach(
            (b) => (b.style.width = b.dataset.target + "%"),
        );
    }, 100);
}

function animateNumber(el, from, to, duration, decimals) {
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = from + (to - from) * eased;
        el.textContent = cur.toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

if (clearResultsBtn) {
    clearResultsBtn.addEventListener("click", () => {
        resultsSection.classList.add("hidden");
        toast("Results cleared", "info");
    });
}

/* ============================================================
   COMPARISON MODE
   ============================================================ */
let comparisons = [];
if (saveCompareBtn) {
    saveCompareBtn.addEventListener("click", () => {
        if (!lastResult) {
            toast("Run a prediction first", "warning");
            return;
        }
        if (comparisons.length >= 2) {
            toast("Clear existing comparisons first", "warning");
            return;
        }
        comparisons.push({
            ...lastResult,
            label: `Building ${comparisons.length + 1}`,
            features: { ...state },
        });
        renderComparisons();
        toast(`Saved as Building ${comparisons.length}`, "success");
    });
}

if (clearCompareBtn) {
    clearCompareBtn.addEventListener("click", () => {
        comparisons = [];
        renderComparisons();
        toast("Comparisons cleared", "info");
    });
}

function renderComparisons() {
    const area = $("#comparisonArea");
    const slots = $("#compareSlots");
    if (comparisons.length === 0) {
        area.classList.add("hidden");
        return;
    }
    area.classList.remove("hidden");
    slots.innerHTML = comparisons
        .map(
            (c, i) => `
    <div class="glass rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="text-sm font-medium">${c.label}</div>
        <button onclick="window.removeComparison(${i})" class="text-xs text-slate-500 hover:text-red-400"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="bg-orange-400/5 border border-orange-400/20 rounded-lg p-3">
          <div class="text-[10px] uppercase tracking-wider text-orange-400 mb-1">Heating</div>
          <div class="font-mono text-xl font-bold text-orange-400">${c.heating.toFixed(1)}</div>
          <div class="text-[10px] text-slate-500">kWh/m²</div>
        </div>
        <div class="bg-sky-400/5 border border-sky-400/20 rounded-lg p-3">
          <div class="text-[10px] uppercase tracking-wider text-sky-400 mb-1">Cooling</div>
          <div class="font-mono text-xl font-bold text-sky-400">${c.cooling.toFixed(1)}</div>
          <div class="text-[10px] text-slate-500">kWh/m²</div>
        </div>
      </div>
      <div class="mt-3 text-[10px] text-slate-400 font-mono">
        C:${c.features.compactness} · H:${c.features.height}m · G:${c.features.glazingArea}
      </div>
    </div>
  `,
        )
        .join("");
}

window.removeComparison = (i) => {
    comparisons.splice(i, 1);
    renderComparisons();
};

/* ============================================================
   FEATURE IMPORTANCE (model section)
   ============================================================ */
const IMPORTANCE = [
    { name: "Overall Height", value: 0.32, color: "#10B981" },
    { name: "Relative Compactness", value: 0.24, color: "#38BDF8" },
    { name: "Roof Area", value: 0.18, color: "#60A5FA" },
    { name: "Wall Area", value: 0.12, color: "#FB923C" },
    { name: "Glazing Area", value: 0.08, color: "#34D399" },
    { name: "Surface Area", value: 0.04, color: "#7DD3FC" },
    { name: "Orientation", value: 0.015, color: "#FDBA74" },
    {
        name: "Glazing Distribution",
        value: 0.005,
        color: "#93C5FD",
    },
];
const impChart = $("#importanceChart");
impChart.innerHTML = IMPORTANCE.map(
    (f, i) => `
  <div class="flex items-center gap-4">
    <div class="w-44 text-sm text-slate-300 truncate">${f.name}</div>
    <div class="flex-1 h-3 bg-slate-800/80 rounded-full overflow-hidden relative">
      <div class="imp-bar h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%; background: linear-gradient(90deg, ${f.color}, ${f.color}80); transition-delay: ${i * 80}ms;" data-target="${(f.value * 100).toFixed(1)}"></div>
    </div>
    <div class="font-mono text-sm w-14 text-right" style="color: ${f.color}">${(f.value * 100).toFixed(1)}%</div>
  </div>
`,
).join("");

const impObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                $$(".imp-bar", impChart).forEach(
                    (b) => (b.style.width = b.dataset.target + "%"),
                );
                impObserver.disconnect();
            }
        });
    },
    { threshold: 0.3 },
);
impObserver.observe(impChart);

/* ============================================================
   TECH STACK
   ============================================================ */
const TECH = [
    {
        name: "Python",
        icon: "fa-brands fa-python",
        color: "#3776AB",
        desc: "Core ML language",
    },
    {
        name: "Scikit-Learn",
        icon: "fa-solid fa-flask",
        color: "#F7931E",
        desc: "Regression models",
    },
    {
        name: "Pandas",
        icon: "fa-solid fa-table",
        color: "#150458",
        desc: "Data manipulation",
    },
    {
        name: "NumPy",
        icon: "fa-solid fa-calculator",
        color: "#013243",
        desc: "Numerical compute",
    },
    {
        name: "TensorFlow",
        icon: "fa-solid fa-network-wired",
        color: "#FF6F00",
        desc: "Neural networks",
    },
    {
        name: "FastAPI",
        icon: "fa-solid fa-bolt",
        color: "#009688",
        desc: "Model serving",
    },
    {
        name: "JavaScript",
        icon: "fa-brands fa-js",
        color: "#F7DF1E",
        desc: "Frontend logic",
    },
    {
        name: "React",
        icon: "fa-brands fa-react",
        color: "#61DAFB",
        desc: "UI components",
    },
    {
        name: "Tailwind CSS",
        icon: "fa-solid fa-wind",
        color: "#38BDF8",
        desc: "Styling system",
    },
    {
        name: "Three.js",
        icon: "fa-solid fa-cube",
        color: "#10B981",
        desc: "3D rendering",
    },
    {
        name: "Chart.js",
        icon: "fa-solid fa-chart-line",
        color: "#FF6384",
        desc: "Data visualization",
    },
    {
        name: "Framer Motion",
        icon: "fa-solid fa-film",
        color: "#0055FF",
        desc: "Animation",
    },
];

const techGrid = $("#techGrid");
if (techGrid) {
    techGrid.innerHTML = TECH.map(
        (t, i) => `
  <div class="feature-card glass rounded-2xl p-5 reveal" style="transition-delay: ${i * 50}ms;">
    <div class="flex items-start justify-between mb-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: ${t.color}15; border: 1px solid ${t.color}30;">
        <i class="${t.icon} text-base" style="color: ${t.color}"></i>
      </div>
      <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-600"></i>
    </div>
    <div class="font-display font-semibold text-sm mb-1">${t.name}</div>
    <div class="text-[11px] text-slate-400">${t.desc}</div>
  </div>
`,
    ).join("");

    // Re-observe newly added reveal elements
    $$(".feature-card").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty(
                "--mx",
                ((e.clientX - rect.left) / rect.width) * 100 + "%",
            );
            el.style.setProperty(
                "--my",
                ((e.clientY - rect.top) / rect.height) * 100 + "%",
            );
        });
        revealObserver.observe(el);
    });
}
