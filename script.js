const msgs = ["First heart! ❤️", "Snoopy is proud! 🐾", "Almost there! 🎁", "So close! ✨", "Day 1 Done! 💖"];
let gX = 200, gY = 0, sX = 100, vY = 0, score = 0;
let keys = {}, active = true, isJump = false;

// Movement Bindings
const bind = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('left', 'ArrowLeft'); bind('right', 'ArrowRight');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault(); if(!isJump) { vY = 25; isJump = true; }
};

function spawn() {
    const layer = document.getElementById('hearts-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'heart';
        h.style.position = 'absolute'; h.style.fontSize = '3rem';
        h.style.left = (800 + (i * 600)) + 'px';
        h.style.bottom = '30%';
        layer.appendChild(h);
    }
}

function gameLoop() {
    if(!active) return;

    // Movement
    if(keys['ArrowLeft'] && gX > 100) { gX -= 10; document.getElementById('girl').style.transform = 'scaleX(-1)'; }
    if(keys['ArrowRight'] && gX < 4800) { gX += 10; document.getElementById('girl').style.transform = 'scaleX(1)'; }

    // Physics
    gY += vY;
    if(gY > 0) vY -= 1.5; else { gY = 0; vY = 0; isJump = false; }

    // Snoopy Lag Follow
    sX += ( (gX - (document.getElementById('girl').style.transform === 'scaleX(-1)' ? -80 : 80)) - sX ) * 0.1;

    // Apply positions
    const girl = document.getElementById('girl');
    girl.style.left = gX + 'px';
    girl.style.bottom = (20 + (gY / 10)) + '%';
    
    const snoopy = document.getElementById('snoopy');
    snoopy.style.left = sX + 'px';
    snoopy.style.bottom = (20 + (gY / 10)) + '%';
    snoopy.style.transform = girl.style.transform;

    // 🌟 CAMERA FOLLOW FIX 🌟
    const camera = document.getElementById('camera');
    // We scroll the camera so the girl stays in the center
    camera.scrollLeft = gX - (window.innerWidth / 2);

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.heart').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 80) {
            h.remove();
            showPopup(msgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) { active = false; woodstockEnd(); }
        }
    });
}

function showPopup(txt) {
    active = false;
    const p = document.getElementById('msg-popup');
    document.getElementById('popup-text').innerText = txt;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; gameLoop(); }, 2000);
}

function woodstockEnd() {
    const w = document.getElementById('woodstock');
    w.classList.remove('hidden');
    w.style.left = (gX + 150) + 'px';
    w.style.bottom = '80%';
    let wY = 80;
    const fall = setInterval(() => {
        wY -= 2; w.style.bottom = wY + '%';
        if(wY <= 25) { clearInterval(fall); alert("Day 1 Complete! Woodstock delivered the letter."); }
    }, 50);
}

spawn();
gameLoop();
