/* ============================================================
   DOM QUERY HELPERS
   ============================================================ */
export const $ = (s, p = document) => p.querySelector(s);
export const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
export function toast(message, type = "info") {
    const container = document.querySelector("#toastContainer");
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

export function ripple(btn, e) {
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