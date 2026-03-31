/**
 * audio.js — Splash Screen Gateway · Background Audio Engine
 * Mì Quảng 52/49
 *
 * Kiến trúc:
 *   iOS Safari & Android Chrome enforce Autoplay Policy ở cấp engine —
 *   không có workaround nào vượt qua được nếu không có user gesture.
 *
 *   Giải pháp: Splash Screen là "Gesture Gateway" hợp lệ duy nhất.
 *   Một tap vào nút CTA đồng thời:
 *     (1) audio.play() — gọi TRỰC TIẾP trong event handler (iOS yêu cầu)
 *     (2) Dismiss splash với transition
 *     (3) Sync UI của floating toggle
 *
 *   Page Visibility API: pause khi tab ẩn → resume khi quay lại.
 *   Tiết kiệm CPU & pin (bắt buộc trên iOS low-power mode).
 */

(function () {
  const audio    = document.getElementById("bg-audio");
  const toggleBtn = document.getElementById("audio-toggle");
  const toggleIcon = toggleBtn.querySelector("i");
  const splash   = document.getElementById("splash");
  const enterBtn = document.getElementById("splash-enter");

  let userMuted = false;

  // ── Sync floating button UI ──────────────────────────────────
  function syncUI() {
    const isPlaying = !audio.paused && !userMuted;
    toggleBtn.classList.toggle("muted", !isPlaying);
    toggleIcon.className = isPlaying
      ? "fa-solid fa-music"
      : "fa-solid fa-volume-xmark";
    toggleBtn.setAttribute("aria-label", isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền");
    toggleBtn.setAttribute("data-tip",   isPlaying ? "Tắt nhạc"     : "Bật nhạc");
  }

  // ── Safe play wrapper ────────────────────────────────────────
  // Luôn trả Promise — không crash console khi bị reject
  function tryPlay() {
    audio.volume = 0.52;
    return audio.play().catch(() => {});
  }

  // ── Splash dismiss + audio unlock (CÙNG 1 event handler) ────
  // CRITICAL: iOS kiểm tra call stack — audio.play() phải nằm trực tiếp
  // trong handler của user gesture, không được tách qua async/setTimeout.
  function onEnter() {
    audio.load();
    tryPlay().then(syncUI);

    splash.classList.add("hiding");
    splash.addEventListener(
      "transitionend",
      () => {
        splash.classList.add("hidden");
        splash.removeAttribute("role"); // Xóa khỏi accessibility tree
        document.body.focus();         // Trả focus cho body → screen reader
      },
      { once: true }
    );

    syncUI();
  }

  // Bắt cả click lẫn touchend để cover iOS (ghost click 300ms)
  enterBtn.addEventListener("click", onEnter);
  enterBtn.addEventListener("touchend", (e) => {
    e.preventDefault(); // Chặn ghost click
    onEnter();
  });

  // Tap ra ngoài nút (toàn overlay) cũng trigger
  splash.addEventListener("click", (e) => {
    if (e.target === splash) onEnter();
  });

  // ── Floating toggle (sau khi đã unlock) ─────────────────────
  toggleBtn.addEventListener("click", () => {
    if (audio.paused) {
      userMuted = false;
      tryPlay().then(syncUI);
    } else {
      userMuted = true;
      audio.pause();
      syncUI();
    }
  });

  // ── Page Visibility API ──────────────────────────────────────
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audio.pause();
    } else if (!userMuted && splash.classList.contains("hidden")) {
      tryPlay();
    }
    syncUI();
  });

  // ── Init: lock body scroll khi splash đang hiện ──────────────
  document.body.style.overflow = "hidden";
  splash.addEventListener(
    "transitionend",
    () => { document.body.style.overflow = ""; },
    { once: true }
  );

  syncUI();
})();
