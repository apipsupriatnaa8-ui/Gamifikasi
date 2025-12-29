<?php
session_start();
if (!isset($_SESSION["name"])) $_SESSION["name"] = "";
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Game Literasi Ceria (Kelas 1–3)</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="bg-orb orb1"></div>
  <div class="bg-orb orb2"></div>
  <div class="bg-orb orb3"></div>

  <header class="topbar">
    <div class="brand">
      <div class="logo">🌈</div>
      <div>
        <h1>Game Literasi Ceria</h1>
        <p>Kelas 1–3 • Membaca • Menulis • Menyimak • Berbicara</p>
      </div>
    </div>

    <div class="userbox">
      <input id="studentName" class="input" placeholder="Nama siswa..." value="<?php echo htmlspecialchars($_SESSION["name"]); ?>" />
      <button class="btn glow" id="btnSaveName">Simpan</button>
    </div>
  </header>

  <main class="wrap">
    <section class="cards">
      <button class="card" data-screen="screen-home">
        <div class="cardIcon">🏠</div>
        <div class="cardTitle">Beranda</div>
        <div class="cardDesc">Pilih permainan dan lihat misi hari ini.</div>
      </button>

      <button class="card" data-screen="screen-read">
        <div class="cardIcon">📖</div>
        <div class="cardTitle">Membaca</div>
        <div class="cardDesc">Baca kata/kalimat, cocokkan gambar, dan dengar suaranya.</div>
      </button>

      <button class="card" data-screen="screen-write">
        <div class="cardIcon">✍️</div>
        <div class="cardTitle">Menulis</div>
        <div class="cardDesc">Ketik kata yang benar dari petunjuk. Ada bintang bonus!</div>
      </button>

      <button class="card" data-screen="screen-listen">
        <div class="cardIcon">🎧</div>
        <div class="cardTitle">Menyimak</div>
        <div class="cardDesc">Dengar suara, lalu pilih jawaban yang tepat.</div>
      </button>

      <button class="card" data-screen="screen-speak">
        <div class="cardIcon">🗣️</div>
        <div class="cardTitle">Berbicara</div>
        <div class="cardDesc">Ucapkan kata/kalimat. Sistem menilai kemiripan.</div>
      </button>

      <button class="card" data-screen="screen-score">
        <div class="cardIcon">🏆</div>
        <div class="cardTitle">Skor</div>
        <div class="cardDesc">Lihat poin, lencana, dan simpan progres.</div>
      </button>
    </section>

    <!-- SCREEN AREA -->
    <section class="panel">
      <!-- HOME -->
      <div class="screen active" id="screen-home">
        <div class="panelHead">
          <h2>✨ Misi Hari Ini</h2>
          <div class="pill">Target: 4 permainan</div>
        </div>

        <div class="homeGrid">
          <div class="hero">
            <div class="heroTxt">
              <h3>Belajar itu seru!</h3>
              <p>
                Ayo kumpulkan <b>poin</b> dan <b>lencana</b>. Klik salah satu permainan di atas.
                Kamu juga bisa menekan tombol 🔊 untuk mendengar.
              </p>
              <div class="row">
                <button class="btn" id="btnDailyTip">🎲 Tips Acak</button>
                <button class="btn outline" id="btnConfetti">🎉 Rayakan</button>
              </div>
              <div class="tip" id="tipBox">Tip: Ucapkan dengan jelas saat permainan Berbicara.</div>
            </div>
            <div class="heroMascot" aria-hidden="true">
              <div class="mascot">
                <div class="face">😊</div>
                <div class="spark s1"></div>
                <div class="spark s2"></div>
                <div class="spark s3"></div>
              </div>
            </div>
          </div>

          <div class="stats">
            <div class="statCard">
              <div class="statNum" id="statPoints">0</div>
              <div class="statLbl">Poin</div>
            </div>
            <div class="statCard">
              <div class="statNum" id="statStreak">0</div>
              <div class="statLbl">Streak</div>
            </div>
            <div class="statCard">
              <div class="statNum" id="statBadges">0</div>
              <div class="statLbl">Lencana</div>
            </div>
          </div>
        </div>
      </div>

      <!-- READ -->
      <div class="screen" id="screen-read">
        <div class="panelHead">
          <h2>📖 Membaca: Cocokkan Kata</h2>
          <div class="pill">Level: Mudah</div>
        </div>

        <div class="gameBox">
          <div class="prompt">
            <div class="bigWord" id="readWord">BOLA</div>
            <button class="btn icon" id="btnReadSpeak" title="Dengarkan">🔊</button>
          </div>

          <div class="choices" id="readChoices"></div>

          <div class="gameFooter">
            <div class="msg" id="readMsg">Klik gambar yang cocok dengan kata.</div>
            <div class="row">
              <button class="btn outline" id="btnReadNext">Soal Berikutnya ➜</button>
            </div>
          </div>
        </div>
      </div>

      <!-- WRITE -->
      <div class="screen" id="screen-write">
        <div class="panelHead">
          <h2>✍️ Menulis: Ketik Kata</h2>
          <div class="pill">Bonus ⭐ jika benar cepat</div>
        </div>

        <div class="gameBox">
          <div class="prompt">
            <div class="hint" id="writeHint">Petunjuk: benda bulat untuk bermain</div>
            <button class="btn icon" id="btnWriteSpeak" title="Dengarkan petunjuk">🔊</button>
          </div>

          <div class="writeRow">
            <input class="input bigInput" id="writeInput" placeholder="Ketik jawaban..." autocomplete="off" />
            <button class="btn glow" id="btnWriteCheck">Cek</button>
          </div>

          <div class="gameFooter">
            <div class="msg" id="writeMsg">Tulis dengan huruf besar/kecil bebas.</div>
            <div class="row">
              <button class="btn outline" id="btnWriteNext">Soal Berikutnya ➜</button>
            </div>
          </div>
        </div>
      </div>

      <!-- LISTEN -->
      <div class="screen" id="screen-listen">
        <div class="panelHead">
          <h2>🎧 Menyimak: Dengarkan & Pilih</h2>
          <div class="pill">Tekan 🔊 lalu pilih</div>
        </div>

        <div class="gameBox">
          <div class="prompt">
            <div class="hint" id="listenHint">Dengarkan kata yang dibacakan.</div>
            <button class="btn icon glow" id="btnListenPlay">🔊 Putar</button>
          </div>

          <div class="choices" id="listenChoices"></div>

          <div class="gameFooter">
            <div class="msg" id="listenMsg">Pilih kata yang kamu dengar.</div>
            <div class="row">
              <button class="btn outline" id="btnListenNext">Soal Berikutnya ➜</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SPEAK -->
      <div class="screen" id="screen-speak">
        <div class="panelHead">
          <h2>🗣️ Berbicara: Ucapkan Kata</h2>
          <div class="pill">Butuh mikrofon</div>
        </div>

        <div class="gameBox">
          <div class="prompt">
            <div class="bigWord" id="speakTarget">SAYA SUKA BUKU</div>
            <button class="btn icon" id="btnSpeakTTS" title="Dengar contoh">🔊</button>
          </div>

          <div class="speakRow">
            <button class="btn glow" id="btnSpeakStart">🎙️ Mulai Rekam</button>
            <button class="btn outline" id="btnSpeakStop">⏹️ Stop</button>
          </div>

          <div class="resultBox">
            <div class="label">Hasil ucapan kamu:</div>
            <div class="transcript" id="speakTranscript">—</div>
            <div class="scoreLine">
              <div class="label">Kemiripan:</div>
              <div class="meter"><div class="meterFill" id="speakMeter"></div></div>
              <div class="pct" id="speakPct">0%</div>
            </div>
          </div>

          <div class="gameFooter">
            <div class="msg" id="speakMsg">Tips: ucapkan pelan dan jelas.</div>
            <div class="row">
              <button class="btn outline" id="btnSpeakNext">Kalimat Berikutnya ➜</button>
            </div>
          </div>
        </div>

        <div class="note">
          <b>Catatan:</b> Fitur ini memakai Web Speech API. Jika tidak tersedia, gunakan Chrome Android terbaru.
        </div>
      </div>

      <!-- SCORE -->
      <div class="screen" id="screen-score">
        <div class="panelHead">
          <h2>🏆 Skor & Lencana</h2>
          <div class="pill">Simpan progres</div>
        </div>

        <div class="scoreGrid">
          <div class="scoreCard">
            <h3>Total Poin</h3>
            <div class="bigScore" id="scorePoints">0</div>
            <div class="row">
              <button class="btn glow" id="btnSaveScore">💾 Simpan ke Server (PHP)</button>
              <button class="btn outline" id="btnReset">🔄 Reset Lokal</button>
            </div>
            <div class="msg" id="saveMsg">—</div>
          </div>

          <div class="scoreCard">
            <h3>Lencana</h3>
            <div class="badges" id="badgeBox"></div>
          </div>

          <div class="scoreCard">
            <h3>Riwayat (Server)</h3>
            <div class="small" id="serverHistory">Klik “Simpan” untuk menambah data.</div>
          </div>
        </div>
      </div>

    </section>
  </main>

  <canvas id="confetti" aria-hidden="true"></canvas>

  <script src="app.js"></script>
</body>
</html>
