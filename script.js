let currentDay = 0, gX = 250, gY = 0, vY = 0, score = 0, hearts = 100;
let keys = {}, active = false, isJump = false, isPlacing = false, gameActive = false;

window.onload = () => {
    let i = 0; const txt = "Hi Beautiful!|Pick a day and enjoy! ❤️";
    const t = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; if(i >= txt.length) { clearInterval(t); document.getElementById('level-select').classList.remove('hidden'); }
    }, 40);
};

function startLevel(day) {
    currentDay = day;
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    day === 1 ? setupDay1() : setupDay2();
}

function setupDay1() {
    active = true; score = 0;
    document.getElementById('score-val').innerText = "0/5";
    requestAnimationFrame(loop);
}

function setupDay2() {
    gameActive = true;
    document.getElementById('pvz-grid').classList.remove('hidden');
    document.getElementById('pvz-ui').classList.remove('hidden');
    document.getElementById('controls-d1').classList.add('hidden');
    document.getElementById('girl').style.display = 'none';
    
    // Lock Snoopy to his house behind the defense line
    document.getElementById('snoopy').style.left = "40px";
    document.getElementById('snoopy').style.bottom = "15%"; 
    document.getElementById('snoopy-house').style.left = "10px";
    
    document.getElementById('score-val').innerText = "100";
    hearts = 100;
    setInterval(() => { if(gameActive) spawnDistraction(); }, 5000); 
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
            setInterval(() => { if(gameActive) shootHeart(lane); }, 2000);
        }
    };
});

function shootHeart(lane) {
    const b = document.createElement('div');
    b.innerHTML = "❤️"; b.className = "bullet"; b.style.left = "70px";
    lane.appendChild(b);
    let bX = 70;
    const move = setInterval(() => {
        bX += 8; b.style.left = bX + "px"; 
        const enemy = lane.querySelector('.enemy');
        if(enemy && bX > enemy.offsetLeft - 10) { enemy.remove(); b.remove(); clearInterval(move); }
        if(bX > window.innerWidth) { b.remove(); clearInterval(move); }
    }, 20);
}

function spawnDistraction() {
    const lane = document.querySelectorAll('.lane')[Math.floor(Math.random() * 5)];
    const en = document.createElement('div');
    en.innerHTML = "📝"; en.className = "enemy"; 
    lane.appendChild(en);
    let eX = window.innerWidth - 170; // Start at far right of the grid
    const walk = setInterval(() => {
        if(!gameActive) return clearInterval(walk);
        eX -= 1.5; en.style.left = eX + "px"; 
        // If it crosses the thick black line on the left, you lose
        if(eX < 0) { clearInterval(walk); alert("Snoopy got distracted! ❤️"); location.reload(); }
    }, 30);
}

function loop() {
    if(!active || currentDay !== 1) return;
    if(keys['Left'] && gX > 50) gX -= 8;
    if(keys['Right'] && gX < 5800) gX += 8;
    gY += vY;
    if(gY > 0) vY -= 1.2; else { gY = 0; vY = 0; isJump = false; }
    
    // Added '15 +' back so they don't sink into the grass
    document.getElementById('girl').style.left = gX + "px";
    document.getElementById('girl').style.bottom = (15 + (gY/10)) + "%";
    document.getElementById('snoopy').style.left = (gX - 80) + "px";
    document.getElementById('snoopy').style.bottom = (15 + (gY/10)) + "%";
    
    const viewX = -(gX - window.innerWidth / 2);
    document.getElementById('world').style.transform = `translateX(${viewX > 0 ? 0 : viewX}px)`;
    requestAnimationFrame(loop);
}

const setupIn = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
setupIn('left', 'Left'); setupIn('right', 'Right');
document.getElementById('jump').ontouchstart = (e) => { if(!isJump){vY=22;isJump=true;}};
