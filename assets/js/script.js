let unlocked = parseInt(localStorage.getItem('diff_unlocked')) || 1;
let currentLvl, lives, score, hints;

function init() {
    const gal = document.getElementById('level-gallery');
    gal.innerHTML = levelData.map(l => `
        <div class="level-card ${l.id > unlocked ? 'locked' : ''} ${l.id < unlocked ? 'completed' : ''}" 
             onclick="${l.id <= unlocked ? `start(${l.id})` : ''}">${l.id > unlocked ? '🔒' : l.id}</div>
    `).join('');
}

function start(id) {
    currentLvl = levelData.find(l => l.id === id);
    lives = 3; score = 0; hints = 3;
    document.getElementById('img-a').src = currentLvl.imgA;
    document.getElementById('img-b').src = currentLvl.imgB;
    document.getElementById('lvl-title').innerText = currentLvl.title;
    
    const container = document.getElementById('hotspots');
    container.innerHTML = '';
    currentLvl.diffs.forEach((d, i) => {
        const h = document.createElement('div');
        h.className = 'hotspot';
        h.style.left = d.x + '%'; h.style.top = d.y + '%';
        h.onclick = (e) => { e.stopPropagation(); if(!h.classList.contains('found')) { h.classList.add('found'); score++; updateUI(); checkWin(); }};
        container.appendChild(h);
    });
    
    updateUI();
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function wrongClick(e) {
    lives--;
    document.getElementById('click-zone').classList.add('shake');
    setTimeout(() => document.getElementById('click-zone').classList.remove('shake'), 300);
    updateUI();
    if(lives <= 0) { alert("Game Over!"); showHome(); }
}

function useHint() {
    if(hints > 0) {
        const remaining = Array.from(document.querySelectorAll('.hotspot:not(.found):not(.hint-glow)'));
        if(remaining.length) {
            const h = remaining[Math.floor(Math.random() * remaining.length)];
            h.classList.add('hint-glow');
            hints--; updateUI();
            setTimeout(() => h.classList.remove('hint-glow'), 3000);
        }
    }
}

function checkWin() {
    if(score === 5) {
        if(currentLvl.id === unlocked && unlocked < 100) { unlocked++; localStorage.setItem('diff_unlocked', unlocked); }
        setTimeout(() => { alert("Menang!"); showHome(); init(); }, 500);
    }
}

function updateUI() {
    document.getElementById('life-val').innerText = lives;
    document.getElementById('score-val').innerText = score;
    document.getElementById('hint-val').innerText = hints;
    document.getElementById('hint-btn').disabled = hints <= 0;
}

function showHome() { 
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}

function resetProgress() { if(confirm("Reset?")) { localStorage.clear(); location.reload(); }}

init();
