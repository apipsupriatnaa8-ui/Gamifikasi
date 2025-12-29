// ====== UTIL & STATE ======
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

const state = {
  name: "",
  points: 0,
  streak: 0,
  badges: [],
  lastPlayAt: 0,
};

function loadLocal(){
  try{
    const raw = localStorage.getItem("literasi_state");
    if(raw){
      const obj = JSON.parse(raw);
      Object.assign(state, obj);
    }
  }catch(e){}
}
function saveLocal(){
  localStorage.setItem("literasi_state", JSON.stringify(state));
}
function addPoints(n){
  state.points += n;
  state.streak += 1;
  awardBadges();
  updateUI();
  saveLocal();
}
function resetLocal(){
  state.points = 0;
  state.streak = 0;
  state.badges = [];
  updateUI();
  saveLocal();
}

function norm(s){
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9áéíóúàèìòùâêîôûäëïöüçñ\s]/gi, "");
}

// similarity sederhana (untuk kelas bawah: cukup toleran)
function similarity(a, b){
  a = norm(a); b = norm(b);
  if(!a && !b) return 1;
  if(!a || !b) return 0;

  // token overlap
  const A = new Set(a.split(" "));
  const B = new Set(b.split(" "));
  let inter = 0;
  for(const t of A) if(B.has(t)) inter++;
  const union = A.size + B.size - inter;
  const j = union ? inter/union : 0;

  // char overlap (ringan)
  const ac = a.replace(/\s/g,"");
  const bc = b.replace(/\s/g,"");
  let same = 0;
  const m = Math.min(ac.length, bc.length);
  for(let i=0;i<m;i++) if(ac[i]===bc[i]) same++;
  const c = m ? same/m : 0;

  return Math.max(0, Math.min(1, 0.55*j + 0.45*c));
}

// ====== TEXT TO SPEECH (TTS) ======
function speakText(text){
  if(!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  u.rate = 0.95;
  u.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ====== NAVIGATION ======
function showScreen(id){
  $$(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
}

$$(".card").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    showScreen(btn.dataset.screen);
  });
});

// ====== TIPS ======
const tips = [
  "Kalau salah tidak apa-apa, coba lagi ya!",
  "Baca pelan-pelan, lalu pilih gambar yang tepat.",
  "Menulis rapi: mulai dari huruf pertama yang benar.",
  "Menyimak: fokus pada bunyi awal kata.",
  "Berbicara: ucapkan jelas dan dekatkan mic.",
];
$("#btnDailyTip").addEventListener("click", ()=>{
  const t = tips[Math.floor(Math.random()*tips.length)];
  $("#tipBox").textContent = "Tip: " + t;
});

// ====== CONFETTI ======
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let confetti = [];
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnConfetti(){
  confetti = [];
  const n = 140;
  for(let i=0;i<n;i++){
    confetti.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height*0.3,
      r: 3 + Math.random()*5,
      vx: -1.2 + Math.random()*2.4,
      vy: 2.2 + Math.random()*3.8,
      rot: Math.random()*Math.PI,
      vr: -0.12 + Math.random()*0.24,
      a: 1
    });
  }
  animateConfetti();
}
let confettiRAF = null;
function animateConfetti(){
  cancelAnimationFrame(confettiRAF);
  const t0 = performance.now();
  const dur = 1200;

  const loop = (t)=>{
    const k = Math.min(1, (t - t0)/dur);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.a = 1 - k;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      // warna gradasi random via HSL
      const hue = (p.x / canvas.width) * 360;
      ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
      ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);

      ctx.restore();
    });

    if(k < 1) confettiRAF = requestAnimationFrame(loop);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  };
  confettiRAF = requestAnimationFrame(loop);
}
$("#btnConfetti").addEventListener("click", spawnConfetti);

// ====== GAME CONTENT (KELAS 1–3) ======
const readBank = [
  {word:"BOLA", emoji:"⚽", label:"BOLA", wrong:[{emoji:"🍌",label:"PISANG"},{emoji:"🐱",label:"KUCING"}]},
  {word:"BUKU", emoji:"📘", label:"BUKU", wrong:[{emoji:"🚗",label:"MOBIL"},{emoji:"🍚",label:"NASI"}]},
  {word:"KUCING", emoji:"🐱", label:"KUCING", wrong:[{emoji:"🐟",label:"IKAN"},{emoji:"🧸",label:"BONEKA"}]},
  {word:"MATA", emoji:"👀", label:"MATA", wrong:[{emoji:"👂",label:"TELINGA"},{emoji:"👃",label:"HIDUNG"}]},
  {word:"RUMAH", emoji:"🏠", label:"RUMAH", wrong:[{emoji:"🏫",label:"SEKOLAH"},{emoji:"🌳",label:"POHON"}]},
];

const writeBank = [
  {hint:"benda bulat untuk bermain", answer:"bola"},
  {hint:"tempat kita belajar", answer:"sekolah"},
  {hint:"hewan yang suka mengeong", answer:"kucing"},
  {hint:"alat untuk membaca cerita", answer:"buku"},
  {hint:"bagian tubuh untuk melihat", answer:"mata"},
];

