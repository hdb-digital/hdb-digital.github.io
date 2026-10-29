# HDB UI · Hướng dẫn dựng trang cho hdb-digital.cloud

Phiên bản 1.1 · 29/10/2026 · đi kèm `hdb-ui.css` v1.1
Dành cho AI (Claude Code…) và người dựng trang mới trên HDB Digital Hub. **Đọc hết file này trước khi viết code.**

Mục tiêu: mọi trang mới trông như cùng một sản phẩm với các trang đang chạy (Digital Hub, Đánh giá Google Maps, Xếp hạng app, Theo dõi follower, Tạo mã QR, Tạo bảng tên), đúng HDBank Digital Playbook (mục 2.a–2.j).

---

## 1. Bắt đầu

Mỗi công cụ là **một file `index.html` tự chứa** (HTML + JS thuần) trong repo riêng `hdb-digital/<ten-cong-cu>`, xuất bản qua GitHub Pages tại `https://hdb-digital.cloud/<ten-cong-cu>/`.

Trong `<head>`, theo đúng thứ tự:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap">
<link rel="stylesheet" href="https://hdb-digital.cloud/assets/hdb-ui.css?v=1.1">
<style>
  /* Chỉ CSS riêng của trang này (thành phần chưa có trong hdb-ui.css) */
</style>
```

- Luôn dùng **đường dẫn tuyệt đối** `https://hdb-digital.cloud/assets/...` cho CSS, logo, favicon, để mở thử bằng file trên máy vẫn hiện đúng.
- CSS riêng của trang: đặt tên class mới, **không định nghĩa lại** class có trong `hdb-ui.css`. Cần biến thể thì thêm class bổ sung (vd `.tile.is-xyz`) trong `<style>` của trang.
- Thành phần dùng được ở nhiều trang thì đề xuất đưa vào `hdb-ui.css` (xem mục 8), không chép qua lại giữa các trang.
- `assets/brand.css` trong repo trang chủ là bản cũ, **không dùng**.

---

## 2. Quy tắc bắt buộc

### Thiết kế
1. **Màu:** chỉ dùng biến trong `hdb-ui.css` (`var(--red)`, `var(--grey-20)`…). Không tự đặt mã hex mới.
2. **Logo:** file gốc `https://hdb-digital.cloud/assets/logo.png`, đặt góc trên trái header nền trắng. Không vẽ lại, đổi màu, thêm viền/bóng, kéo méo. Rộng tối thiểu 55px.
3. **Khung trang luôn đủ 4 phần:** header (logo + "Digital Hub" + menu công cụ) → hero đỏ (icon cấp 1 + tiêu đề + 1 câu mô tả + nhãn thông tin) → nội dung → footer (hotline 1900 6060, website, dải màu).
4. **Nút:** mỗi khu vực chỉ **một** nút đỏ `.btn-red` cho hành động chính; hành động phụ dùng `.btn-outline` hoặc `.link-btn`.
5. **Thẳng lề:** mọi khối chính (khung lọc, ô KPI, thẻ) cùng mép trái/phải. Lề trong thẻ dùng `var(--pad)` (24px, điện thoại 16px). Không lồng thẻ có padding vào thẻ có padding (lỗi "lề kép").
6. **Bộ lọc không dính khi cuộn.** Không dùng `position: sticky` cho khung lọc.
7. **So sánh 2 kỳ:** chỉ hiện **% thay đổi**: tăng `.delta.up` (xanh lá, ▲), giảm `.delta.down` (đỏ, ▼), không đổi xám "0%". Chỉ số "xấu" (số lượt 1★, số lỗi…) thì đảo màu: tăng là đỏ, giảm là xanh.
8. **Biểu đồ:** xem mục 5. HDBank luôn màu đỏ; tối đa 6 chuỗi: HDBank + 5 đối thủ; từ 2 chuỗi phải có chú giải; có tooltip khi rê chuột; có "Xem dạng bảng"; không dùng 2 trục tung.
9. **Responsive:** kiểm tra ở 1440, 1024, 768 và 390px; trang không được cuộn ngang; bảng rộng đặt trong `.tbl-wrap`.
10. **Trợ năng:** mọi ô nhập có `<label>`; nút chỉ có icon có `aria-label`; nút bật/tắt dùng `aria-pressed`; không dùng màu làm tín hiệu duy nhất (luôn kèm chữ, ▲▼ hoặc icon).

### Nội dung
1. Tiếng Việt, ngắn, cụ thể. **Không viết câu giới thiệu/giải thích kiểu AI** trong giao diện ("Dashboard này giúp bạn…", "Dưới đây là…", "Lưu ý: …" không cần thiết). Tiêu đề và nhãn tự nói lên nội dung; không thêm chú thích thừa.
2. Hero: `h1` = tên công cụ; `.hero-lead` = **một câu** nói công cụ làm gì; `.hero-meta` = các thông tin ngắn (số địa điểm, ngày cập nhật, định dạng file).
3. Số theo kiểu Việt Nam: `1.234` · `3,81` · `12,5%` (dùng `Intl.NumberFormat('vi-VN')`). Ngày `dd/mm/yyyy`, giờ `10:00`.
4. Tên nút là động từ: "Tải Excel", "Tạo mã QR", "Xóa lọc", "Xem dashboard".
5. Nguồn dữ liệu và giờ cập nhật: ghi ở `.hero-meta` và ở `.source-note` cuối trang dashboard.
6. Giọng điệu thương hiệu: minh bạch, cụ thể, tích cực, tự tin.

