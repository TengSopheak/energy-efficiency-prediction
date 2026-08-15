import { $ as querySelector, $$ as querySelectorAll } from '../utils/utils.js';
import { revealObserver } from '../ui/ui-behaviors.js';

const $ = querySelector;
const $$ = querySelectorAll;

/* ============================================================
   FEATURE IMPORTANCE (correlation-based EDA section)
   ============================================================ */
// This follows the notebooks' "Feature Importance (|Correlation|)" analysis,
// where X8 / glazing distribution and X7 / glazing area dominate and X1 is weakest.
const IMPORTANCE = [
    { name: "Glazing Distribution", value: 0.52, color: "#10B981" },
    { name: "Glazing Area", value: 0.48, color: "#38BDF8" },
    { name: "Overall Height", value: 0.31, color: "#60A5FA" },
    { name: "Wall Area", value: 0.22, color: "#FB923C" },
    { name: "Roof Area", value: 0.18, color: "#34D399" },
    { name: "Surface Area", value: 0.15, color: "#7DD3FC" },
    { name: "Relative Compactness", value: 0.09, color: "#FDBA74" },
    { name: "Orientation", value: 0.05, color: "#93C5FD" },
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
