"use strict";
/* জনদূত app only. Injected into every page by the build; the website never loads this file.
   1) colour themes (button bottom-right)  2) reserved ad places  3) hides the "install app" button inside the app  4) app-share button  5) new-version notice  6) PDF/print + share bridge. */
(function () {
  /* AdMob: শুরুতে টেস্ট ব্যানার (Google-এর টেস্ট আইডি)। আসল আইডি পেলে bannerId বদলান এবং testMode:false করুন। */
  var ADS = { enabled: false, testMode: true, bannerId: "ca-app-pub-5053693807902862/7430389029" };
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
  /* ব্যানার: পর্দার নিচে ভাসবে, তাই নিচে জায়গা রাখা হয় */
  function showBanner() {
    var AM = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob;
    if (!AM) return;
    AM.initialize({ initializeForTesting: !!ADS.testMode }).then(function () {
      return AM.showBanner({ adId: ADS.bannerId, adSize: "BANNER", position: "BOTTOM_CENTER", margin: 0, isTesting: !!ADS.testMode });
    }).then(function () {
      document.body.style.paddingBottom = "60px";
      var s = document.createElement("style");
      s.textContent = "#bar{bottom:50px!important}#jd-share-btn{bottom:64px!important}";
      document.head.appendChild(s);
    }).catch(function () {});
  }
  if (ADS.enabled) document.addEventListener("DOMContentLoaded", function () { setTimeout(showBanner, 800); });
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
  btn.innerHTML = "<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><circle cx='12' cy='12' r='9'/><path d='M12 3a9 9 0 0 1 0 18z' fill='currentColor'/></svg>";
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
    sheet.innerHTML = "<h2>থিম</h2>" + THEMES.map(function (x) {
      return '<button type="button" data-t="' + x[0] + '" aria-current="' + (cur === x[0]) + '"><span class="jd-tn"><i class="jd-sw jd-sw-' + x[0] + '"></i>' + x[1] + '</span><span class="jd-ck">' + (cur === x[0] ? "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M5 12.5 10 17 19 7.5'/></svg>" : "") + "</span></button>";
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
      ".jd-sw{display:inline-block;width:22px;height:22px;border-radius:50%;margin-right:12px;vertical-align:middle;border:1px solid var(--line)}.jd-sw-auto{background:linear-gradient(90deg,#f3f6f4 50%,#0b1210 50%)}.jd-sw-light{background:#f3f6f4}.jd-sw-night{background:#0b1210}.jd-sw-blue{background:#1f5fbf}.jd-sw-cream{background:#fbf6ea}.jd-tn{display:flex;align-items:center}.jd-ck{color:var(--g);display:flex}#jd-theme-btn svg,#jd-share-btn svg,#jd-about-btn svg{display:block}" +
    "#jd-share-btn{display:flex;align-items:center;justify-content:center;padding:0}#jd-share-btn.jd-hbtn{position:absolute;top:10px;left:10px;width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:19px;line-height:1;z-index:5}" +
    "#jd-share-btn{position:fixed;left:14px;bottom:14px;z-index:60;width:50px;height:50px;border:0;border-radius:50%;background:var(--g);color:#fff;font-size:22px;line-height:1;box-shadow:0 6px 18px rgba(0,0,0,.25)}" +
    ".jd-shr .jd-shead{display:flex;gap:12px;align-items:center;margin-bottom:12px}.jd-shr .jd-shead h2{margin:0 0 2px}.jd-shr .jd-shead p{margin:0;font-size:13px;line-height:1.5;color:var(--mut)}" +
    ".jd-shr{max-height:92vh;overflow-y:auto}" +
    ".jd-shr .jd-qr{display:flex;gap:14px;align-items:center;margin:0 0 12px;padding:12px;border:1px solid var(--line);border-radius:14px;background:var(--bg)}" +
    ".jd-shr .jd-qrb{flex:none;padding:6px;border-radius:10px;background:#fff;line-height:0}.jd-shr .jd-qr b{font-size:15px}.jd-shr .jd-qr p{margin:4px 0 0;font-size:12.5px;line-height:1.5;color:var(--mut)}" +
    ".jd-shr .jd-sg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}" +
    ".jd-shr .jd-sg button{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;min-height:72px;padding:6px 2px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink)}" +
    ".jd-shr .jd-sg i{display:flex;font-style:normal;color:var(--g);font-size:26px;line-height:1}.jd-shr .jd-sg small{font-size:12px;line-height:1.2;text-align:center}" +
    ".jd-shr .jd-sx{justify-content:center;border:0;color:var(--mut);font-size:15px}" +
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
  sbtn.innerHTML = "<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M12 3v12'/><path d='M7.5 7.5 12 3l4.5 4.5'/><path d='M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'/></svg>";
  var hd = document.querySelector("header");
  if (hd) { sbtn.className = "jd-hbtn"; hd.appendChild(sbtn); } else { document.body.appendChild(sbtn); }
  /* ---------- tiny offline QR code maker (byte mode, level L, versions 1-9) ---------- */
  function qrMatrix(text) {
    var bytes = unescape(encodeURIComponent(text)).split("").map(function (c) { return c.charCodeAt(0); });
    /* version: [data codewords per block, ec per block, blocks] */
    var VER = [null, [19, 7, 1], [34, 10, 1], [55, 15, 1], [80, 20, 1], [108, 26, 1], [68, 18, 2], [78, 20, 2], [97, 24, 2], [116, 30, 2]];
    var ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46]];
    var v = 0, i, j;
    for (i = 1; i <= 9; i++) { if (bytes.length + 2 <= VER[i][0] * VER[i][2]) { v = i; break; } }
    if (!v) return null;
    var cfg = VER[v], dpb = cfg[0], epb = cfg[1], nb = cfg[2], total = dpb * nb;
    /* bit stream */
    var bits = [];
    function put(val, n) { for (var k = n - 1; k >= 0; k--) bits.push((val >> k) & 1); }
    put(4, 4); put(bytes.length, 8);
    bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, total * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    var data = [];
    for (i = 0; i < bits.length; i += 8) { var x = 0; for (j = 0; j < 8; j++) x = (x << 1) | bits[i + j]; data.push(x); }
    for (var pad = 0; data.length < total; pad++) data.push(pad % 2 ? 17 : 236);
    /* Reed-Solomon */
    var EXP = [], LOG = [], g = 1;
    for (i = 0; i < 255; i++) { EXP[i] = g; LOG[g] = i; g <<= 1; if (g & 256) g ^= 285; }
    function mul(a, b) { return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0; }
    var gen = [1];
    for (i = 0; i < epb; i++) {
      var ng = new Array(gen.length + 1).fill(0);
      for (j = 0; j < gen.length; j++) { ng[j] ^= gen[j]; ng[j + 1] ^= mul(gen[j], EXP[i]); }
      gen = ng;
    }
    var blocks = [], ecs = [];
    for (i = 0; i < nb; i++) {
      var d = data.slice(i * dpb, (i + 1) * dpb), r = new Array(epb).fill(0);
      d.forEach(function (b) {
        var f = b ^ r[0]; r.shift(); r.push(0);
        for (var k = 0; k < epb; k++) r[k] ^= mul(gen[k + 1], f);
      });
      blocks.push(d); ecs.push(r);
    }
    var all = [];
    for (i = 0; i < dpb; i++) blocks.forEach(function (b) { all.push(b[i]); });
    for (i = 0; i < epb; i++) ecs.forEach(function (b) { all.push(b[i]); });
    var stream = [];
    all.forEach(function (b) { for (var k = 7; k >= 0; k--) stream.push((b >> k) & 1); });
    /* matrix */
    var n = 17 + 4 * v, M = [], F = [];
    for (i = 0; i < n; i++) { M.push(new Array(n).fill(0)); F.push(new Array(n).fill(false)); }
    function set(r, c, val) { M[r][c] = val ? 1 : 0; F[r][c] = true; }
    function finder(r0, c0) {
      for (var r = -1; r <= 7; r++) for (var c = -1; c <= 7; c++) {
        var rr = r0 + r, cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        var on = (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6)) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        set(rr, cc, on);
      }
    }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (i = 8; i < n - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    var al = ALIGN[v];
    al.forEach(function (ar) { al.forEach(function (ac) {
      if (F[ar][ac]) return;
      for (var r = -2; r <= 2; r++) for (var c = -2; c <= 2; c++) set(ar + r, ac + c, Math.max(Math.abs(r), Math.abs(c)) !== 1);
    }); });
    set(n - 8, 8, 1);
    for (i = 0; i < 9; i++) { if (!F[8][i]) set(8, i, 0); if (!F[i][8]) set(i, 8, 0); }
    for (i = 0; i < 8; i++) { if (!F[8][n - 1 - i]) set(8, n - 1 - i, 0); if (!F[n - 1 - i][8]) set(n - 1 - i, 8, 0); }
    if (v >= 7) {
      var rem = v;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) * 0x1F25);
      var vi = (v << 12) | rem;
      for (i = 0; i < 18; i++) { var bit = (vi >> i) & 1, a = Math.floor(i / 3), b = n - 11 + (i % 3); set(a, b, bit); set(b, a, bit); }
    }
    /* place data */
    var idx = 0, up = true;
    var places = [];
    for (var col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (var k = 0; k < n; k++) {
        var row = up ? n - 1 - k : k;
        for (var cc2 = 0; cc2 < 2; cc2++) { var c2 = col - cc2; if (!F[row][c2]) places.push([row, c2]); }
      }
      up = !up;
    }
    var masks = [
      function (r, c) { return (r + c) % 2 === 0; }, function (r) { return r % 2 === 0; }, function (r, c) { return c % 3 === 0; },
      function (r, c) { return (r + c) % 3 === 0; }, function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
      function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; }, function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
      function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }
    ];
    function build(mk) {
      var Q = M.map(function (row) { return row.slice(); });
      places.forEach(function (p, t) { var bit = t < stream.length ? stream[t] : 0; Q[p[0]][p[1]] = bit ^ (masks[mk](p[0], p[1]) ? 1 : 0); });
      /* format info: level L = 01 */
      var fd = (1 << 3) | mk, fr = fd;
      for (var z = 0; z < 10; z++) fr = (fr << 1) ^ ((fr >> 9) * 0x537);
      var fmt = ((fd << 10) | fr) ^ 0x5412;
      function fb(i) { return (fmt >> i) & 1; }
      for (z = 0; z < 6; z++) Q[z][8] = fb(z);
      Q[7][8] = fb(6); Q[8][8] = fb(7); Q[8][7] = fb(8);
      for (z = 9; z < 15; z++) Q[8][14 - z] = fb(z);
      for (z = 0; z < 8; z++) Q[8][n - 1 - z] = fb(z);
      for (z = 8; z < 15; z++) Q[n - 15 + z][8] = fb(z);
      return Q;
    }
    function penalty(Q) {
      var p = 0, r, c, run, dark = 0;
      for (r = 0; r < n; r++) { run = 1; for (c = 1; c < n; c++) { if (Q[r][c] === Q[r][c - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (c = 0; c < n; c++) { run = 1; for (r = 1; r < n; r++) { if (Q[r][c] === Q[r - 1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (r = 0; r < n - 1; r++) for (c = 0; c < n - 1; c++) { var s = Q[r][c]; if (s === Q[r][c + 1] && s === Q[r + 1][c] && s === Q[r + 1][c + 1]) p += 3; }
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) dark += Q[r][c];
      p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
      return p;
    }
    var best = null, bp = 1e9;
    for (var mk = 0; mk < 8; mk++) { var Q = build(mk), pp = penalty(Q); if (pp < bp) { bp = pp; best = Q; } }
    return best;
  }
  function qrSvg(text, px) {
    var Q = qrMatrix(text);
    if (!Q) return "";
    var n = Q.length, q = 3, d = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (Q[r][c]) d += "M" + (c + q) + " " + (r + q) + "h1v1h-1z";
    var s = n + q * 2;
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 ' + s + " " + s + '" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="' + s + '" height="' + s + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }

  var MSG = "জনদূত — আপনার কথা সঠিক দপ্তরে\nঅধিকার জানুন, দরখাস্ত লিখুন, সরাসরি পাঠান\n\nঅ্যান্ড্রয়েড অ্যাপ (ফ্রি): " + APK_URL + "\nওয়েবসাইট: " + SITE;
  function enc(x) { return encodeURIComponent(x); }
  function openShare() {
    close();
    var scrim = document.createElement("div"); scrim.className = "jd-scrim";
    var sheet = document.createElement("div"); sheet.className = "jd-sheet jd-shr";
    var opts = [
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z'/></svg>", "হোয়াটসঅ্যাপ", function () { window.open("https://wa.me/?text=" + enc(MSG), "_blank"); }],
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M21 4 3.5 10.8l5.6 2.1L11 19l3.2-3.6 4.3 3.2z'/><path d='M9.1 12.9 16 7.5'/></svg>", "টেলিগ্রাম", function () { window.open("https://t.me/share/url?url=" + enc(APK_URL) + "&text=" + enc("জনদূত — আপনার কথা সঠিক দপ্তরে। ফ্রি অ্যাপ:"), "_blank"); }],
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><circle cx='12' cy='12' r='9'/><path d='M3 12h18'/><path d='M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z'/></svg>", "ফেসবুক", function () { window.open("https://www.facebook.com/sharer/sharer.php?u=" + enc(SITE), "_blank"); }],
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M4 5h16v11H8l-4 4z'/></svg>", "এসএমএস", function () { location.href = "sms:?&body=" + enc(MSG); }],
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='m4 7 8 6 8-6'/></svg>", "ইমেইল", function () { location.href = "mailto:?subject=" + enc("জনদূত অ্যাপ") + "&body=" + enc(MSG); }],
      ["<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><rect x='8' y='8' width='12' height='12' rx='2'/><path d='M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2'/></svg>", "লিংক কপি", function (btn) {
        var done = function () { var t = btn.querySelector("small"); t.textContent = "কপি হয়েছে"; };
        try { navigator.clipboard.writeText(MSG).then(done, done); } catch (e) {
          var ta = document.createElement("textarea"); ta.value = MSG; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (x) {} ta.remove(); done();
        }
      }],
      ["<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M12 3v12'/><path d='M7.5 7.5 12 3l4.5 4.5'/><path d='M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'/></svg>", "অন্য অ্যাপে", function () { nativeShare({ title: "জনদূত", text: MSG }).catch(function () {}); }]
    ];
    sheet.innerHTML =
      '<div class="jd-shead"><svg width="44" height="49" viewBox="0 0 72 80" aria-hidden="true"><defs><linearGradient id="jdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1fa36f"/><stop offset="1" stop-color="#075238"/></linearGradient></defs><path d="M36 3 66 14v24c0 19-12 33-30 39C18 71 6 57 6 38V14z" fill="url(#jdg)" stroke="#e8a317" stroke-width="3"/><rect x="22" y="20" width="28" height="34" rx="3" fill="#fff"/><path d="M27 29h18M27 35h18M27 41h11" stroke="#0b6b4a" stroke-width="2.5" stroke-linecap="round"/><circle cx="46" cy="50" r="11" fill="#e8a317"/><path d="m40.5 50 4 4 7-8" fill="none" stroke="#0d1814" stroke-width="3" stroke-linec
