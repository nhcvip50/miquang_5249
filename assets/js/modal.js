/**
 * modal.js — Payment Modal · Copy STK to Clipboard
 * Mì Quảng 52/49
 *
 * Clipboard strategy:
 *   1. navigator.clipboard.writeText() — modern (HTTPS required)
 *   2. document.execCommand("copy")    — fallback (HTTP / old WebView)
 */

(function () {
  const modal    = document.getElementById("payment-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const payBtn   = document.getElementById("pay-btn");
  const copyBtn  = document.getElementById("copy-stk-btn");
  const STK      = "98626717018";

  // ── Open ────────────────────────────────────────────────────
  function openModal() {
    modal.removeAttribute("aria-hidden");
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Lock scroll iOS + Android
    closeBtn.focus();                        // Focus trap → screen reader
  }

  // ── Close ───────────────────────────────────────────────────
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    payBtn.focus(); // Trả focus về trigger button
  }

  // ── Triggers ────────────────────────────────────────────────
  payBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener("click", closeModal);

  // Click backdrop (bên ngoài card)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // ── Copy STK ────────────────────────────────────────────────
  function onCopied() {
    copyBtn.classList.add("copied");
    copyBtn.innerHTML =
      '<i class="fa-solid fa-check" aria-hidden="true"></i> Đã sao chép!';
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML =
        '<i class="fa-regular fa-copy" aria-hidden="true"></i> Sao chép số tài khoản';
    }, 2200);
  }

  function execCommandFallback() {
    const ta = document.createElement("textarea");
    ta.value = STK;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    ta.remove();
    onCopied();
  }

  copyBtn.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(STK).then(onCopied).catch(execCommandFallback);
    } else {
      execCommandFallback();
    }
  });
})();
