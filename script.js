const state = {

  need: 0,

  saving: 0,

  want: 0,

  startingSaving: 0,

  checked: false

};



/* =========================
   TIPS ATO
========================= */

const tips = [

  "Kebutuhan adalah hal yang memang perlu dipenuhi. Contohnya makanan dan perlengkapan sekolah.",

  "Tabungan adalah bagian uang yang sengaja disimpan untuk tujuan nanti.",

  "Keinginan boleh ada! Kuncinya adalah memastikan kebutuhan dan tabungan tetap diperhatikan.",

  "Kebiasaan kecil yang diulang seperti merawat biji. Lama-lama bisa tumbuh menjadi sesuatu yang besar.",

  "Tidak semua uang harus dibelanjakan hari ini. Beri sebagian kesempatan untuk membantu tujuan masa depan."

];



/* =========================
   BADGES
========================= */

const badges = [

  {
    id: "first",

    icon: "🌱",

    name: "Benih Pertama",

    hint: "Masukkan atom pertama ke arena.",

    unlock: s => total(s) > 0
  },


  {
    id: "balanced",

    icon: "⚖️",

    name: "Peracik Seimbang",

    hint: "Gunakan ketiga jenis atom.",

    unlock: s =>
      s.need > 0 &&
      s.saving > 0 &&
      s.want > 0
  },


  {
    id: "saver",

    icon: "🪙",

    name: "Penjaga Tabungan",

    hint: "Buat tabungan setidaknya sebesar kebutuhan.",

    unlock: s =>
      s.saving >= s.need &&
      s.saving > 0
  },


  {
    id: "wise",

    icon: "🧠",

    name: "Pembuat Keputusan",

    hint: "Lakukan pemeriksaan molekul.",

    unlock: s =>
      s.checked
  },


  {
    id: "tree",

    icon: "🌳",

    name: "Pohon Raksasa",

    hint: "Bangun susunan dengan tabungan lebih besar daripada keinginan.",

    unlock: s =>
      s.saving > s.want &&
      s.saving >= s.need &&
      s.saving > 0
  }

];



/* =========================
   UTILITIES
========================= */

const money = n =>
  "Rp" +
  Math.round(n)
    .toLocaleString("id-ID");


const total = s =>
  s.need +
  s.saving +
  s.want;



/* =========================
   TAMBAH ATOM
========================= */

function addAtom(type) {

  state[type]++;

  state.checked = false;

  render();

}



/* =========================
   RESET
========================= */

function reset() {

  state.need = 0;

  state.saving = 0;

  state.want = 0;

  state.startingSaving = 0;

  state.checked = false;

  showFeedback("");

  render();

}



/* =========================
   RENDER UTAMA
========================= */

function render() {

  document.getElementById("needCount")
    .textContent =
    state.need;


  document.getElementById("savingCount")
    .textContent =
    state.saving;


  document.getElementById("wantCount")
    .textContent =
    state.want;


  document.getElementById("atomCount")
    .textContent =
    `${total(state)} atom`;


  document.getElementById("startingSaving")
    .textContent =
    money(state.saving * 10000);



  const score =
    calcScore();


  document.getElementById("habitScore")
    .textContent =
    `${score}/100`;



  const projected =
    project();


  document.getElementById("projectedSaving")
    .textContent =
    money(projected[11]);



  updateHealth();

  renderMolecule();

  renderBadges();

  drawChart(projected);

  updateAtoMessage();

}



/* =========================
   SKOR
========================= */

function calcScore() {

  const t =
    total(state);


  if (!t)
    return 0;


  let score = 60;


  if (state.saving > 0)
    score += 20;


  if (state.saving >= state.need)
    score += 10;


  if (state.want <= state.need)
    score += 10;


  if (state.want > state.saving)
    score -= 20;


  return Math.max(
    0,
    Math.min(100, score)
  );

}



/* =========================
   PROYEKSI 12 BULAN
========================= */

