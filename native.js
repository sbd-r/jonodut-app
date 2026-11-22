"use strict";
/* জনদূত app only. Injected into every page by the build; the website never loads this file.
   1) colour themes (button bottom-right)  2) reserved ad places  3) hides the "install app" button inside the app. */
(function () {
  var ADS = { enabled: false };          /* turn on later, when AdMob is wired in */
  var KEY = "jd-theme";
  var THEMES = [
    ["auto", "ফোন অনুযায়ী"],
    ["light", "দিনের আলো"],
    ["night", "রাত"],
    ["blue", "নীল"],
    ["cream", "ক্রিম"]
  ];

  function get() { try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; } }
  function apply(t) {
    var h = document.documentElement;
    if (t === "auto") h.removeAttribute("data-jd-theme"); else h.setAttribute("data-jd-theme", t);
  }
  apply(get());

  /* hide the website's own install button: the app is already installed */
  var inst = document.getElementById("inst");
  if (inst) inst.style.display = "none";

  /* reserved ad places: top and bottom */
  if (ADS.enabled) document.documentElement.setAttribute("data-jd-ads", "on");
  var main = document.querySelector("main");
  if (main) {
    var top = document.createElement("div");
    top.className = "jd-ad"; top.setAttribute("data-slot", "top");
    main.parentNode.insertBefore(top, main);
    var bottom = document.createElement("div");
    bottom.className = "jd-ad"; bottom.setAttribute("data-slot", "bottom");
    main.appendChild(bottom);
  }

  /* theme button and sheet */
  var btn = document.createElement("button");
  btn.id = "jd-theme-btn"; btn.type = "button"; btn.setAttribute("aria-label", "থিম");
  btn.textContent = "🎨";
  var head = document.querySelector("header");
  if (head) {
    /* top-right corner of the page header: never covers the buttons at the bottom */
    if (getComputedStyle(head).position === "static") head.style.position = "relative";
    btn.className = "jd-hbtn";
    head.appendChild(btn);
  } else {
    document.body.appendChild(btn);
  }

  function close() { document.querySelectorAll(".jd-scrim,.jd-sheet").forEach(function (n) { n.remove(); }); }
  function open() {
    close();
    var cur = get();
    var scrim = document.createElement("div"); scrim.className = "jd-scrim";
    var sheet = document.createElement("div"); sheet.className = "jd-sheet";
    sheet.innerHTML = "<h2>থিম বেছে নিন</h2>" + THEMES.map(function (x) {
      return '<button type="button" data-t="' + x[0] + '" aria-current="' + (cur === x[0]) + '"><span>' + x[1] + '</span><span>' + (cur === x[0] ? "✓" : "") + "</span></button>";
    }).join("");
    sheet.addEventListener("click", function (e) {
      var b = e.target.closest("[data-t]");
      if (!b) return;
      try { localStorage.setItem(KEY, b.getAttribute("data-t")); } catch (err) {}
      apply(b.getAttribute("data-t"));
      close();
    });
    scrim.addEventListener("click", close);
    document.body.appendChild(scrim);
    document.body.appendChild(sheet);
  }
  btn.addEventListener("click", open);
})();
