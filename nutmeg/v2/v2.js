(function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll("[data-v2-frame]"));
  var setBrand = function (brand) {
    frames.forEach(function (f) { f.src = f.getAttribute("src").split("#")[0] + "#" + brand; });
  };
  document.querySelectorAll("[data-v2-brand]").forEach(function (list) {
    list.addEventListener("nm-tab", function (e) { setBrand(e.detail.getAttribute("data-brand")); });
    var on = list.querySelector("[aria-selected='true']");
    if (on) setBrand(on.getAttribute("data-brand"));
  });

  document.querySelectorAll("[data-v2-open]").forEach(function (btn) {
    var dialog = document.getElementById(btn.getAttribute("data-v2-open"));
    if (!dialog || typeof dialog.showModal !== "function") { btn.hidden = true; return; }
    btn.addEventListener("click", function () {
      dialog.showModal();
      if (btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "true");
    });
    dialog.addEventListener("close", function () {
      if (btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
      btn.focus();
    });
  });
  document.querySelectorAll(".v2-drawer").forEach(function (dialog) {
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.querySelectorAll("[data-v2-close]").forEach(function (b) { b.addEventListener("click", function () { dialog.close(); }); });
  });
})();