function project() {

  const base =
    state.saving * 10000;


  const balance =
    (state.need + state.saving) === 0
      ? 0
      : state.saving /
        (state.need + state.saving);


  const wantRatio =
    total(state) === 0
      ? 0
      : state.want /
        total(state);


  let monthlyRate =
    0.008 +
    balance * 0.018 -
    wantRatio * 0.035;


  if (total(state) === 0)
    monthlyRate = 0;


  monthlyRate =
    Math.max(
      -0.10,
      Math.min(0.025, monthlyRate)
    );


  const values = [];


  let value = base;


  for (let i = 0; i < 12; i++) {

    if (i > 0) {

      value =
        value *
        (1 + monthlyRate);

    }


    values.push(
      Math.max(0, value)
    );

  }


  return values;

}



/* =========================
   HEALTH STATUS
========================= */

function updateHealth() {

  const pill =
    document.getElementById(
      "healthPill"
    );


  if (total(state) === 0) {

    pill.textContent =
      "⚪ Belum diracik";

    pill.style.background =
      "#f1f4f5";

    return;
  }



  if (
    state.want > state.need ||
    state.want > state.saving
  ) {

    pill.textContent =
      "⚠️ Perlu diperbaiki";

    pill.style.background =
      "#FCE4EC";

  }


  else if (
    state.saving >= state.need
  ) {

    pill.textContent =
      "🌱 Sehat";

    pill.style.background =
      "#d9fff4";

  }


  else {

    pill.textContent =
      "⚖️ Seimbang";

    pill.style.background =
      "#FFF9C4";

  }

}



/* =========================
   MOLECULE
========================= */

function renderMolecule() {

  const el =
    document.getElementById(
      "molecule"
    );


  const items = [];



  for (
    let i = 0;
    i < state.need;
    i++
  ) {

    items.push(
      "🥗 Kebutuhan"
    );

  }



  for (
    let i = 0;
    i < state.saving;
    i++
  ) {

    items.push(
      "🪙 Tabungan"
    );

  }



  for (
    let i = 0;
    i < state.want;
    i++
  ) {

    items.push(
      "🧸 Keinginan"
    );

  }



  if (items.length) {

    el.innerHTML =
      items
        .map(
          x =>
            `<span class="molecule-token">${x}</span>`
        )
        .join("");

  }


  else {

    el.innerHTML = `
      <div class="empty-molecule">
        Belum ada atom.
        Pilih atau tarik atom ke arena.
      </div>
    `;

  }

}



/* =========================
   BADGES
========================= */

function renderBadges() {

  const gallery =
    document.getElementById(
      "badgeGallery"
    );


  let unlocked = 0;


  gallery.innerHTML =
    badges
      .map(b => {

        const yes =
          b.unlock(state);


        if (yes)
          unlocked++;


        return `
          <div
            class="badge ${yes ? "unlocked" : ""}"
            title="${b.hint}"
          >

            <span class="locked-label">
              ${yes ? "UNLOCKED" : "LOCKED"}
            </span>

            <div class="badge-icon">
              ${b.icon}
            </div>

            <strong>
              ${b.name}
            </strong>

            <small>
              ${
                yes
                  ? "Hebat! Lencana terbuka."
                  : b.hint
              }
            </small>

          </div>
        `;

      })
      .join("");


  document.getElementById(
    "badgeProgress"
  ).textContent =
    `${unlocked}/${badges.length} terbuka`;

}



/* =========================
   PESAN ATO
========================= */

