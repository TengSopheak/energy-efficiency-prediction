import { $ as querySelector, $$ as querySelectorAll, ripple } from '../utils/utils.js';

const $ = querySelector;
const $$ = querySelectorAll;

export const sampleBtn = $("#sampleBtn");
export const randomBtn = $("#randomBtn");
export const resetBtn = $("#resetBtn");
export const clearResultsBtn = $("#clearResultsBtn");
export const saveCompareBtn = $("#saveCompareBtn");
export const clearCompareBtn = $("#clearCompareBtn");

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
export const revealObserver = new IntersectionObserver(
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

export function animatePerfRings(container) {
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

export function animatePerfBars(container) {
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
