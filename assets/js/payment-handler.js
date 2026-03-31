document.getElementById("pay-btn").addEventListener("click", () => {
  let alertTimer;

  // Khi user quay lại từ app → hủy alert
  window.addEventListener("pageshow", () => clearTimeout(alertTimer), { once: true });

  window.location.href = "zalopay://";

  // Tăng lên 3s để iOS kịp show dialog + user bấm "Mở"
});