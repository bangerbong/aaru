const CONFIG = {
    name: "Aaru",
    heartMessages: [
        "You are so pretty!",
        "Snoopy thinks you're the best!",
        "I'm so glad we're on this adventure.",
        "You're doing great, keep going!",
        "You found them all! I love you."
    ]
};

let girlX = 100;
let girlY = 0;
let snoopyX = 50;
let velY = 0;
let isJumping = false;
let score = 0;
let gameActive = false;
const keys = {};

const world = document.getElementById('world');
const camera = document.getElementById('camera');
const girl = document.getElementById('girl');
const snoopy = document.getElementById('snoopy');

// Initialization
window.onload = () => {
    const introMsg = `Hi ${CONFIG.name},|I made a world for us.|Use the buttons to explore.|Snoopy will follow you!`;
    typeWriter(introMsg, "start-text", () => {
        document.getElementById('start-btn').classList.remove('hidden');
    });
};

document.getElementById('start-btn').onclick = () => {
    document.getElementById('scene-start').classList.remove('active');
    document.getElementById('scene-game').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('scene-game').classList.add('active');
        gameActive = true;
        spawnHearts();
        loop();
    }, 50);
};

// Control Binding
const bind = (id, k) => {
    const btn = document.getElementById(id);
    btn.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    btn.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
bind('left', 'ArrowLeft');
bind('right', 'ArrowRight');
document.getElementById('jump').ontouchstart = (e) => {
    e.preventDefault();
    if (!isJumping) { velY = 20; isJumping = true; }
};

function spawnHearts() {
    const layer = document.getElementById('hearts-layer');
    for (let i = 0; i < 5; i++) {
        const h = document.createElement('div');
        h.className = 'collectible';
        h.innerHTML = '❤️';
        h.style.left = (600 + (i * 500)) + "px";
        h.style.bottom = (25 + Math.random() * 20) + "%";
        layer.appendChild(h);
    }
}

function loop() {
    if (!gameActive) return;

    // Movement
    if (keys['ArrowLeft'] && girlX > 0) {
        girlX -= 7;
        girl.style.transform = "scaleX(-1)";
    }
    if (keys['ArrowRight'] && girlX < 2800) {
        girlX += 7;
        girl.style.transform = "scaleX(1)";
    }

    // Jump Physics
    girlY += velY;
    if (girlY > 0) {
        velY -= 1.2; // Gravity
    } else {
        girlY = 0;
        velY = 0;
        isJumping = false;
    }

    // Snoopy Follow Logic (Mario style delay)
    const targetSnoopyX = girlX - (girl.style.transform === "scaleX(-1)" ? -60 : 60);
    snoopyX += (targetSnoopyX - snoopyX) * 0.1;
    
    // Apply Positions
    girl.style.left = girlX + "px";
    girl.style.bottom = (20 + (girlY / 10)) + "%";
    
    snoopy.style.left = snoopyX + "px";
    snoopy.style.bottom = (20 + (girlY / 10)) + "%"; // Snoopy jumps with you
    snoopy.style.transform = girl.style.transform;

    // Camera follow
    camera.scrollLeft = girlX - window.innerWidth / 2;

    checkHearts();
    requestAnimationFrame(loop);
}

function checkHearts() {
    const gRect = girl.getBoundingClientRect();
    document.querySelectorAll('.collectible').forEach((h, i) => {
        const hRect = h.getBoundingClientRect();
        if (Math.abs(gRect.left - hRect.left) < 40 && Math.abs(gRect.top - hRect.top) < 60) {
            h.remove();
            showPopup(CONFIG.heartMessages[score]);
            score++;
            document.getElementById('score').innerText = score;
            if (score === 5) endGame();
        }
    });
}

function showPopup(msg) {
    gameActive = false;
    const p = document.getElementById('heart-popup');
    document.getElementById('popup-msg').innerText = msg;
    p.classList.remove('hidden');
    setTimeout(() => {
        p.classList.add('hidden');
        gameActive = true;
        loop();
    }, 2000);
}

function endGame() {
    gameActive = false;
    document.getElementById('scene-end').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('scene-end').classList.add('active');
        typeWriter("You did it! Snoopy is so happy. Day 2 unlocks tomorrow.", "final-msg");
    }, 500);
}

function typeWriter(text, id, cb) {
    const el = document.getElementById(id);
    el.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text[i] === "|" ? "<br>" : text[i];
            i++;
        } else {
            clearInterval(interval);
            if (cb) cb();
        }
    }, 50);
}
