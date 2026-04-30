let gX = 200, gY = 0, vY = 0, score = 0;
let worldX = 0, active = true, isJump = false;
let keys = {};

const msgs = ["You're amazing! ❤️", "Snoopy loves you! 🐾", "Almost done! ✨", "Keep going! 💖", "Day 1 Complete! Click the letter! ✉️"];

// Mobile Controls
const bind = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('btn-left', 'ArrowLeft'); bind('btn-right', 'ArrowRight');
document.getElementById('btn-jump').ontouchstart = (e) => {
    e.preventDefault(); if(!isJump) { vY = 25; isJump = true; }
};

function spawnHearts() {
    const layer = document.getElementById('hearts-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'heart-item';
        h.style.left = (1200 + (i * 700)) + 'px';
        h.style.bottom = '30%';
        layer.appendChild(h);
    }
}

function update() {
    if(!active) return;

    if(keys['ArrowLeft'] && gX > 100) { gX -= 12; document.getElementById('girl').style.transform = 'scaleX(-1)'; }
    if(keys['ArrowRight'] && gX < 4800) { gX += 12; document.getElementById('girl').style.transform = 'scaleX(1)'; }

    gY += vY;
    if(gY > 0) vY -= 1.5; else { gY = 0; vY = 0; isJump = false; }

    const girl = document.getElementById('girl');
    girl.style.left = gX + 'px';
    girl.style.bottom = (20 + (gY / 10)) + '%';

    const snoopy = document.getElementById('snoopy');
    snoopy.style.left = (gX - 80) + 'px';
    snoopy.style.bottom = (20 + (gY / 10)) + '%';

    // CAMERA LOGIC: Move the world container to keep girl centered
    worldX = -(gX - (window.innerWidth / 2));
    if(worldX > 0) worldX = 0;
    document.getElementById('world').style.transform = `translateX(${worldX}px)`;

    checkCollisions();
    requestAnimationFrame(update);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.heart-item').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 80) {
            h.remove();
            showPopup(msgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) handleEnd();
        }
    });
}

function showPopup(txt) {
    active = false;
    const p = document.getElementById('popup');
    document.getElementById('popup-text').innerText = txt;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; update(); }, 2000);
}

function handleEnd() {
    active = false;
    const w = document.getElementById('woodstock');
    const l = document.getElementById('letter');
    w.classList.remove('hidden');
    w.style.left = (gX + 100) + 'px';
    w.style.bottom = '80%';
    
    let flyY = 80;
    const timer = setInterval(() => {
        flyY -= 1.5;
        w.style.bottom = flyY + '%';
        if(flyY <= 35) {
            clearInterval(timer);
            l.classList.remove('hidden');
            l.onclick = () => {
                alert("Day 1 officially finished! I love you!");
                location.reload();
            };
        }
    }, 30);
}

spawnHearts();
update();