### Kỹ thuật
1. JS thuần, không framework. Thư viện ngoài chỉ lấy từ `cdnjs.cloudflare.com`, ghi rõ phiên bản, có `integrity` (SRI). Thư viện chỉ cần khi bấm nút (vd SheetJS để xuất Excel) thì tải lúc bấm.
2. Dữ liệu đặt trong `data.json` cùng thư mục. Dữ liệu nội bộ/nhạy cảm: mã hóa (AES-256-GCM, khóa từ mật khẩu bằng PBKDF2-SHA256) + màn hình mật khẩu `.gate` (xem 3.2).
3. Dữ liệu mẫu chỉ dùng khi mở bằng `file://` để xem thử, kèm `.notice.is-info` "Dữ liệu mẫu…". Trên site chỉ hiện dữ liệu thật.
4. `localStorage` chỉ để nhớ tùy chọn giao diện (thẻ đang mở/thu gọn…), luôn bọc `try/catch`. Không lưu thông tin cá nhân.
5. Công cụ tạo file: mọi xử lý diễn ra trên trình duyệt, không gửi ảnh/dữ liệu đi đâu. Hiện cảnh báo khi mở trong Zalo/Facebook (`.inapp` + `.sheet`) vì trình duyệt trong app không tải được file.

---

## 3. Khung HTML chuẩn

### 3.1 Phần chung: head, header, hero, footer

```html
<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#da2128">
<title>Tên công cụ · HDB Digital Hub</title>
<link rel="icon" type="image/png" href="https://hdb-digital.cloud/assets/favicon.png">
<!-- fonts + hdb-ui.css + <style> riêng: xem mục 1 -->
</head>
<body>
<svg class="sprite" aria-hidden="true"><!-- dán bộ icon ở mục 6 --></svg>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="HDB Digital Hub, về trang chủ">
      <img class="brand-logo" src="https://hdb-digital.cloud/assets/logo.png" alt="HDBank" width="113" height="30">
      <span class="brand-name">Digital Hub</span>
    </a>
    <nav class="nav" aria-label="Công cụ">
      <!-- Đủ các công cụ đang hoạt động, đúng thứ tự này; trang hiện tại có aria-current="page" -->
      <a href="/ggmap-dashboard/">Đánh giá<span class="long"> Google Maps</span></a>
      <a href="/app-ranking/"><span class="long">Xếp hạng app</span><span class="short">Xếp hạng</span></a>
      <a href="/social-follower/"><span class="long">Theo dõi follower</span><span class="short">Follower</span></a>
      <a href="/ggmap-qrcode/"><span class="long">Tạo mã QR</span><span class="short">Mã QR</span></a>
      <a href="/bang-ten/"><span class="long">Tạo bảng tên</span><span class="short">Bảng tên</span></a>
    </nav>
  </div>
</header>

<section class="hero" aria-labelledby="page-title">
  <div class="wrap hero-inner">
    <span class="icon1 hero-icon" aria-hidden="true"><svg><use href="#g-report"/></svg></span>
    <div>
      <h1 id="page-title">Tên công cụ</h1>
      <p class="hero-lead">Một câu nói công cụ làm gì.</p>
      <ul class="hero-meta" id="heroMeta"><li>Cập nhật 13/10/2026 lúc 10:00</li></ul>
    </div>
  </div>
</section>
<!-- Nếu bên dưới hero KHÔNG có khung lọc/panel nổi đè lên: <section class="hero no-overlap"> -->

<!-- … nội dung (3.2, 3.3) … -->

<footer class="site-footer">
  <div class="wrap footer-inner">
    <img class="brand-logo" src="https://hdb-digital.cloud/assets/logo.png" alt="HDBank" width="113" height="30">
    <p>HDB Digital Hub là trang nội bộ của đội Digital Marketing HDBank. Số liệu lấy từ [nguồn].</p>
    <ul class="footer-links">
      <li>Hotline <a href="tel:19006060">1900 6060</a></li>
      <li><a href="https://www.hdbank.com.vn" target="_blank" rel="noopener">www.hdbank.com.vn</a></li>
    </ul>
  </div>
  <div class="footer-band" aria-hidden="true"></div>
</footer>
</body>
</html>
```

### 3.2 Dashboard số liệu

Thứ tự: (màn hình mật khẩu) → khung lọc → ô KPI chính → ô KPI phụ → thẻ biểu đồ/bảng → danh sách chi tiết → ghi chú nguồn.

