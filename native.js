"use strict";
/* জনদূত app only. Injected into every page by the build; the website never loads this file.
   1) colour themes (button bottom-right)  2) reserved ad places  3) hides the "install app" button inside the app  4) app-share button  5) new-version notice  6) PDF/print + share bridge. */
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

  /* ---------- extra css (kept here so only this file changes) ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#jd-share-btn.jd-hbtn{position:absolute;top:10px;left:10px;width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:19px;line-height:1;z-index:5}" +
    "#jd-share-btn{position:fixed;left:14px;bottom:14px;z-index:60;width:50px;height:50px;border:0;border-radius:50%;background:var(--g);color:#fff;font-size:22px;line-height:1;box-shadow:0 6px 18px rgba(0,0,0,.25)}" +
    ".jd-upd{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:70;max-width:560px;margin:0 auto;padding:12px 14px;border-radius:14px;background:#0b6b4a;color:#fff;border:2px solid #e8a317;box-shadow:0 8px 24px rgba(0,0,0,.35);font-family:'Noto Sans Bengali',system-ui,sans-serif;display:flex;gap:10px;align-items:center;flex-wrap:wrap}" +
    ".jd-upd b{flex:1 1 100%;font-size:15px}.jd-upd span{flex:1 1 100%;font-size:13px;opacity:.92}" +
    ".jd-upd a,.jd-upd button{min-height:40px;padding:0 16px;border:0;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;font-family:inherit}" +
    ".jd-upd a{background:#e8a317;color:#0d1814}.jd-upd button{background:rgba(255,255,255,.18);color:#fff}";
  document.head.appendChild(st);

  var APK_URL = "https://github.com/sbd-r/jonodut-app/releases/latest/download/jonodut-release.apk";
  var SITE = "https://sbd-r.github.io/jonodut/";

  /* ---------- share bridge: the phone's own share sheet ---------- */
  function nativeShare(d) {
    var P = window.Capacitor && window.Capacitor.Plugins;
    if (P && P.Share) return P.Share.share({ title: d.title || "", text: d.text || "", dialogTitle: "শেয়ার করুন" });
    return Promise.reject(new Error("no share"));
  }
  /* the web-share call inside the letter page ("ফাইলসহ শেয়ার") uses this inside the app */
  navigator.canShare = function () { return false; };
  navigator.share = function (d) { return nativeShare(d); };

  /* ---------- share the app ---------- */
  var sbtn = document.createElement("button");
  sbtn.id = "jd-share-btn"; sbtn.type = "button"; sbtn.setAttribute("aria-label", "অ্যাপ শেয়ার করুন");
  sbtn.textContent = "📤";
  var hd = document.querySelector("header");
  if (hd) { sbtn.className = "jd-hbtn"; hd.appendChild(sbtn); } else { document.body.appendChild(sbtn); }
  sbtn.addEventListener("click", function () {
    var text = "📢 জনদূত: জানুন অধিকার, লিখুন দরখাস্ত, পাঠান সঠিক দপ্তরে।\n\n📲 অ্যান্ড্রয়েড অ্যাপ: " + APK_URL + "\n🌐 ওয়েবসাইট: " + SITE;
    nativeShare({ title: "জনদূত", text: text }).catch(function () {
      try { navigator.clipboard.writeText(text); alert("লিংক কপি হয়েছে"); } catch (e) {}
    });
  });

  /* ---------- new version notice (like FreeLearn Hub) ---------- */
  setTimeout(function () {
    if (typeof window.JD_BUILD !== "number") return;
    fetch("https://api.github.com/repos/sbd-r/jonodut-app/releases/latest").then(function (r) { return r.json(); }).then(function (j) {
      var m = /(\d+)\s*$/.exec((j && j.name) || "");
      if (!m) return;
      var latest = +m[1];
      if (latest <= window.JD_BUILD) return;
      var seen = 0; try { seen = +localStorage.getItem("jd-upd-dismissed") || 0; } catch (e) {}
      if (seen >= latest) return;
      var box = document.createElement("div"); box.className = "jd-upd";
      box.innerHTML = "<b>🔔 জনদূতের নতুন সংস্করণ এসেছে</b><span>আপডেট করলে নতুন সুবিধা ও ঠিকঠাক কাজ পাবেন। পুরনো অ্যাপের ওপরেই বসবে, কিছু মুছবে না।</span>";
      var a = document.createElement("a"); a.href = APK_URL; a.textContent = "আপডেট করুন";
      var b = document.createElement("button"); b.type = "button"; b.textContent = "পরে";
      b.addEventListener("click", function () { try { localStorage.setItem("jd-upd-dismissed", String(latest)); } catch (e) {} box.remove(); });
      box.appendChild(a); box.appendChild(b);
      document.body.appendChild(box);
    }).catch(function () {});
  }, 2500);
})();
 
