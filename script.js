const CONFIG = {
    heartMsgs: [
        "You're the most amazing person I know! ❤️",
        "Snoopy says you're doing great! 🐾",
        "Every day with you is a gift. 🎁",
        "I'm so lucky you're mine. ✨",
        "Day 1 Complete! I love you so much. 💖"
    ]
};

let gX = 150, gY = 0, sX = 80, velY = 0, isJump = false;
let score = 0, active = false;
const keys = {};

// Typewriter
function type(text, id, cb) {
    const el = document.getElementById(id);
    el.innerHTML = ""; let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text[i] === "|" ? "<br>" : text[i];
            i++;
        } else {
            clearInterval(interval);
            if (cb) cb();
        }
    }, 40);
}

window.onload = () => {
    type("Welcome to Day 1.|Let's find some hearts|with our friend Snoopy!", "start-text", () => {
        document.getElementById('start-btn').classList.remove('hidden');
    });
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.remove('active');
    const g = document.getElementById('scene-game');
    g.classList.remove('hidden');
    setTimeout(() => { g.classList.add('active'); active = true; spawnHearts(); loop(); }, 50);
};

// Input Handling
const bind = (id, k) => {
    const b = document.getElementById(id);
    b.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    b.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('left', 'ArrowLeft'); bind('right', 'ArrowRight');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault(); if (!isJump) { velY = 22; isJump = true; }
};

function spawnHearts() {
    const layer = document.getElementById('hearts-layer');
    for (let i = 0; i < 5; i++) {
        const h = document.createElement('div');
        h.className = 'collectible';
        h.innerHTML = '❤️';
        h.style.position = "absolute";
        h.style.fontSize = "3rem";
        h.style.left = (800 + (i * 600)) + "px";
        h.style.bottom = (25 + Math.random() * 15) + "%";
        layer.appendChild(h);
    }
}

function loop() {
    if (!active) return;

    if (keys['ArrowLeft'] && gX > 0) { gX -= 8; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if (keys['ArrowRight'] && gX < 3800) { gX += 8; document.getElementById('girl').style.transform = "scaleX(1)"; }

    gY += velY;
    if (gY > 0) velY -= 1.3; else { gY = 0; velY = 0; isJump = false; }

    // Snoopy following logic (smooth lerp)
    const targetSX = gX - (document.getElementById('girl').style.transform === "scaleX(-1)" ? -70 : 70);
    sX += (targetSX - sX) * 0.12;

    const girl = document.getElementById('girl');
    const snoopy = document.getElementById('snoopy');
    
    girl.style.left = gX + "px";
    girl.style.bottom = (20 + (gY / 10)) + "%";
    
    snoopy.style.left = sX + "px";
    snoopy.style.bottom = (20 + (gY / 10)) + "%";
    snoopy.style.transform = girl.style.transform;

    document.getElementById('camera').scrollLeft = gX - window.innerWidth / 2;

    checkCollisions();
    requestAnimationFrame(loop);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.collectible').forEach((h, i) => {
        const hRect = h.getBoundingClientRect();
        if (Math.abs(gRect.left - hRect.left) < 50 && Math.abs(gRect.top - hRect.top) < 70) {
            h.remove();
            showPopup(CONFIG.heartMsgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if (score === 5) { active = false; setTimeout(finish, 2000); }
        }
    });
}

function showPopup(msg) {
    active = false;
    const p = document.getElementById('msg-popup');
    document.getElementById('popup-text').innerText = msg;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; loop(); }, 2500);
}

function finish() {
    document.getElementById('scene-end').classList.remove('hidden');
    document.getElementById('scene-end').classList.add('active');
    type("You completed Day 1!|I can't wait for|the next 12 days with you.", "end-msg");
}