```html
<body class="locked">   <!-- chỉ khi có mật khẩu; bỏ class "locked" sau khi giải mã xong -->

<!-- header + hero như 3.1 -->

<section class="gate" id="gate" hidden>
  <div class="wrap">
    <form class="card gate-card" id="gateForm">
      <h2>Nhập mật khẩu để xem</h2>
      <label for="gatePw">Mật khẩu</label>
      <input type="password" id="gatePw" autocomplete="current-password" required>
      <label class="check"><input type="checkbox" id="gateRemember" checked> Ghi nhớ trên trình duyệt này</label>
      <p class="gate-err" id="gateErr" role="alert" hidden>Mật khẩu chưa đúng, vui lòng nhập lại.</p>
      <button class="btn btn-red" type="submit">Xem dashboard</button>
    </form>
  </div>
</section>

<div class="filter-dock">
  <div class="wrap">
    <div class="filters" role="search" aria-label="Bộ lọc dữ liệu">
      <!-- Hàng 1: thời gian + so sánh -->
      <div class="f-group has-sep full">
        <span class="f-cap"><span id="lbTime">Thời gian</span><span class="f-err" id="timeErr" role="alert" hidden>Ngày chưa hợp lệ, nhập dạng dd/mm/yyyy</span></span>
        <div class="range" role="group" aria-labelledby="lbTime">
          <button class="range-all" type="button" aria-pressed="true">Toàn bộ</button>
          <div class="date">
            <label for="fFrom">Từ ngày</label>
            <input id="fFrom" type="text" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" autocomplete="off">
            <button class="icon-btn" type="button" aria-label="Chọn từ ngày trên lịch"><svg aria-hidden="true"><use href="#i-cal"/></svg></button>
            <input class="date-native" type="date" tabindex="-1" aria-hidden="true">
          </div>
          <div class="date">
            <label for="fTo">đến ngày</label>
            <input id="fTo" type="text" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" autocomplete="off">
            <button class="icon-btn" type="button" aria-label="Chọn đến ngày trên lịch"><svg aria-hidden="true"><use href="#i-cal"/></svg></button>
            <input class="date-native" type="date" tabindex="-1" aria-hidden="true">
          </div>
        </div>
      </div>
      <div class="f-group full">
        <label for="fCmp">So sánh với</label>
        <select id="fCmp">
          <option value="none">Không so sánh</option><option value="prev">Kỳ liền trước</option>
          <option value="yoy">Cùng kỳ năm trước</option><option value="custom">Khoảng ngày khác</option>
        </select>
      </div>
      <div class="f-break"></div>
      <!-- Hàng 2: các chiều lọc + hành động -->
      <div class="f-group">
        <label for="fProv">Tỉnh/thành phố</label>
        <select id="fProv"><option>Tất cả</option></select>
      </div>
      <div class="f-group grow">
        <label for="fLoc">Địa điểm</label>
        <div class="combo">
          <svg class="combo-lead" aria-hidden="true"><use href="#i-search"/></svg>
          <input id="fLoc" type="text" role="combobox" aria-expanded="false" aria-controls="locList" aria-autocomplete="list" autocomplete="off" placeholder="Gõ tên hoặc chọn trong danh sách">
          <button class="icon-btn combo-clear" type="button" aria-label="Xóa địa điểm" hidden><svg aria-hidden="true"><use href="#i-x"/></svg></button>
          <button class="icon-btn combo-toggle" type="button" aria-label="Mở danh sách" tabindex="-1"><svg aria-hidden="true"><use href="#i-chev"/></svg></button>
          <ul class="combo-list" id="locList" role="listbox" hidden></ul>
        </div>
      </div>
      <div class="f-actions">
        <button class="link-btn" type="button">Xóa lọc</button>
        <button class="btn btn-red" type="button"><svg aria-hidden="true"><use href="#i-download"/></svg>Tải Excel</button>
      </div>
    </div>
  </div>
</div>

<main class="wrap stack" id="main">
  <!-- KPI chính: 1–2 chỉ số quan trọng nhất -->
  <section class="kpis cols-2" aria-label="Chỉ số chính">
    <article class="tile is-main">
      <p class="lab">Điểm trung bình</p>
      <div class="row"><span class="val">3,81</span><span class="delta up" aria-label="tăng 2,1%">▲ 2,1%</span></div>
    </article>
    <article class="tile is-main">
      <p class="lab">Tổng lượt đánh giá</p>
      <div class="row"><span class="val">3.447</span><span class="delta down" aria-label="giảm 4,0%">▼ 4,0%</span></div>
    </article>
  </section>

  <!-- KPI phụ: ô màu nhận diện + nhãn -->
  <section class="kpis cols-5" aria-label="Số lượt theo số sao">
    <article class="tile"><p class="lab"><i style="background:var(--s5)"></i>5★</p><div class="row"><span class="val">2.166</span></div></article>
    <!-- … -->
  </section>

  <!-- Số liệu tham chiếu cố định, thu gọn được -->
  <details class="card collapse" open>
    <summary class="collapse-head"><h2>Số liệu trước 10/10/2026</h2><span class="badge no-dot">Toàn hàng</span></summary>
    <div class="collapse-body">
      <div class="kpis">
        <article class="tile is-outline"><p class="lab">Điểm trung bình</p><p class="val">3,81</p></article>
        <!-- … -->
      </div>
    </div>
  </details>

  <div class="grid2">
    <section class="card">
      <div class="card-head"><h2>Phân bổ số sao</h2><p class="card-sub">01/10/2026 – 13/10/2026</p></div>
      <div class="legend"><span><i style="background:var(--c-hd)"></i>Kỳ đang xem</span><span><i class="outline"></i>Kỳ so sánh</span></div>
      <div class="chart" id="chartStars"><!-- SVG vẽ bằng JS --></div>
      <details class="disclosure"><summary>Xem dạng bảng</summary><div class="tbl-wrap"><table>…</table></div></details>
    </section>
    <section class="card">…</section>
  </div>

  <section class="card">
    <div class="card-head"><h2>Theo địa điểm</h2><div class="card-actions"><label class="check"><input type="checkbox"> Chỉ chưa phản hồi</label></div></div>
    <div class="tbl-wrap is-tall">
      <table>
        <thead><tr><th class="num">#</th><th>Địa điểm</th><th class="num sort" aria-sort="descending">Lượt đánh giá</th></tr></thead>
        <tbody><tr class="is-hd"><td class="num"><span class="rank">1</span></td><td>HDBank</td><td class="num">1.234</td></tr></tbody>
      </table>
    </div>
  </section>

  <aside class="source-note">
    <svg aria-hidden="true"><use href="#i-info"/></svg>
    <div><h2>Nguồn dữ liệu</h2><p>Google Maps công khai, cập nhật 10:00 hằng ngày.</p></div>
  </aside>
</main>

<!-- footer như 3.1 -->
<div class="tip" id="tip" role="tooltip" hidden></div>  <!-- 1 tooltip dùng chung, định vị bằng JS -->
```

