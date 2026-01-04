const levels = {
    1: { img: 'taman.jpg', diffs: [{t:50, l:100}, {t:200, l:300}, {t:120, l:450}] },
    2: { img: 'dapur.jpg', diffs: [{t:80, l:150}, {t:250, l:50}, {t:300, l:400}] }
};

let currentLives = 3;
let currentScore = 0;

function showHome() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}

function startLevel(lvlId) {
    const level = levels[lvlId];
    if(!level) return alert("Level belum tersedia!");

    // Reset Data
    currentLives = 3;
    currentScore = 0;
    updateUI();

    // Set Gambar
    document.getElementById('img-original').src = level.img;
    document.getElementById('img-modified').src = level.img; // Biasanya file berbeda

    // Set Hotspots
    const box = document.getElementById('img-diff-box');
    // Hapus hotspot lama
    document.querySelectorAll('.hotspot').forEach(h => h.remove());
    
    level.diffs.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'hotspot';
        div.style.top = pos.t + 'px';
        div.style.left = pos.l + 'px';
        div.onclick = (e) => {
            e.stopPropagation(); // Mencegah trigger "klik salah"
            foundDifference(div);
        };
        box.appendChild(div);
    });

    // Deteksi Klik Salah di area gambar
    box.onclick = function() {
        loseLife();
    };

    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function foundDifference(el) {
    if (!el.classList.contains('found')) {
        el.classList.add('found');
        currentScore++;
        updateUI();
        if (currentScore === 3) {
            setTimeout(() => { alert("Luar Biasa! Level Selesai."); showHome(); }, 300);
        }
    }
}

function loseLife() {
    currentLives--;
    updateUI();
    // Efek visual layar bergetar atau merah bisa ditambah di sini
    if (currentLives <= 0) {
        alert("Game Over! Kamu kehabisan nyawa.");
        showHome();
    }
}

function updateUI() {
    document.getElementById('lives').innerText = currentLives;
    document.getElementById('score').innerText = currentScore;
}
