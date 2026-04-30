let gX = 250, gY = 0, vY = 0, score = 0;
let keys = {}, active = false, isJump = false;

const msgs = ["You found a heart! ❤️", "Snoopy is with you! 🐾", "High jump! 🪵", "Almost home! ✨", "All hearts collected! 💖"];

window.onload = () => {
    let i = 0; const txt = "Hi Love! Welcome to Day 1.|Collect 5 hearts to read|my letter to you...";
    const t = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; if(i >= txt.length) { clearInterval(t); document.getElementById('start-btn').classList.remove('hidden'); }
    }, 50);
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    active = true;
    setupWorld();
    gameLoop();
};

const bind = (id, k) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('btn-left', 'Left'); bind('btn-right', 'Right');
document.getElementById('btn-jump').ontouchstart = (e) => {
    e.preventDefault(); if(!isJump) { vY = 28; isJump = true; }
};

function setupWorld() {
    const hl = document.getElementById('hearts-layer');
    const ol = document.getElementById('obstacles-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'sprite'; h.style.fontSize = '45px';
        h.style.left = (1200 + (i * 1000)) + "px"; h.style.bottom = "45%";
        hl.appendChild(h);

        const obs = document.createElement('div');
        obs.className = 'hurdle-css';
        obs.style.left = (1200 + (i * 1000) - 400) + "px";
        ol.appendChild(obs);
    }
}

function gameLoop() {
    if(!active) return;

    if(keys['Left'] && gX > 150) { gX -= 12; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if(keys['Right'] && gX < 5800) { gX += 12; document.getElementById('girl').style.transform = "scaleX(1)"; }

    gY += vY;
    if(gY > 0) vY -= 1.6; else { gY = 0; vY = 0; isJump = false; }

    const girl = document.getElementById('girl');
    girl.style.left = gX + "px";
    girl.style.bottom = (15 + (gY / 10)) + "%";

    const snoopy = document.getElementById('snoopy');
    snoopy.style.left = (gX - (girl.style.transform === "scaleX(-1)" ? -100 : 100)) + "px";
    snoopy.style.bottom = (15 + (gY / 10)) + "%";
    snoopy.style.transform = girl.style.transform === "scaleX(-1)" ? "scaleX(1)" : "scaleX(-1)";

    // Camera Lock
    let camX = -(gX - window.innerWidth / 2);
    if(camX > 0) camX = 0;
    document.getElementById('world').style.transform = `translateX(${camX}px)`;

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    
    document.querySelectorAll('#hearts-layer div').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 100) {
            h.remove();
            showPopup(msgs[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) triggerEnd();
        }
    });

    document.querySelectorAll('.hurdle-css').forEach(o => {
        const oRect = o.getBoundingClientRect();
        if(gRect.right > oRect.left + 15 && gRect.left < oRect.right - 15 && gY < 40) {
            gX -= 15; // Bounce back
        }
    });
}

function showPopup(t) {
    active = false;
    const p = document.getElementById('popup');
    p.innerHTML = `<p>${t}</p>`;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; gameLoop(); }, 1800);
}

function triggerEnd() {
    active = false;
    const w = document.getElementById('woodstock-final');
    w.classList.remove('hidden');
    w.style.left = (gX + 150) + "px";
    w.style.bottom = "20%";
    
    document.getElementById('letter-click').onclick = () => {
        alert("Day 1 Letter: I am so proud of you for finishing your first day. You're my favorite person! ❤️");
        location.reload();
    };
}