Bố cục KPI: `.kpis` tự chia cột (ô ≥ 220px); ép số cột bằng `.cols-2` … `.cols-5` (điện thoại tự giảm). Bộ lọc lấy mẫu JS (combobox, ô ngày gõ được + lịch, xuất Excel) từ repo `ggmap-dashboard`.

### 3.3 Công cụ tạo ấn phẩm (form + xem trước)

Máy tính: trái = các bước, dưới là nút tải; phải = xem trước (dính khi cuộn). Điện thoại: các bước → xem trước → nút tải.

```html
<!-- header + hero như 3.1; hero-meta ghi định dạng file và "Mọi xử lý diễn ra trên trình duyệt của bạn" -->
<div class="inapp" id="inapp" role="note" hidden>
  <div class="wrap inapp-inner"><p><strong>Bạn đang mở trang trong Zalo.</strong> Nhấn <b>⋯</b> ở góc trên bên phải và chọn mở bằng trình duyệt.</p></div>
</div>

<main class="wrap" id="main">
  <div class="workspace">
    <section class="panel ws-form" aria-label="Thông tin ấn phẩm">
      <div class="panel-body">
        <ol class="step-list">
          <li class="step">
            <span class="step-num" aria-hidden="true">1</span>
            <div class="step-head"><h2>Chọn địa điểm</h2></div>
            <div class="field"><label for="prov">Tỉnh/thành phố</label><select id="prov">…</select></div>
            <div class="field"><label for="branch">Chi nhánh/PGD</label><select id="branch">…</select></div>
          </li>
          <li class="step">
            <span class="step-num" aria-hidden="true">2</span>
            <div class="step-head"><h2>Chọn mẫu</h2></div>
            <div class="choices">
              <button class="choice" type="button" aria-pressed="true"><img src="…" alt="">Table tent<small>A5 / A6</small></button>
              <button class="choice" type="button" aria-pressed="false"><img src="…" alt="">Màn hình dọc<small>9:16</small></button>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="panel ws-actions" aria-label="Tải file">
      <div class="panel-body">
        <ol class="step-list"><li class="step">
          <span class="step-num" aria-hidden="true">3</span>
          <div class="step-head"><h2>Tải file</h2></div>
          <div class="btn-stack">
            <button class="btn btn-red btn-lg" type="button"><svg aria-hidden="true"><use href="#i-download"/></svg>Tải PNG để in</button>
            <button class="btn btn-outline btn-lg" type="button"><svg aria-hidden="true"><use href="#i-file"/></svg>Tải PDF</button>
          </div>
          <p class="btn-note">Quét thử mã trước khi in.</p>
        </li></ol>
      </div>
    </section>

    <section class="panel ws-preview" aria-labelledby="pvTitle">
      <div class="preview-head"><h2 id="pvTitle">Xem trước</h2><span class="badge no-dot is-red">Table tent A5</span></div>
      <div class="stage"><div class="paper" style="width:min(100%, 360px)"><canvas id="cv"></canvas></div></div>
      <ul class="tags"><li>PNG 300 DPI</li><li>148 × 210 mm</li></ul>
      <ul class="tips"><li>In trên giấy couche 300gsm.</li></ul>
    </section>
  </div>
</main>
<!-- footer như 3.1 -->
```

Tải ảnh lên: `<label class="drop"><svg><use href="#i-upload"/></svg><b>Chọn ảnh</b> hoặc kéo thả vào đây<input type="file" accept="image/*"></label>` và dòng file đã chọn `.file-row` (ảnh nhỏ + `.name` + `.link-btn` "Xóa"). Công tắc: `<label class="switch"><input type="checkbox" role="switch"> Tự cắt viền trắng</label>`. Hộp thoại: `.sheet > .sheet-box` (mẫu trong repo `ggmap-qrcode`).

### 3.4 Trang giới thiệu (kiểu trang chủ Digital Hub)