const listenBank = [
  {target:"pisang", options:["pisang","piring","pintu"]},
  {target:"roti", options:["roda","roti","rumah"]},
  {target:"bunga", options:["bunda","bunga","buku"]},
  {target:"susu", options:["susu","siku","sapu"]},
  {target:"mobil", options:["mobil","moral","monyet"]},
];

const speakBank = [
  "SAYA SUKA BUKU",
  "INI BOLA SAYA",
  "AYO KITA BELAJAR",
  "SELAMAT PAGI GURU",
  "SAYA BISA MEMBACA",
];

// ====== GAME: READ ======
let readIdx = 0;
function renderRead(){
  const q = readBank[readIdx % readBank.length];
  $("#readWord").textContent = q.word;
  const choices = [
    {emoji:q.emoji, label:q.label, ok:true},
    ...q.wrong.map(w=>({emoji:w.emoji,label:w.label, ok:false}))
  ].sort(()=>Math.random()-0.5);

  const box = $("#readChoices");
  box.innerHTML = "";
  choices.forEach(c=>{
    const b = document.createElement("button");
    b.className = "choice";
    b.innerHTML = `<div class="emoji">${c.emoji}</div><div class="label">${c.label}</div>`;
    b.addEventListener("click", ()=>{
      if(c.ok){
        $("#readMsg").textContent = "✅ Hebat! Kamu benar!";
        addPoints(10);
        spawnConfetti();
      }else{
        $("#readMsg").textContent = "❌ Belum tepat. Coba lagi ya.";
        state.streak = 0; updateUI(); saveLocal();
      }
    });
    box.appendChild(b);
  });
}
$("#btnReadSpeak").addEventListener("click", ()=> speakText($("#readWord").textContent));
$("#btnReadNext").addEventListener("click", ()=>{
  readIdx++;
  $("#readMsg").textContent = "Klik gambar yang cocok dengan kata.";
  renderRead();
});

// ====== GAME: WRITE ======
let writeIdx = 0;
let writeStart = performance.now();
function renderWrite(){
  const q = writeBank[writeIdx % writeBank.length];
  $("#writeHint").textContent = "Petunjuk: " + q.hint;
  $("#writeInput").value = "";
  $("#writeMsg").textContent = "Tulis dengan huruf besar/kecil bebas.";
  writeStart = performance.now();
}
$("#btnWriteSpeak").addEventListener("click", ()=> speakText($("#writeHint").textContent.replace("Petunjuk:","").trim()));
$("#btnWriteCheck").addEventListener("click", ()=>{
  const q = writeBank[writeIdx % writeBank.length];
  const ans = norm($("#writeInput").value);
  const target = norm(q.answer);
  if(ans === target){
    const dt = (performance.now()-writeStart)/1000;
    const bonus = dt <= 6 ? 5 : 0;
    $("#writeMsg").textContent = `✅ Benar! +10 poin${bonus?` +${bonus} bonus ⭐`:``}`;
    addPoints(10 + bonus);
    if(bonus) spawnConfetti();
  }else{
    $("#writeMsg").textContent = "❌ Belum tepat. Coba cek ejaan ya.";
    state.streak = 0; updateUI(); saveLocal();
  }
});
$("#btnWriteNext").addEventListener("click", ()=>{
  writeIdx++;
  renderWrite();
});

// ====== GAME: LISTEN ======
let listenIdx = 0;
let currentListenTarget = "";
function renderListen(){
  const q = listenBank[listenIdx % listenBank.length];
  currentListenTarget = q.target;
  $("#listenMsg").textContent = "Pilih kata yang kamu dengar.";
  const box = $("#listenChoices");
  box.innerHTML = "";
  q.options.sort(()=>Math.random()-0.5).forEach(opt=>{
    const b = document.createElement("button");
    b.className = "choice";
    b.innerHTML = `<div class="emoji">🟣</div><div class="label">${opt.toUpperCase()}</div>`;
    b.addEventListener("click", ()=>{
      if(norm(opt) === norm(currentListenTarget)){
        $("#listenMsg").textContent = "✅ Mantap! Kamu menyimak dengan baik!";
        addPoints(10);
        spawnConfetti();
      }else{
        $("#listenMsg").textContent = "❌ Belum tepat. Putar lagi dan coba.";
        state.streak = 0; updateUI(); saveLocal();
      }
    });
    box.appendChild(b);
  });
}
$("#btnListenPlay").addEventListener("click", ()=>{
  speakText(currentListenTarget);
});
$("#btnListenNext").addEventListener("click", ()=>{
  listenIdx++;
  renderListen();
});

// ====== GAME: SPEAK (Speech Recognition) ======
let speakIdx = 0;
let recognition = null;
let recognizing = false;

function setupRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return null;
  const r = new SR();
  r.lang = "id-ID";
  r.interimResults = true;
  r.maxAlternatives = 1;
  return r;
}

