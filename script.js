let gX = 200, gY = 0, vY = 0, score = 0;
let keys = {}, active = false, isJump = false;

const msgs = ["Found a heart! ❤️", "Snoopy's following you! 🐾", "Watch out for the booth! 📦", "Almost home! ✨", "Day 1 Complete! Click the letter! 💖"];

// Intro Page Typewriter
window.onload = () => {
    let i = 0;
    const txt = "Hello beautiful!|Help Snoopy and me navigate|the garden and find the hearts.";
    const timer = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++;
        if (i >= txt.length) { clearInterval(timer); document.getElementById('start-btn').classList.remove('hidden'); }
    }, 45);
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    active = true;
    setupWorld();
    gameLoop();
};

// Input Bindings
const bind = (id, key) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[key] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[key] = false; };
};
bind('left-btn', 'Left'); bind('right-btn', 'Right');
document.getElementById('jump-btn').ontouchstart = (e) => {
    e.preventDefault(); if (!isJump) { vY = 28; isJump = true; }
};

function setupWorld() {
    const hl = document.getElementById('hearts-layer');
    const ol = document.getElementById('obstacles-layer');
    // Place 5 Hearts & Hurdles
    for (let i = 0; i < 5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'sprite'; h.style.fontSize = '40px';
        h.style.left = (1000 + (i * 900)) + "px";
        h.style.bottom = "40%";
        hl.appendChild(h);

        const obs = document.createElement('div');
        obs.className = i % 2 === 0 ? 'hurdle' : 'booth';
        obs.style.left = (1000 + (i * 900) - 200) + "px";
        ol.appendChild(obs);
    }
}

function gameLoop() {
    if (!active) return;

    if (keys['Left'] && gX > 100) { gX -= 12; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if (keys['Right'] && gX < 5500) { gX += 12; document.getElementById('girl').style.transform = "scaleX(1)"; }

    gY += vY;
    if (gY > 0) vY -= 1.6; else { gY = 0; vY = 0; isJump = false; }

    const girl = document.getElementById('girl');
    girl.style.left = gX + "px";
    girl.style.bottom = (15 + (gY / 10)) + "%";

    const snoopy = document.getElementById('snoopy');
    // Snoopy follows behind with a slight delay
    let sTarget = gX - (girl.style.transform === "scaleX(-1)" ? -90 : 90);
    snoopy.style.left = sTarget + "px";
    snoopy.style.bottom = (15 + (gY / 10)) + "%";

    // 🌟 THE CAMERA FOLLOW FIX 🌟
    const camera = document.getElementById('world');
    let camX = -(gX - window.innerWidth / 2);
    if (camX > 0) camX = 0;
    camera.style.transform = `translateX(${camX}px)`;

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    
    // Heart Collisions
    document.querySelectorAll('#hearts-layer .sprite').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if (Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 100) {
            h.remove();
            showMsg(msgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if (score === 5) showEnding();
        }
    });

    // Hurdle Collisions (Push-back logic)
    document.querySelectorAll('.hurdle, .booth').forEach(o => {
        const oRect = o.getBoundingClientRect();
        if (gRect.right > oRect.left && gRect.left < oRect.right && gRect.bottom > oRect.top) {
            if (gY < 50) gX -= 15; // Bump back if not high enough
        }
    });
}

function showMsg(t) {
    active = false;
    const b = document.getElementById('msg-box');
    document.getElementById('msg-text').innerText = t;
    b.classList.remove('hidden');
    setTimeout(() => { b.classList.add('hidden'); active = true; gameLoop(); }, 1800);
}

function showEnding() {
    active = false;
    const w = document.getElementById('woodstock-final');
    w.classList.remove('hidden');
    w.style.left = (gX + 150) + "px";
    w.style.bottom = "15%";
    document.getElementById('letter-btn').onclick = () => {
        alert("Day 1 Complete! I love you!");
        location.reload();
    };
}
