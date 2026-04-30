const CONFIG = {
    userName: "Alex", // Change this!
    typeSpeed: 50,
    totalHearts: 5,
    messages: {
        intro: "Hi [NAME],|I've been waiting for you.|Can you help me find|the 5 missing hearts?",
        win: "You found them all!|Now we can start|our journey together.|Check back tomorrow."
    }
};

let heartsFound = 0;
let girlPos = { x: 20, y: 50 }; // % values
let keys = {};
let gameActive = false;

// Helpers
const show = (id) => {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('active'), 50);
};

const type = (text, elementId, callback) => {
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    let i = 0;
    const cleanText = text.replace("[NAME]", CONFIG.userName);
    
    const interval = setInterval(() => {
        if (i < cleanText.length) {
            el.innerHTML += cleanText[i] === "|" ? "<br>" : cleanText[i];
            i++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, CONFIG.typeSpeed);
};

// Initialization
window.onload = () => {
    type(CONFIG.messages.intro, "start-text", () => {
        document.getElementById('start-btn').classList.remove('hidden');
    });
};

document.getElementById('start-btn').onclick = () => {
    show('scene-game');
    gameActive = true;
    spawnHearts();
    requestAnimationFrame(update);
};

// Input Handling
window.onkeydown = (e) => keys[e.key] = true;
window.onkeyup = (e) => keys[e.key] = false;

const bindControl = (id, key) => {
    const btn = document.getElementById(id);
    btn.ontouchstart = (e) => { e.preventDefault(); keys[key] = true; };
    btn.ontouchend = (e) => { e.preventDefault(); keys[key] = false; };
};
bindControl('btn-up', 'ArrowUp');
bindControl('btn-down', 'ArrowDown');
bindControl('btn-left', 'ArrowLeft');
bindControl('btn-right', 'ArrowRight');

// Game Engine
function update() {
    if (!gameActive) return;

    let moved = false;
    const speed = 0.8;

    if (keys['ArrowUp'] && girlPos.y > 5) { girlPos.y -= speed; moved = true; }
    if (keys['ArrowDown'] && girlPos.y < 90) { girlPos.y += speed; moved = true; }
    if (keys['ArrowLeft'] && girlPos.x > 5) { girlPos.x -= speed; moved = true; }
    if (keys['ArrowRight'] && girlPos.x < 90) { girlPos.x += speed; moved = true; }

    const girlEl = document.getElementById('girl');
    girlEl.style.left = girlPos.x + "%";
    girlEl.style.top = girlPos.y + "%";
    
    // 3D Depth Layering: Y position determines who is in front
    girlEl.style.zIndex = Math.floor(girlPos.y);

    if (moved) girlEl.classList.add('walking');
    else girlEl.classList.remove('walking');

    checkCollisions();
    requestAnimationFrame(update);
}

function spawnHearts() {
    const area = document.getElementById('play-area');
    for (let i = 0; i < CONFIG.totalHearts; i++) {
        const h = document.createElement('div');
        h.className = 'collectible-heart';
        h.innerHTML = '❤️';
        h.style.left = (15 + Math.random() * 70) + "%";
        h.style.top = (15 + Math.random() * 70) + "%";
        area.appendChild(h);
    }
}

function checkCollisions() {
    const girlRect = document.getElementById('girl').getBoundingClientRect();
    const hearts = document.querySelectorAll('.collectible-heart');
    
    hearts.forEach(h => {
        const hRect = h.getBoundingClientRect();
        if (!(girlRect.right < hRect.left || girlRect.left > hRect.right || 
              girlRect.bottom < hRect.top || girlRect.top > hRect.bottom)) {
            h.remove();
            heartsFound++;
            document.getElementById('heart-count').innerText = `❤️ ${heartsFound}/5`;
            if (heartsFound === CONFIG.totalHearts) winGame();
        }
    });
}

function winGame() {
    gameActive = false;
    show('scene-letter');
    type(CONFIG.messages.win, "letter-text", () => {
        document.getElementById('close-btn').classList.remove('hidden');
    });
}

document.getElementById('close-btn').onclick = () => {
    show('scene-end');
};