function renderSpeak(){
  const target = speakBank[speakIdx % speakBank.length];
  $("#speakTarget").textContent = target;
  $("#speakTranscript").textContent = "—";
  $("#speakMeter").style.width = "0%";
  $("#speakPct").textContent = "0%";
  $("#speakMsg").textContent = "Tips: ucapkan pelan dan jelas.";
}
$("#btnSpeakTTS").addEventListener("click", ()=> speakText($("#speakTarget").textContent));

$("#btnSpeakStart").addEventListener("click", ()=>{
  if(recognizing) return;
  recognition = setupRecognition();
  if(!recognition){
    $("#speakMsg").textContent = "❗ Maaf, fitur berbicara tidak didukung di browser ini. Coba Chrome Android.";
    return;
  }
  recognizing = true;
  $("#speakMsg").textContent = "🎙️ Mendengarkan... ucapkan sekarang!";
  let finalText = "";

  recognition.onresult = (e)=>{
    let interim = "";
    for(let i=e.resultIndex; i<e.results.length; i++){
      const txt = e.results[i][0].transcript;
      if(e.results[i].isFinal) finalText += txt + " ";
      else interim += txt;
    }
    const shown = (finalText + interim).trim();
    $("#speakTranscript").textContent = shown || "—";

    const target = $("#speakTarget").textContent;
    const sim = similarity(shown, target);
    const pct = Math.round(sim * 100);
    $("#speakMeter").style.width = pct + "%";
    $("#speakPct").textContent = pct + "%";
  };

  recognition.onerror = ()=>{
    recognizing = false;
    $("#speakMsg").textContent = "❗ Terjadi error mic/izin. Pastikan izin mikrofon aktif.";
  };

  recognition.onend = ()=>{
    recognizing = false;
    const spoken = $("#speakTranscript").textContent;
    const target = $("#speakTarget").textContent;
    const sim = similarity(spoken, target);
    const pct = Math.round(sim * 100);

    if(pct >= 70){
      $("#speakMsg").textContent = `✅ Bagus! Kemiripan ${pct}%. +10 poin`;
      addPoints(10);
      spawnConfetti();
    }else{
      $("#speakMsg").textContent = `🔁 Coba lagi ya. Kemiripan ${pct}%. Dengar contoh dulu kalau perlu.`;
      state.streak = 0; updateUI(); saveLocal();
    }
  };

  recognition.start();
});

$("#btnSpeakStop").addEventListener("click", ()=>{
  if(recognition && recognizing){
    recognition.stop();
  }
});

$("#btnSpeakNext").addEventListener("click", ()=>{
  speakIdx++;
  renderSpeak();
});

// ====== BADGES ======
function awardBadges(){
  const b = new Set(state.badges);
  if(state.points >= 20) b.add("⭐ Pemula Hebat");
  if(state.points >= 60) b.add("🌟 Jago Literasi");
  if(state.points >= 120) b.add("🏅 Juara Kelas");
  if(state.streak >= 5) b.add("🔥 Streak 5");
  state.badges = [...b];
}
function renderBadges(){
  const box = $("#badgeBox");
  box.innerHTML = "";
  if(!state.badges.length){
    box.innerHTML = `<div class="small">Belum ada lencana. Main dulu ya 🙂</div>`;
    return;
  }
  state.badges.forEach(x=>{
    const d = document.createElement("div");
    d.className = "badge";
    d.textContent = x;
    box.appendChild(d);
  });
}

// ====== UI UPDATE ======
function updateUI(){
  $("#statPoints").textContent = state.points;
  $("#statStreak").textContent = state.streak;
  $("#statBadges").textContent = state.badges.length;
  $("#scorePoints").textContent = state.points;
  renderBadges();
}
$("#btnReset").addEventListener("click", ()=>{
  resetLocal();
  $("#saveMsg").textContent = "Progres lokal di-reset.";
});

// ====== SAVE NAME (simple) ======
$("#btnSaveName").addEventListener("click", ()=>{
  const n = ($("#studentName").value || "").trim();
  state.name = n;
  saveLocal();
  // simpan juga ke session PHP (via fetch kecil)
  fetch("save_score.php", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({type:"name", name:n})
  }).catch(()=>{});
});

// ====== SAVE SCORE TO PHP ======
$("#btnSaveScore").addEventListener("click", async ()=>{
  const payload = {
    type: "score",
    name: (state.name || $("#studentName").value || "Siswa").trim(),
    points: state.points,
    badges: state.badges,
    streak: state.streak,
    at: new Date().toISOString()
  };

  $("#saveMsg").textContent = "Menyimpan...";
  try{
    const r = await fetch("save_score.php", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if(j.ok){
      $("#saveMsg").textContent = "✅ Tersimpan! " + (j.message || "");
      $("#serverHistory").innerHTML = j.preview_html || "—";
      spawnConfetti();
    }else{
      $("#saveMsg").textContent = "❌ Gagal: " + (j.error || "unknown");
    }
  }catch(e){
    $("#saveMsg").textContent = "❌ Gagal terhubung ke server. Jalankan lewat server PHP ya.";
  }
});

// ====== INIT ======
loadLocal();
updateUI();
renderRead();
renderWrite();
renderListen();
renderSpeak();

// default: klik beranda dulu biar jelas
showScreen("screen-home");
