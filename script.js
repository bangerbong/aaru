let gX = 250, gY = 0, vY = 0, score = 0;
let keys = {}, active = false, isJump = false;

const messages = [
    "First heart! I love you! ❤️",
    "Snoopy thinks you're great! 🐾",
    "Keep going, sunshine! ✨",
    "Almost at the end! 🎁",
    "All hearts found! Click Woodstock's letter! ✉️"
];

// Typewriter Intro
window.onload = () => {
    let i = 0; const txt = "Hi Beautiful! Welcome to Day 1.|Collect 5 hearts to unlock|your special surprise...";
    const timer = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; if(i >= txt.length) { clearInterval(timer); document.getElementById('start-btn').classList.remove('hidden'); }
    }, 50);
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    active = true;
    spawnAssets();
    loop();
};

// Control Bindings
const setupBtn = (id, k) => {
    const b = document.getElementById(id);
    b.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    b.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
setupBtn('left', 'Left'); setupBtn('right', 'Right');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault(); if(!isJump) { vY = 28; isJump = true; }
};

function spawnAssets() {
    const hl = document.getElementById('hearts-layer');
    const ol = document.getElementById('obstacles-layer');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.innerHTML = '❤️'; h.className = 'sprite'; h.style.fontSize = '40px';
        h.style.left = (1200 + (i * 950)) + "px"; h.style.bottom = "45%";
        hl.appendChild(h);

        const log = document.createElement('div');
        log.className = 'log-hurdle';
        log.style.left = (1200 + (i * 950) - 350) + "px";
        ol.appendChild(log);
    }
}

function loop() {
    if(!active) return;

    // Movement
    if(keys['Left'] && gX > 200) { gX -= 12; document.getElementById('girl').style.transform = "scaleX(-1)"; }
    if(keys['Right'] && gX < 5800) { gX += 12; document.getElementById('girl').style.transform = "scaleX(1)"; }

    // Jump Physics
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
    const viewX = -(gX - window.innerWidth / 2);
    document.getElementById('world').style.transform = `translateX(${viewX > 0 ? 0 : viewX}px)`;

    checkHits();
    requestAnimationFrame(loop);
}

function checkHits() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    
    // Hearts
    document.querySelectorAll('#hearts-layer .sprite').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(Math.abs(gRect.left - hRect.left) < 60 && Math.abs(gRect.top - hRect.top) < 100) {
            h.remove();
            showPopup(messages[score]);
            score++;
            document.getElementById('score').innerText = score;
            if(score === 5) win();
        }
    });

    // Hurdles
    document.querySelectorAll('.log-hurdle').forEach(l => {
        const lRect = l.getBoundingClientRect();
        if(gRect.right > lRect.left + 20 && gRect.left < lRect.right - 20 && gY < 40) {
            gX -= 15; // Bump back
        }
    });
}

function showPopup(t) {
    active = false;
    const p = document.getElementById('popup');
    p.innerHTML = `<p>${t}</p>`;
    p.classList.remove('hidden');
    setTimeout(() => { p.classList.add('hidden'); active = true; loop(); }, 1800);
}

function win() {
    active = false;
    const wood = document.getElementById('woodstock-container');
    wood.classList.remove('hidden');
    wood.style.left = (gX + 130) + "px";
    wood.style.bottom = "25%";
    
    document.getElementById('final-letter').onclick = () => {
        alert("Day 1 Final Letter: I'm so lucky to have you. I hope you enjoyed this little journey. See you tomorrow for Day 2! ❤️");
        location.reload();
    };
}
