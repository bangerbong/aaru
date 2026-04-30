let gX = 300, gY = 0, vY = 0, score = 0;
let keys = {}, active = false, isJump = false;

const msgs = [
    "First heart found! ❤️",
    "You're doing amazing! 🐾",
    "Snoopy is so happy! ✨",
    "Almost there, my love! 🎁",
    "Day 1 Complete! See what Woodstock has... 💖"
];

// Start Screen Typing
window.onload = () => {
    const text = "Welcome to Day 1.|Collect 5 hearts to unlock|a special message...";
    let i = 0;
    const interval = setInterval(() => {
        document.getElementById('intro-text').innerHTML += text[i] === "|" ? "<br>" : text[i];
        i++;
        if(i >= text.length) {
            clearInterval(interval);
            document.getElementById('start-btn').classList.remove('hidden');
        }
    }, 50);
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    active = true;
    spawnHearts();
    update();
};

// Input Handling
const bind = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('left', 'ArrowLeft'); bind('right', 'ArrowRight');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault(); if(!isJump) { vY = 24; isJump = true; }
};

function spawnHearts() {
    const layer = document.getElementById('hearts-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'heart-pickup';
        h.style.left = (1200 + (i * 700)) + 'px';
        h.style.bottom = (25 + Math.random()*10) + '%';
        layer.appendChild(h);
    }
}

function update() {
    if(!active) return;

    // Move Girl
    if(keys['ArrowLeft'] && gX > 150) { gX -= 11; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if(keys['ArrowRight'] && gX < 4800) { gX += 11; document.getElementById('girl').style.transform = "scaleX(1)"; }

    // Gravity
    gY += vY;
    if(gY > 0) vY -= 1.4; else { gY = 0; vY = 0; isJump = false; }

    const girl = document.getElementById('girl');
    girl.style.left = gX + 'px';
    girl.style.bottom = (18 + (gY / 10)) + '%';

    // Snoopy Follows
    const snoopy = document.getElementById('snoopy');
    snoopy.style.left = (gX - 90) + 'px';
    snoopy.style.bottom = (18 + (gY / 10)) + '%';
    snoopy.style.transform = girl.style.transform;

    // 🌟 CAMERA LOCK 🌟
    const world = document.getElementById('world');
    let camX = -(gX - window.innerWidth / 2);
    if(camX > 0) camX = 0; // Don't scroll past start
    world.style.transform = `translateX(${camX}px)`;

    checkCollisions();
    requestAnimationFrame(update);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.heart-pickup').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 100) {
            h.remove();
            popup(msgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) handleEnd();
        }
    });
}

function popup(txt) {
    active = false;
    const p = document.getElementById('popup');
    document.getElementById('popup-text').innerText = txt;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; update(); }, 2000);
}

function handleEnd() {
    active = false;
    const wc = document.getElementById('woodstock-container');
    const letter = document.getElementById('final-letter');
    wc.classList.remove('hidden');
    wc.style.left = (gX + 120) + 'px';
    wc.style.bottom = '80%';

    let wY = 80;
    const slide = setInterval(() => {
        wY -= 1.5;
        wc.style.bottom = wY + '%';
        if(wY <= 30) {
            clearInterval(slide);
            letter.classList.remove('hidden');
            letter.onclick = () => {
                alert("Day 1 Complete! I love you so much. See you tomorrow for Day 2! 💖");
                location.reload();
            };
        }
    }, 30);
}