function updateAtoMessage() {

  const el =
    document.getElementById(
      "atoMessage"
    );


  if (total(state) === 0) {

    el.textContent =
      "Halo! Yuk susun atom keuanganmu. Sedikit demi sedikit bisa menjadi kebiasaan besar.";

  }


  else if (
    state.want > state.need ||
    state.want > state.saving
  ) {

    el.textContent =
      "Ups! Keinginanmu sedang terlalu dominan. Coba tambahkan Kebutuhan atau Tabungan.";

  }


  else if (
    state.saving >= state.need
  ) {

    el.textContent =
      "Mantap! Molekulmu punya ruang untuk masa depan. Konsistensi adalah kuncinya.";

  }


  else {

    el.textContent =
      "Lumayan! Coba tambahkan Tabungan agar molekulmu lebih kuat.";

  }

}



/* =========================
   FEEDBACK
========================= */

function showFeedback(
  text,
  cls = ""
) {

  const el =
    document.getElementById(
      "feedback"
    );


  el.textContent = text;

  el.className =
    `feedback ${cls}`;

}



/* =========================
   RACIK & CEK
========================= */

function check() {

  if (total(state) === 0) {

    showFeedback(
      "Masukkan beberapa atom dulu, ya!",
      "warn"
    );

    return;
  }


  state.checked = true;


  const arena =
    document.querySelector(
      ".blueprint"
    );


  arena.classList.remove(
    "shake"
  );


  void arena.offsetWidth;



  if (
    state.want > state.need ||
    state.want > state.saving
  ) {

    arena.classList.add(
      "shake"
    );


    showFeedback(
      "⚠️ Molekul belum sehat: Keinginan terlalu dominan. Coba seimbangkan dengan Kebutuhan dan Tabungan.",
      "bad"
    );

  }


  else if (
    state.saving >= state.need
  ) {

    showFeedback(
      "🌳 Molekul sehat! Tabunganmu cukup kuat untuk membantu tujuan masa depan.",
      "good"
    );

  }


  else {

    showFeedback(
      "🌱 Sudah bagus. Tambahkan sedikit Tabungan agar kebiasaanmu makin kuat.",
      "warn"
    );

  }


  render();

}



/* =========================
   GRAFIK
========================= */

function drawChart(values) {

  const canvas =
    document.getElementById(
      "growthChart"
    );


  const rect =
    canvas.getBoundingClientRect();


  const dpr =
    window.devicePixelRatio || 1;


  canvas.width =
    Math.max(
      1,
      rect.width * dpr
    );


  canvas.height =
    Math.max(
      1,
      rect.height * dpr
    );


  const ctx =
    canvas.getContext("2d");


  ctx.scale(dpr, dpr);


  const w = rect.width;

  const h = rect.height;


  ctx.clearRect(
    0,
    0,
    w,
    h
  );



  const max =
    Math.max(
      ...values,
      1
    );


  const min =
    Math.min(
      ...values,
      0
    );


  const range =
    Math.max(
      max - min,
      1
    );


  const pad = {

    l: 42,

    r: 18,

    t: 20,

    b: 35

  };


  const cw =
    w -
    pad.l -
    pad.r;


  const ch =
    h -
    pad.t -
    pad.b;



  /* GRID */

  ctx.font =
    "11px system-ui";


  ctx.fillStyle =
    "#74848d";


  for (
    let i = 0;
    i < 4;
    i++
  ) {

    const y =
      pad.t +
      (ch * i / 3);


    ctx.strokeStyle =
      "#e8eff1";


    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.moveTo(
      pad.l,
      y
    );

    ctx.lineTo(
      w - pad.r,
      y
    );

    ctx.stroke();



    const val =
      max -
      (range * i / 3);


    ctx.fillText(
      money(val),
      5,
      y + 4
    );

  }



  const x =
    i =>
      pad.l +
      (cw * i / 11);


  const y =
    v =>
      pad.t +
      ch -
      ((v - min) /
      range * ch);



  ctx.strokeStyle =
    "#dfe9eb";


  ctx.beginPath();

  ctx.moveTo(
    pad.l,
    pad.t + ch
  );

  ctx.lineTo(
    w - pad.r,
    pad.t + ch
  );

  ctx.stroke();



  /* STATUS */

  const healthy =
    state.want <= state.need &&
    state.want <= state.saving;



  /* CURVE */

  ctx.beginPath();


  values.forEach(
    (v, i) => {

      if (i) {

        ctx.lineTo(
          x(i),
          y(v)
        );

      }

      else {

        ctx.moveTo(
          x(i),
          y(v)
        );

      }

    }
  );


  ctx.lineWidth = 4;


  ctx.strokeStyle =
    healthy
      ? "#00B894"
      : "#e35d6a";


  ctx.lineJoin =
    "round";


  ctx.lineCap =
    "round";


  ctx.stroke();



  /* BULAN */

  ctx.font =
    "11px system-ui";


  ctx.fillStyle =
    "#74848d";


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    ctx.fillText(
      `B${i + 1}`,
      x(i) - 8,
      h - 10
    );

  }



  /* DOT */

  values.forEach(
    (v, i) => {

      ctx.fillStyle =
        healthy
          ? "#00B894"
          : "#e35d6a";


      ctx.beginPath();


      ctx.arc(
        x(i),
        y(v),
        i === 11 ? 5 : 2.5,
        0,
        Math.PI * 2
      );


      ctx.fill();

    }
  );

}



