/*!
 * HDB UI · hdb-nav.js · v1.2.0
 * Menu công cụ dùng chung cho mọi trang trên https://hdb-digital.cloud
 *
 * CÁCH DÙNG: trong header để trống thẻ nav, rồi nạp file này ở cuối <body>:
 *   <nav class="nav" data-hdb-nav aria-label="Công cụ"></nav>
 *   <script src="https://hdb-digital.cloud/assets/hdb-nav.js?v=1.2" defer></script>
 *
 * Màn hình đủ rộng: hiện hàng link như cũ. Không đủ chỗ (điện thoại, máy tính bảng, hoặc khi có nhiều công cụ):
 * tự gộp thành nút "Công cụ" mở danh sách theo nhóm. Trang đang mở tự được đánh dấu (aria-current="page").
 *
 * THÊM / ĐỔI TÊN CÔNG CỤ: chỉ sửa mảng TOOLS dưới đây; mọi trang tự cập nhật.
 *   group: tên nhóm (giống trang chủ) · name: tên hiện trong menu · url: đường dẫn trên site · glyph: khóa trong GLYPHS
 */
(() => {
  "use strict";

  const TOOLS = [
    { group: "Dashboard theo dõi", name: "Đánh giá Google Maps", url: "/ggmap-dashboard/", glyph: "reviews" },
    { group: "Dashboard theo dõi", name: "Xếp hạng app", url: "/app-ranking/", glyph: "rank" },
    { group: "Dashboard theo dõi", name: "Theo dõi follower", url: "/social-follower/", glyph: "follow" },
    { group: "Tạo ấn phẩm", name: "Tạo mã QR", url: "/ggmap-qrcode/", glyph: "qr" },
    { group: "Tạo ấn phẩm", name: "Tạo bảng tên", url: "/bang-ten/", glyph: "badge" }
  ];
  const HOME = { name: "Trang chủ Digital Hub", url: "/" };

  /* Glyph icon cấp 1 (viewBox 48×48), giống sprite trong DESIGN.md mục 6 */
  const GLYPHS = {
    reviews: '<path fill-rule="evenodd" d="M24 4C15.7 4 9 10.7 9 19c0 10.5 15 25 15 25s15-14.5 15-25C39 10.7 32.3 4 24 4zM24 11.5l1.88 4.91 5.25.27-4.09 3.31 1.37 5.08L24 22.2l-4.41 2.87 1.37-5.08-4.09-3.31 5.25-.27z"/>',
    rank: '<path d="M6 30H17V22H31V34H42V44H6Z"/><path transform="translate(13.2 -1) scale(.9)" d="M12 2.5l2.6 6.1 6.6.6-5 4.4 1.5 6.5L12 16.6l-5.7 3.5 1.5-6.5-5-4.4 6.6-.6z"/>',
    follow: '<path d="M18 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM4 40c0-8.3 6.3-13 14-13s14 4.7 14 13v2H4z"/><path d="M36 10l8 8h-5v10h-6V18h-5z"/>',
    qr: '<path fill-rule="evenodd" d="M6 6h14v14H6zM9.5 9.5v7h7v-7zM11.5 11.5h3v3h-3zM28 6h14v14H28zM31.5 9.5v7h7v-7zM33.5 11.5h3v3h-3zM6 28h14v14H6zM9.5 31.5v7h7v-7zM11.5 33.5h3v3h-3z"/><path d="M28 28h5v5h-5zM37 28h5v5h-5zM32.5 32.5h5v5h-5zM28 37h5v5h-5zM37 37h5v5h-5z"/>',
    badge: '<path fill-rule="evenodd" d="M7 11h34a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4zM7 14.5v19h34v-19z"/><rect x="10" y="19" width="16" height="4.5" rx="1.5"/><rect x="10" y="26.5" width="11" height="3.5" rx="1.5"/><path fill-rule="evenodd" d="M29 18h9v12h-9zM31.2 20.2v7.6h4.6v-7.6z"/><rect x="32.4" y="22.4" width="2.2" height="3.2"/>',
    report: '<rect x="7" y="26" width="8" height="16" rx="2"/><rect x="20" y="17" width="8" height="25" rx="2"/><rect x="33" y="8" width="8" height="34" rx="2"/>',
    tool: '<path d="M10 8h12v12H10zM26 8h12v12H26zM10 28h12v12H10zM32 27l7 7-7 7-7-7z"/>'
  };
  const ICON_GRID = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>';
  const ICON_CHEV = '<svg class="nav-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 8.6L12 14.2l5.6-5.6L19 10l-7 7-7-7z"/></svg>';
  const ICON_HOME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 8h-2.6v9h-4.8v-6H10.4v6H5.6v-9H3z"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Trang hiện tại: so đường dẫn (bỏ index.html); chạy trên máy (file://, localhost) vẫn nhận ra theo tên thư mục
  const path = location.pathname.replace(/index\.html?$/, "");
  const isCurrent = (url) => url !== "/" && (path === url || path.endsWith(url));
  const cur = (url) => (isCurrent(url) ? ' aria-current="page"' : "");
  // Mở trên máy (file://) thì link trỏ về site thật để không gãy
  const href = (url) => (location.protocol === "file:" ? "https://hdb-digital.cloud" + url : url);

  function build(nav) {
    if (nav.dataset.hdbReady) return;
    nav.dataset.hdbReady = "1";
    const id = "hdbNavPanel" + Math.random().toString(36).slice(2, 7);
    const groups = [...new Set(TOOLS.map((t) => t.group))];

    nav.innerHTML =
      `<div class="nav-links">${TOOLS.map((t) => `<a href="${href(t.url)}"${cur(t.url)}>${esc(t.name)}</a>`).join("")}</div>` +
      `<div class="nav-menu">` +
        `<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="${id}">${ICON_GRID}<span>Công cụ</span>${ICON_CHEV}</button>` +
        `<div class="nav-panel" id="${id}" hidden>` +
          groups.map((g) => `<p class="nav-group">${esc(g)}</p>` + TOOLS.filter((t) => t.group === g).map((t) =>
            `<a class="nav-item" href="${href(t.url)}"${cur(t.url)}><span class="icon1" aria-hidden="true"><svg viewBox="0 0 48 48">${GLYPHS[t.glyph] || GLYPHS.tool}</svg></span><span>${esc(t.name)}</span></a>`).join("")).join("") +
          `<a class="nav-home" href="${href(HOME.url)}">${ICON_HOME}<span>${esc(HOME.name)}</span></a>` +
        `</div>` +
      `</div>`;

    const links = nav.querySelector(".nav-links");
    const btn = nav.querySelector(".nav-toggle");
    const panel = nav.querySelector(".nav-panel");

    const open = (on) => {
      panel.hidden = !on;
      btn.setAttribute("aria-expanded", String(on));
      nav.classList.toggle("is-open", on);
    };
    btn.addEventListener("click", () => open(panel.hidden));
    document.addEventListener("click", (e) => { if (!panel.hidden && !nav.contains(e.target)) open(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
    nav.addEventListener("focusout", (e) => { if (!panel.hidden && e.relatedTarget && !nav.contains(e.relatedTarget)) open(false); });

    // Gộp khi hàng link không còn đủ chỗ (tự tính lại khi đổi kích thước cửa sổ hoặc khi font tải xong)
    const fit = () => {
      nav.classList.remove("is-collapsed");
      const collapse = links.scrollWidth > links.clientWidth + 1;
      nav.classList.toggle("is-collapsed", collapse);
      if (!collapse) open(false);
    };
    fit();
    let lastW = 0;
    const onResize = () => { const w = nav.parentElement.clientWidth; if (w !== lastW) { lastW = w; requestAnimationFrame(fit); } };
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(nav.parentElement);
    else addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  const init = () => document.querySelectorAll("[data-hdb-nav]").forEach(build);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Cho trang chủ hoặc trang khác dùng lại cùng danh sách
  window.HDB_TOOLS = TOOLS.map((t) => ({ ...t }));
})();