```html
<body class="landing">
<a class="skip-link" href="#main">Đi tới nội dung</a>
<header class="site-header is-sticky">
  <div class="wrap header-inner">
    <a class="brand" href="#top" aria-label="HDB Digital Hub, về đầu trang">…logo + Digital Hub…</a>
    <nav class="nav" aria-label="Điều hướng chính">
      <a href="#cong-cu">Công cụ</a><a href="#quy-trinh">Quy trình</a>
      <a class="btn btn-outline btn-sm" href="#de-xuat">Đề xuất</a>
    </nav>
  </div>
</header>

<main id="main">
  <section class="hero hero-xl" aria-labelledby="hero-title">
    <div class="wrap hero-inner">   <!-- không có cột phải thì thêm class is-single -->
      <div>
        <h1 id="hero-title">Tiêu đề lớn<br> tối đa 3 dòng</h1>
        <p class="hero-lead">Một đến hai câu.</p>
        <div class="hero-actions">
          <a class="btn btn-white" href="#cong-cu">Xem các công cụ</a>
          <a class="btn btn-ghost" href="#de-xuat">Đề xuất công cụ mới</a>
        </div>
      </div>
      <aside class="hero-aside"><div class="card">…</div></aside>
    </div>
  </section>

  <section class="section" id="cong-cu" aria-labelledby="tools-title">
    <div class="wrap">
      <header class="section-head"><h2 id="tools-title">Công cụ đang hoạt động</h2><p>Một câu.</p></header>
      <div class="feature-group">
        <div class="group-head"><h3>Dashboard theo dõi</h3><span class="group-count">2 công cụ</span></div>
        <div class="feature-grid">   <!-- 2 cột; số thẻ lẻ thì thẻ cuối tự trải hết hàng -->
          <article class="feature-card">
            <div class="feature-top"><span class="icon1"><svg aria-hidden="true"><use href="#g-reviews"/></svg></span><span class="badge is-live">Đang hoạt động</span></div>
            <h4>Tên công cụ</h4>
            <p class="feature-lead">Một câu.</p>
            <ul class="points"><li>Tính năng</li></ul>          <!-- các bước theo thứ tự: <ol class="points"> -->
            <div class="feature-meta"><p><b>Dành cho:</b> …</p><p class="feature-note">Nguồn, giờ cập nhật.</p></div>
            <div class="feature-actions"><a class="btn btn-red" href="…">Mở dashboard<svg aria-hidden="true"><use href="#i-out"/></svg></a></div>
          </article>
        </div>
      </div>
      <div class="feature-group">…</div>
    </div>
  </section>

  <section class="section is-grey" id="quy-trinh">
    <div class="wrap">
      <header class="section-head"><h2>…</h2></header>
      <ol class="process">
        <li class="process-item"><span class="process-num" aria-hidden="true">1</span><h3>Làm rõ bài toán</h3><p>…</p></li>
        <!-- 4 bước -->
      </ol>
    </div>
  </section>

  <section class="section is-red" id="de-xuat">
    <div class="wrap split">
      <div>
        <header class="section-head"><h2>Đơn vị bạn cần một công cụ số?</h2><p>…</p></header>
        <ul class="diamonds"><li>…</li></ul>
      </div>
      <form class="form-card" novalidate>
        <h3>Đề xuất công cụ</h3>
        <div class="field"><label for="f-name">Họ và tên</label><input id="f-name" type="text" autocomplete="name"></div>
        <div class="field" id="field-need">
          <label for="f-need">Bạn cần công cụ để làm gì?</label>
          <textarea id="f-need" aria-describedby="need-err"></textarea>
          <p class="field-error" id="need-err">Hãy mô tả ngắn việc bạn cần giải quyết.</p>
        </div>
        <div class="form-foot"><button class="btn btn-red" type="submit">Gửi đề xuất</button><p class="form-status" role="status"></p></div>
      </form>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap footer-grid">…3 cột: logo + .footer-about | Công cụ | HDBank…</div>
  <div class="wrap"><div class="footer-bottom"><span>© 2026 HDBank. Trang dùng nội bộ.</span><span>Cam kết lợi ích cao nhất</span></div></div>
  <div class="footer-band" aria-hidden="true"></div>
</footer>
```

Email nhận đề xuất: `digitalwebsite@hdbank.com.vn` (form mở email soạn sẵn bằng `mailto:`).

---

## 4. Bảng tra thành phần

