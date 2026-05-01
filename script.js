let currentDay = 0;
let gX = 250, gY = 0, vY = 0, score = 0, hearts = 100;
let keys = {}, active = false, isJump = false;
let isPlacing = false, gameActive = false;

window.onload = () => {
    let i = 0; const txt = "Hi Beautiful! Welcome back.|I've made some games for you.|Pick a day and enjoy! ❤️";
    const t = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; if(i >= txt.length) { clearInterval(t); document.getElementById('level-select').classList.remove('hidden'); }
    }, 40);
};

function startLevel(day) {
    currentDay = day;
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    if(day === 1) setupDay1();
    else setupDay2();
}

function setupDay1() {
    active = true; score = 0;
    document.getElementById('score-val').innerText = "0/5";
    const hl = document.getElementById('hearts-layer');
    const ol = document.getElementById('obstacles-layer');
    hl.innerHTML = ""; ol.innerHTML = "";
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = "❤️"; h.className = "sprite"; h.style.left = (1200 + (i * 900)) + "px"; h.style.bottom = "45%"; h.style.fontSize = "40px";
        hl.appendChild(h);
        const log = document.createElement('div');
        log.className = "prop"; log.style.width="70px"; log.style.height="40px"; log.style.background="#6d4c41"; log.style.border="3px solid #222"; log.style.borderRadius="10px";
        log.style.left = (1200 + (i * 900) - 400) + "px";
        ol.appendChild(log);
    }
    requestAnimationFrame(loop);
}

function setupDay2() {
    gameActive = true;
    document.getElementById('pvz-grid').classList.remove('hidden');
    document.getElementById('pvz-ui').classList.remove('hidden');
    document.getElementById('controls-d1').classList.add('hidden');
    document.getElementById('girl').style.display = 'none';
    document.getElementById('snoopy').style.left = "40px";
    document.getElementById('snoopy-house').style.left = "10px";
    document.getElementById('world').style.transform = "translateX(0px)";
    document.getElementById('score-val').innerText = "100";
    hearts = 100;
    setInterval(() => { if(gameActive) spawnDistraction(); }, 4000);
}

function selectWoodstock() {
    if(hearts >= 50) {
        isPlacing = true;
        document.querySelector('.seed-card').classList.add('selected');
    }
}

document.querySelectorAll('.lane').forEach(lane => {
    lane.onclick = () => {
        if(isPlacing && hearts >= 50) {
            const w = document.createElement('img');
            w.src = "Woodstock.png"; w.className = "defender"; 
            lane.appendChild(w);
            hearts -= 50;
            document.getElementById('score-val').innerText = hearts;
            isPlacing = false;
            document.querySelector('.seed-card').classList.remove('selected');
            setInterval(() => { if(gameActive) shootHeart(lane); }, 2500);
        }
    };
});

function shootHeart(lane) {
    const b = document.createElement('div');
    b.innerHTML = "❤️"; b.className = "bullet"; b.style.left = "70px";
    lane.appendChild(b);
    let bX = 70;
    const move = setInterval(() => {
        bX += 5; b.style.left = bX + "px";
        const enemy = lane.querySelector('.enemy');
        if(enemy && bX > enemy.offsetLeft - 20) { enemy.remove(); b.remove(); clearInterval(move); }
        if(bX > 1000) { b.remove(); clearInterval(move); }
    }, 20);
}

function spawnDistraction() {
    const lIdx = Math.floor(Math.random() * 5);
    const lane = document.querySelectorAll('.lane')[lIdx];
    const en = document.createElement('div');
    en.innerHTML = "📝"; en.className = "enemy"; 
    lane.appendChild(en);
    let eX = 1000;
    const walk = setInterval(() => {
        if(!gameActive) { clearInterval(walk); return; }
        eX -= 2; en.style.left = eX + "px";
        if(eX < 0) { clearInterval(walk); alert("Snoopy got distracted! Try again ❤️"); location.reload(); }
    }, 30);
}

function loop() {
    if(!active || currentDay !== 1) return;
    if(keys['Left'] && gX > 150) { gX -= 10; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if(keys['Right'] && gX < 5500) { gX += 10; document.getElementById('girl').style.transform = "scaleX(1)"; }
    gY += vY;
    if(gY > 0) vY -= 1.5; else { gY = 0; vY = 0; isJump = false; }
    document.getElementById('girl').style.left = gX + "px";
    document.getElementById('girl').style.bottom = (15 + (gY/10)) + "%";
    document.getElementById('snoopy').style.left = (gX - 100) + "px";
    document.getElementById('snoopy').style.bottom = (15 + (gY/10)) + "%";
    const viewX = -(gX - window.innerWidth / 2);
    document.getElementById('world').style.transform = `translateX(${viewX > 0 ? 0 : viewX}px)`;
    checkD1Collisions();
    requestAnimationFrame(loop);
}

function checkD1Collisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('#hearts-layer div').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 50 && Math.abs(gRect.top - hRect.top) < 80) {
            h.remove(); score++; document.getElementById('score-val').innerText = score + "/5";
            if(score === 5) showWin();
        }
    });
}

const setupIn = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
setupIn('left', 'Left'); setupIn('right', 'Right');
document.getElementById('jump').ontouchstart = (e) => { e.preventDefault(); if(!isJump){vY=25;isJump=true;}};

function showWin() {
    active = false;
    const w = document.getElementById('woodstock-container');
    w.classList.remove('hidden'); w.style.left = (gX + 100) + "px"; w.style.bottom = "25%";
    document.getElementById('final-letter').onclick = () => { alert("Day 1 Complete! ❤️"); location.reload(); };
}
