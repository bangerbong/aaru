const CONFIG = {
    name: "Aaru", // Put her name here
    messages: {
        intro: "Hi [NAME],|Snoopy is waiting for you...|Help him find 5 hearts|to unlock a secret.",
        letter: "You found all my love!|Starting tomorrow...|the gate to Day 2|will open.|I love you."
    }
};

let hearts = 0;
let girlPos = { x: 20, y: 60 };
let keys = {};
let active = false;

// Helpers
const show = (id) => {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const next = document.getElementById(id);
    next.classList.remove('hidden');
    setTimeout(() => next.classList.add('active'), 50);
};

const type = (text, id, callback) => {
    const el = document.getElementById(id);
    el.innerHTML = "";
    let i = 0;
    const msg = text.replace("[NAME]", CONFIG.name);
    const timer = setInterval(() => {
        if(i < msg.length) {
            el.innerHTML += msg[i] === "|" ? "<br>" : msg[i];
            i++;
        } else {
            clearInterval(timer);
            if(callback) callback();
        }
    }, 50);
};

// Start
window.onload = () => {
    type(CONFIG.messages.intro, "start-text", () => {
        document.getElementById('start-btn').classList.remove('hidden');
    });
};

document.getElementById('start-btn').onclick = () => {
    show('scene-game');
    active = true;
    spawnHearts();
    gameLoop();
};

// Input
window.onkeydown = (e) => keys[e.key] = true;
window.onkeyup = (e) => keys[e.key] = false;

const bind = (id, key) => {
    const b = document.getElementById(id);
    b.ontouchstart = (e) => { e.preventDefault(); keys[key] = true; };
    b.ontouchend = (e) => { e.preventDefault(); keys[key] = false; };
};
bind('up', 'ArrowUp'); bind('down', 'ArrowDown');
bind('left', 'ArrowLeft'); bind('right', 'ArrowRight');

function gameLoop() {
    if(!active) return;
    const s = 0.7;
    let move = false;

    if(keys['ArrowUp'] && girlPos.y > 10) { girlPos.y -= s; move = true; }
    if(keys['ArrowDown'] && girlPos.y < 85) { girlPos.y += s; move = true; }
    if(keys['ArrowLeft'] && girlPos.x > 5) { girlPos.x -= s; move = true; }
    if(keys['ArrowRight'] && girlPos.x < 90) { girlPos.x += s; move = true; }

    const g = document.getElementById('girl');
    g.style.left = girlPos.x + "%";
    g.style.top = girlPos.y + "%";
    g.style.zIndex = Math.floor(girlPos.y);

    if(move) g.classList.add('walking');
    else g.classList.remove('walking');

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function spawnHearts() {
    const surf = document.getElementById('play-surface');
    for(let i=0; i<5; i++) {
        const h = document.createElement('div');
        h.className = 'collect-heart';
        h.innerHTML = '❤️';
        h.style.left = (10 + Math.random() * 80) + "%";
        h.style.top = (20 + Math.random() * 60) + "%";
        surf.appendChild(h);
    }
}

function checkCollisions() {
    const gRect = document.getElementById('girl').getBoundingClientRect();
    document.querySelectorAll('.collect-heart').forEach(h => {
        const hRect = h.getBoundingClientRect();
        if(!(gRect.right < hRect.left || gRect.left > hRect.right || 
             gRect.bottom < hRect.top || gRect.top > hRect.bottom)) {
            h.remove();
            hearts++;
            document.getElementById('heart-counter').innerText = `❤️ ${hearts}/5`;
            if(hearts === 5) win();
        }
    });
}

function win() {
    active = false;
    show('scene-letter');
    type(CONFIG.messages.letter, "letter-content", () => {
        document.getElementById('next-day-btn').classList.remove('hidden');
    });
}

document.getElementById('next-day-btn').onclick = () => {
    alert("Day 1 Complete! Come back in 24 hours for Day 2.");
    location.reload(); 
};