| Thành phần | Class | Ghi chú |
|---|---|---|
| Khung nội dung | `.wrap` | rộng tối đa 1240px, lề hai bên tự co |
| Xếp khối dọc | `.stack` | các con cách nhau 16px (điện thoại 12px) |
| Header | `.site-header > .wrap.header-inner > .brand + .nav` | trang giới thiệu thêm `.is-sticky` |
| Menu nhãn dài/ngắn | `<span class="long">` / `<span class="short">` | điện thoại hiện `.short` |
| Hero công cụ | `.hero > .wrap.hero-inner` + `.hero-icon`, `h1`, `.hero-lead`, `.hero-meta` | `.no-overlap` khi không có khối đè |
| Hero lớn | `.hero.hero-xl` + `.hero-actions`, `.hero-aside` | trang giới thiệu |
| Icon cấp 1 | `.icon1` (+ `style="--s:64px"`) | glyph trắng 48×48, nhãn ≤ 20 ký tự |
| Nút | `.btn` + `.btn-red` / `.btn-outline` / `.btn-white` / `.btn-ghost` | cỡ: `.btn-sm` 36px · mặc định 44px · `.btn-lg` 52px; `.btn-block` rộng hết |
| Nút chữ / nút icon | `.link-btn` / `.icon-btn` (`.is-filled`) | icon-btn luôn có `aria-label` |
| Nhóm nút tải dọc | `.btn-stack` + `.btn-note` | |
| Ô nhập trong form | `.field > label + input/select/textarea` + `.field-help`, `.field-error` | lỗi: thêm `.has-error` cho `.field` |
| Ô chọn / công tắc | `.check` / `.switch` | |
| Chọn 1 trong nhiều | `.seg > button[aria-pressed]` | `.seg.sm` cỡ nhỏ |
| Chip lọc / chip đối tượng | `.chips > .chip[aria-pressed]`, chip có `.icon-btn` để xóa | `.chip-sep` vạch ngăn |
| Khoảng ngày | `.range > .range-all + .date(label, input, .icon-btn, .date-native)` | gõ dd/mm/yyyy hoặc chọn lịch |
| Kỳ so sánh đang áp dụng | `.range-pill` | |
| Ô tìm + danh sách | `.combo` + `.combo-lead`, `.combo-clear`, `.combo-toggle`, `.combo-list > .combo-group, .combo-opt` | có giá trị: `.has-value`; mở: `.is-open` |
| Chọn nhiều (tối đa 5 đối thủ) | `.pop-wrap > .popover` + `.pop-quick`, `.pick-list`, `.pop-foot` | |
| Khung lọc | `.filter-dock > .wrap > .filters` + `.f-group` (`.has-sep`, `.grow`, `.full`), `.f-cap`, `.f-err`, `.f-break`, `.f-actions` | không sticky |
| Ô KPI | `.kpis` (`.cols-2`…`.cols-5`) > `.tile` (`.is-main`, `.is-outline`) + `.lab`, `.row`, `.val`, `.unit`, `.foot` | |
| Thay đổi % | `.delta.up` / `.delta.down` / `.delta` | kèm ▲ ▼ và `aria-label` |
| Thang sao | `.meter > .meter-bg + .meter-fg` (5 `<svg><use href="#star"/></svg>` mỗi lớp) | `.meter-fg` đặt `width` theo % |
| Thẻ | `.card` + `.card-head > h2 + .card-sub + .card-actions` | |
| Panel nổi | `.panel` + `.panel-body` | |
| Lưới thẻ | `.grid2` (≥ 480px/cột), `.grid3` (≥ 320px/cột) | |
| Tiêu đề phân đoạn | `.sec-head > h2 + p` | |
| Thẻ thu gọn | `details.card.collapse > summary.collapse-head + .collapse-body` | |
| Xem dạng bảng | `details.disclosure > summary + .tbl-wrap` | |
| Chú giải | `.legend > span > i` (`.line`, `.dash`, `.outline`) | |
| Biểu đồ SVG | `.chart` + `text.lab`, `text.val`, `.gridline`, `.axis`, `.mark-row > .hit` | nhãn HDBank: `text.lab.is-hd` |
| Biểu đồ canvas | `.chart-box` (`.tall`) | Chart.js 4.4.1 từ cdnjs |
| Tooltip | `.tip` + `.t`, `.r > .k + b` | |
| Bảng | `.tbl-wrap` (`.is-tall`) > `table` + `th.num`, `td.num`, `th.sort[aria-sort]`, `tr.is-hd`, `.rank`, `.cell-bar`, `.entity`, `.sticky-col` | |
| Thông báo | `.notice` + `.is-info` / `.is-warn` / `.is-err` / `.is-ok` (`.sm`) | |
| Nhãn trạng thái | `.badge` + `.is-live` / `.is-internal` / `.is-building` / `.is-red`, `.no-dot` | |
| Nhãn xám nhỏ | `ul.tags > li` | |
| Ghi chú nguồn | `.source-note` | cuối trang dashboard |
| Mật khẩu | `body.locked`, `.gate > .wrap > .card.gate-card` | |
| Đánh giá | `.reviews > .review` + `.review-head`, `.review-stars`, `.who`, `time`, `.review-meta`, `.review-text`, `.review-reply`, `.review-noreply`; `.more-row` | |
| Khu làm việc | `.workspace > .panel.ws-form + .panel.ws-actions + .panel.ws-preview` | |
| Các bước | `ol.step-list > li.step > .step-num + .step-head` | |
| Chọn mẫu | `.choices > button.choice[aria-pressed]` | |
| Tải ảnh lên | `label.drop` (`.is-over` khi kéo), `.file-row` | |
| Xem trước | `.preview-head`, `.stage > .paper`, `.tags`, `.tips` | |
| Hộp thoại | `.sheet > .sheet-box` + `.sheet-head`, `.sheet-btns`; `body.has-sheet` | |
| Cảnh báo Zalo | `.inapp > .wrap.inapp-inner` | |
| Section | `.section` (`.is-grey`, `.is-red`) + `.section-head` | |
| Nhóm thẻ | `.feature-group` + `.group-head > h3 + .group-count` | |
| Thẻ tính năng | `.feature-grid > .feature-card` + `.feature-top`, `.feature-lead`, `.points`, `.feature-meta`, `.feature-note`, `.feature-actions` | |
| Danh sách điểm | `ul.points` (dấu tích) / `ol.points` (số) / `ul.diamonds` (trên nền đỏ) | |
| Quy trình | `ol.process > li.process-item > .process-num + h3 + p` | |
| Form | `.form-card` + `.field` + `.form-foot`, `.form-status`; `.split` 2 cột | |
| Footer nhiều cột | `.footer-grid`, `.footer-about`, `.footer-bottom` | |
| Tiện ích | `.visually-hidden`, `.skip-link`, `.tnum`, `.swatch`, `.empty`, `.hide-sm`, `.sprite` | |

---

## 5. Màu & biểu đồ

**Biến màu chính:** `--red`, `--grey`, `--orange`, `--amber`, `--yellow`; sắc độ `--red-5/10/20`, `--grey-5/10/20/30/40/50/60/70/80`, `--orange-10/20`, `--yellow-20`. Vai trò: `--text`, `--muted`, `--subtle` (chỉ trên nền trắng), `--page`, `--surface`, `--line`, `--line-soft`.

