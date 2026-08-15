import { $ as querySelector, $$ as querySelectorAll, toast } from '../utils/utils.js';
import { state } from './form.js';
import { lastResult, displayResults } from './prediction.js';
import { saveCompareBtn, clearCompareBtn } from '../ui/ui-behaviors.js';

const $ = querySelector;
const $$ = querySelectorAll;

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

export function renderComparisons() {
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