/* =========================
   MODAL
========================= */

function openModal() {

  const modal =
    document.getElementById(
      "modal"
    );


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );

}



function closeModal() {

  const modal =
    document.getElementById(
      "modal"
    );


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}



/* =========================
   DRAG & DROP
========================= */

document
  .querySelectorAll(".atom")
  .forEach(atom => {


    atom.addEventListener(
      "dragstart",
      e => {

        e.dataTransfer.setData(
          "text/plain",
          atom.dataset.type
        );


        e.dataTransfer.effectAllowed =
          "copy";

      }
    );



    /* Klik untuk HP */

    atom.addEventListener(
      "click",
      () => {

        addAtom(
          atom.dataset.type
        );

      }
    );



    /* Keyboard */

    atom.addEventListener(
      "keydown",
      e => {

        if (
          e.key === "Enter" ||
          e.key === " "
        ) {

          e.preventDefault();


          addAtom(
            atom.dataset.type
          );

        }

      }
    );

  });



/* =========================
   DROPZONE
========================= */

document
  .querySelectorAll(".dropzone")
  .forEach(zone => {


    zone.addEventListener(
      "dragover",
      e => {

        e.preventDefault();

        zone.classList.add(
          "dragover"
        );

      }
    );


    zone.addEventListener(
      "dragleave",
      () => {

        zone.classList.remove(
          "dragover"
        );

      }
    );


    zone.addEventListener(
      "drop",
      e => {

        e.preventDefault();


        zone.classList.remove(
          "dragover"
        );


        const type =
          e.dataTransfer
            .getData(
              "text/plain"
            );


        if (type)
          addAtom(type);

      }
    );

  });



/* =========================
   EVENT BUTTON
========================= */

document
  .getElementById("checkBtn")
  .addEventListener(
    "click",
    check
  );


document
  .getElementById("resetBtn")
  .addEventListener(
    "click",
    reset
  );


document
  .getElementById("helpBtn")
  .addEventListener(
    "click",
    openModal
  );


document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    closeModal
  );


document
  .querySelector(".modal-backdrop")
  .addEventListener(
    "click",
    closeModal
  );


/* =========================
   TIPS RANDOM
========================= */

document
  .getElementById("randomTipBtn")
  .addEventListener(
    "click",
    () => {

      const tip =
        tips[
          Math.floor(
            Math.random() *
            tips.length
          )
        ];


      document
        .getElementById(
          "atoMessage"
        )
        .textContent = tip;

    }
  );



/* =========================
   RESPONSIVE CHART
========================= */

window.addEventListener(
  "resize",
  () => {

    drawChart(
      project()
    );

  }
);



/* =========================
   START
========================= */

render();