**Tăng/giảm:** `--up` (xanh lá #1F7A45), `--down` (đỏ), `--flat` (xám). Trạng thái: `--ok/--ok-bg`, `--warn/--warn-bg`, `--err/--err-bg`.

**Biểu đồ: gán màu theo đối tượng, không theo thứ hạng** (lọc lại không được đổi màu của đối tượng còn lại):

| Biến | Màu | Dùng cho |
|---|---|---|
| `--c-hd` | đỏ | HDBank, luôn luôn |
| `--c1` | xám | đối thủ 1 |
| `--c2` | cam | đối thủ 2, kèm **nét đứt** |
| `--c3` | xám 70% | đối thủ 3, kèm **nét chấm** |
| `--c4` | cam vàng | đối thủ 4 |
| `--c1` | xám | đối thủ 5, kèm **nét gạch dài** |
| `--c-rest` | xám 30% | các đối tượng còn lại khi chỉ làm nổi HDBank |
| `--s5`…`--s1` | đỏ, cam, xám 30/70/100% | thang số sao 5★ → 1★ |

Bảng màu thương hiệu **không đạt** kiểm định màu cho biểu đồ nhiều chuỗi (đã chạy `validate_palette`: xám không có sắc độ nên khó phân biệt, cam/cam vàng tương phản dưới 3:1 trên nền trắng). Vì vậy bắt buộc:
- Ưu tiên kiểu "**HDBank đỏ, còn lại xám**" (`--c-hd` + `--c-rest`) khi chỉ cần so HDBank với thị trường.
- Từ 2 chuỗi: luôn có `.legend`; ≤ 4 chuỗi thì ghi nhãn trực tiếp ở cuối đường/cột; phân biệt thêm bằng nét đứt/chấm.
- Mọi biểu đồ có tooltip khi rê chuột và có `details.disclosure` "Xem dạng bảng".
- Tối đa 6 chuỗi: HDBank + 5 đối thủ; nhiều hơn thì gộp "Khác" hoặc tách nhiều biểu đồ nhỏ. Không dùng 2 trục tung.
- Nét: đường 2px, thanh mảnh có góc bo 4px ở đầu, lưới và trục nhạt (`--grid`, `--axis`). Chữ trong biểu đồ dùng màu chữ, không dùng màu chuỗi.

---

## 6. Icon

Icon dán một lần vào `<svg class="sprite" aria-hidden="true">` đầu `<body>`, dùng bằng `<svg aria-hidden="true"><use href="#i-cal"/></svg>`. Glyph `g-*` (48×48) dùng trong `.icon1`; icon `i-*` (24×24) dùng trong nút, ô nhập. Icon mới vẽ theo cùng kiểu: khối đặc, đơn giản, ít nét nhỏ.

```html
<svg class="sprite" aria-hidden="true">
  <!-- Glyph icon cấp 1 (48×48) -->
  <symbol id="g-reviews" viewBox="0 0 48 48"><path fill-rule="evenodd" d="M24 4C15.7 4 9 10.7 9 19c0 10.5 15 25 15 25s15-14.5 15-25C39 10.7 32.3 4 24 4zM24 11.5l1.88 4.91 5.25.27-4.09 3.31 1.37 5.08L24 22.2l-4.41 2.87 1.37-5.08-4.09-3.31 5.25-.27z"/></symbol>
  <symbol id="g-rank" viewBox="0 0 48 48"><path d="M6 30H17V22H31V34H42V44H6Z"/><path transform="translate(13.2 -1) scale(.9)" d="M12 2.5l2.6 6.1 6.6.6-5 4.4 1.5 6.5L12 16.6l-5.7 3.5 1.5-6.5-5-4.4 6.6-.6z"/></symbol>
  <symbol id="g-follow" viewBox="0 0 48 48"><path d="M18 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM4 40c0-8.3 6.3-13 14-13s14 4.7 14 13v2H4z"/><path d="M36 10l8 8h-5v10h-6V18h-5z"/></symbol>
  <symbol id="g-qr" viewBox="0 0 48 48"><path fill-rule="evenodd" d="M6 6h14v14H6zM9.5 9.5v7h7v-7zM11.5 11.5h3v3h-3zM28 6h14v14H28zM31.5 9.5v7h7v-7zM33.5 11.5h3v3h-3zM6 28h14v14H6zM9.5 31.5v7h7v-7zM11.5 33.5h3v3h-3z"/><path d="M28 28h5v5h-5zM37 28h5v5h-5zM32.5 32.5h5v5h-5zM28 37h5v5h-5zM37 37h5v5h-5z"/></symbol>
  <symbol id="g-badge" viewBox="0 0 48 48"><path fill-rule="evenodd" d="M7 11h34a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4zM7 14.5v19h34v-19z"/><rect x="10" y="19" width="16" height="4.5" rx="1.5"/><rect x="10" y="26.5" width="11" height="3.5" rx="1.5"/><path fill-rule="evenodd" d="M29 18h9v12h-9zM31.2 20.2v7.6h4.6v-7.6z"/><rect x="32.4" y="22.4" width="2.2" height="3.2"/></symbol>
  <symbol id="g-report" viewBox="0 0 48 48"><rect x="7" y="26" width="8" height="16" rx="2"/><rect x="20" y="17" width="8" height="25" rx="2"/><rect x="33" y="8" width="8" height="34" rx="2"/></symbol>
  <symbol id="g-tool" viewBox="0 0 48 48"><path d="M10 8h12v12H10zM26 8h12v12H26zM10 28h12v12H10zM32 27l7 7-7 7-7-7z"/></symbol>
  <!-- Icon chức năng (24×24) -->
  <symbol id="i-search" viewBox="0 0 24 24"><path d="M10.5 3a7.5 7.5 0 0 1 6 12l4.3 4.3-1.5 1.5-4.3-4.3A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z"/></symbol>
  <symbol id="i-cal" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zM5 9.5V19h14V9.5z"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6.4 8.6L12 14.2l5.6-5.6L19 10l-7 7-7-7z"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6.4 5L12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4z"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M10.8 4h2.4v6.8H20v2.4h-6.8V20h-2.4v-6.8H4v-2.4h6.8z"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M10.8 3h2.4v9.2l3.6-3.6 1.7 1.7L12 16.8l-6.5-6.5 1.7-1.7 3.6 3.6zM4 18.6h16V21H4z"/></symbol>
  <symbol id="i-upload" viewBox="0 0 24 24"><path d="M10.8 21h2.4v-9.2l3.6 3.6 1.7-1.7L12 7.2l-6.5 6.5 1.7 1.7 3.6-3.6zM4 3h16v2.4H4z"/></symbol>
  <symbol id="i-file" viewBox="0 0 24 24"><path d="M6 2h8l6 6v12.5A1.5 1.5 0 0 1 18.5 22h-13A1.5 1.5 0 0 1 4 20.5v-17A1.5 1.5 0 0 1 5.5 2zm7 1.8V9h5.2zM8 13v2h8v-2zm0 4v2h6v-2z"/></symbol>
  <symbol id="i-out" viewBox="0 0 24 24"><path d="M14 3h7v7h-2.4V7.1l-8.2 8.2-1.7-1.7 8.2-8.2H14zM5 5h6v2.4H7.4v9.2h9.2V13H19v6H5z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2zm0 4.6a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8z"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-1.2 8.5V17h2.4v-6.5zm1.2-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 1 5 5v3h1.5A1.5 1.5 0 0 1 20 11.5v9A1.5 1.5 0 0 1 18.5 22h-13A1.5 1.5 0 0 1 4 20.5v-9A1.5 1.5 0 0 1 5.5 10H7V7a5 5 0 0 1 5-5zm0 2.3A2.7 2.7 0 0 0 9.3 7v3h5.4V7A2.7 2.7 0 0 0 12 4.3z"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z"/></symbol>
  <symbol id="i-tt" viewBox="0 0 24 24"><path d="M16.6 3c.4 2.3 1.9 3.8 4.2 4v3.1c-1.5.1-2.9-.4-4.2-1.2v6.3c0 3.6-2.6 6.3-6.2 6.3A6.1 6.1 0 0 1 4.2 15c.1-3.7 3.3-6.4 7-5.9v3.2c-1.8-.4-3.8.7-3.8 2.7 0 1.6 1.3 2.9 3 2.9 1.9 0 3-1.4 3-3.2V3z"/></symbol>
  <symbol id="star" viewBox="0 0 24 24"><path d="M12 2.5l2.6 6.1 6.6.6-5 4.4 1.5 6.5L12 16.6l-5.7 3.5 1.5-6.5-5-4.4 6.6-.6z"/></symbol>
</svg>
```

---

## 7. Đưa trang mới lên Digital Hub

1. Tạo repo `hdb-digital/<ten-cong-cu>` (chữ thường, gạch nối), bật GitHub Pages → trang chạy tại `https://hdb-digital.cloud/<ten-cong-cu>/`.
2. Thêm link vào `.nav` của **tất cả** các trang công cụ (giữ thứ tự: dashboard trước, công cụ tạo ấn phẩm sau).
3. Thêm công cụ vào mảng `TOOLS` trong `index.html` của repo `hdb-digital.github.io` (trang chủ): `status` (`live` / `internal` / `building`), `group` (`monitor` = dashboard, `print` = tạo ấn phẩm), `name`, `label` (≤ 20 ký tự), `glyph`, `url`, `cta`, `lead`, `features` hoặc `steps`, `audience`, `note`. Trang chủ tự hiện ở khung mở nhanh, danh sách công cụ và footer.
4. Glyph mới cho icon cấp 1: thêm `<symbol id="g-...">` vào sprite của trang chủ và của trang công cụ.

---

## 8. Sửa `hdb-ui.css`

File nằm ở `assets/hdb-ui.css` trong repo `hdb-digital.github.io`; mọi trang dùng chung, nên:
- **Được làm:** thêm class/biến mới, sửa lỗi hiển thị không làm đổi bố cục trang đang chạy → tăng số phụ (1.0 → 1.1) ở đầu file và trong `?v=` của trang mới; ghi thay đổi vào mục "Nhật ký" dưới đây.
- **Không làm:** đổi tên, xóa hoặc đổi hẳn kiểu của class đang dùng. Cần thay đổi lớn thì tạo `hdb-ui-v2.css` và chuyển dần từng trang.
- Trước khi đẩy lên: mở thử ít nhất một trang dashboard và một trang công cụ đang dùng file này ở 1440px và 390px.

### Nhật ký
- **1.0** (28/10/2026): bản đầu, rút từ 6 trang đang chạy.
- **1.1** (29/10/2026), sửa lỗi, không đổi tên class:
  - Ô chọn (`select`) chừa đủ chỗ cho mũi tên ▾ (40px trong form, 36px trong khung lọc); trước đó bị quy tắc chung ghi đè còn 14px, tên dài chạy đè lên mũi tên.
  - Ô nhập và ô chọn thụt chữ 2px (`text-indent`) để máy có cài Myriad Pro không bị cắt nét trái chữ đầu (vd chữ "T" trong "Tất cả").
  - Ô nhập trong khung lọc dùng line-height 1.2 như các trang cũ.
  - `textarea` cao tối thiểu 120px đúng như thiết kế (trước đó bị ép còn 46px).
  - `.kpis.cols-5` giữ 5 ô trên một hàng ở máy tính bảng, chỉ chia 3 cột trên điện thoại (≤ 760px).

---

## 9. Dùng với Claude Code

Chép `DESIGN.md` vào gốc repo mới và tạo `CLAUDE.md` có dòng:

```
@DESIGN.md
Dựng trang theo DESIGN.md và dùng https://hdb-digital.cloud/assets/hdb-ui.css. Không tự đặt màu, font, kiểu nút mới.
```

Khi giao việc, nói rõ loại trang (dashboard / công cụ tạo ấn phẩm / trang giới thiệu) để AI lấy đúng khung ở mục 3.
