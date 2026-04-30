const CONFIG = {
    heartMsgs: [
        "A little heart for a big love! ❤️",
        "Snoopy says you're doing great! 🐾",
        "Each heart brings us closer! 🎁",
        "I'm so lucky you're my person. ✨",
        "Day 1 Complete! Look who's here... 💖"
    ]
};

let gX = 150, gY = 0, sX = 80, vY = 0;
let keys = {}, active = false, score = 0, jump = false;

function type(text, id, cb) {
    const el = document.getElementById(id);
    el.innerHTML = ""; let i = 0;
    const itv = setInterval(() => {
        if(i < text.length) { el.innerHTML += text[i] === "|" ? "<br>" : text[i]; i++; }
        else { clearInterval(itv); if(cb) cb(); }
    }, 45);
}

window.onload = () => {
    type("Welcome to our world!|Help Snoopy find the hearts|to unlock Day 2.", "start-text", () => {
        document.getElementById('start-btn').classList.remove('hidden');
    });
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.remove('active');
    document.getElementById('scene-game').classList.remove('hidden');
    setTimeout(() => { document.getElementById('scene-game').classList.add('active'); active = true; spawn(); loop(); }, 50);
};

// Input
const b = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
b('left', 'ArrowLeft'); b('right', 'ArrowRight');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault(); if(!jump) { vY = 22; jump = true; }
};

function spawn() {
    const layer = document.getElementById('hearts-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.className = 'heart'; h.innerHTML = '❤️';
        h.style.left = (800 + (i*500)) + "px";
        h.style.bottom = (25 + Math.random()*15) + "%";
        layer.appendChild(h);
    }
}

function loop() {
    if(!active) return;
    if(keys['ArrowLeft'] && gX > 50) { gX -= 8; document.getElementById('girl').style.transform="scaleX(-1)"; }
    if(keys['ArrowRight'] && gX < 2900) { gX += 8; document.getElementById('girl').style.transform="scaleX(1)"; }

    gY += vY;
    if(gY > 0) vY -= 1.3;
    else { gY = 0; vY = 0; jump = false; }

    sX += ( (gX - (document.getElementById('girl').style.transform==="scaleX(-1)"?-70:70)) - sX ) * 0.12;

    const gEl = document.getElementById('girl');
    const sEl = document.getElementById('snoopy');
    gEl.style.left = gX + "px"; gEl.style.bottom = (20 + (gY/10)) + "%";
    sEl.style.left = sX + "px"; sEl.style.bottom = (20 + (gY/10)) + "%";
    sEl.style.transform = gEl.style.transform;

    document.getElementById('camera').scrollLeft = gX - window.innerWidth/2;
    check();
    requestAnimationFrame(loop);
}

function check() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.heart').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 50 && Math.abs(gRect.top - hRect.top) < 70) {
            h.remove();
            popup(CONFIG.heartMsgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) startWoodstock();
        }
    });
}

function popup(msg) {
    active = false;
    const p = document.getElementById('msg-popup');
    document.getElementById('popup-text').innerText = msg;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; loop(); }, 2000);
}

function startWoodstock() {
    active = false;
    const w = document.getElementById('woodstock');
    w.classList.remove('hidden');
    w.style.left = (gX + 200) + "px";
    w.style.bottom = "80%";
    
    // Woodstock flies down to deliver letter
    let wY = 80;
    const flyDown = setInterval(() => {
        wY -= 2;
        w.style.bottom = wY + "%";
        if(wY <= 30) {
            clearInterval(flyDown);
            setTimeout(finish, 1000);
        }
    }, 30);
}

function finish() {
    document.getElementById('scene-end').classList.remove('hidden');
    document.getElementById('scene-end').classList.add('active');
    type("You finished Day 1! Woodstock brought the mail.|Day 2: The Psychiatrist Booth unlocks in 24 hours.", "end-msg");
}
