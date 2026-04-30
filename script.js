/* =========================================
   🎮 CONFIGURATION & CUSTOMIZATION
   Change the values below to personalize!
   ========================================= */
const CONFIG = {
    targetName: "My Love", // Put their name here
    speed: 50,             // Typewriter speed (ms)
    musicEnabled: false,   // Set to true if you uncomment the audio tag in HTML
    
    // Texts - Use | for line breaks
    message1: "Hi [NAME],|I made something for you...",
    message2: "You found me.|Starting tomorrow...|we go on a little adventure.|A story about us."
};

// Replace placeholder with actual name
const welcomeText = CONFIG.message1.replace("[NAME]", CONFIG.targetName);

/* =========================================
   🚀 GAME LOGIC & STATE
   ========================================= */
// DOM Elements
const scenes = {
    start: document.getElementById('scene-start'),
    game: document.getElementById('scene-game'),
    letter: document.getElementById('scene-letter'),
    end: document.getElementById('scene-end')
};

const girl = document.getElementById('girl');
const dog = document.getElementById('dog');
const envelope = document.getElementById('envelope');
const appContainer = document.getElementById('app');

// State Variables
let gameState = 'start'; // start, intro, play, win, end
let girlX = 50;          // Starting pixel position
let isMovingLeft = false;
let isMovingRight = false;
let gameLoopId;
const moveSpeed = 4;

// Typewriter Utility Function
function typeWriter(text, elementId, speed, onComplete) {
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    let i = 0;
    
    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            el.innerHTML += (char === '|') ? '<br>' : char;
            i++;
            setTimeout(type, speed);
        } else if (onComplete) {
            onComplete();
        }
    }
    type();
}

/* =========================================
   🎬 SCENE MANAGEMENT
   ========================================= */

// SCENE 1: Start
window.onload = () => {
    typeWriter(welcomeText, 'start-text', CONFIG.speed, () => {
        const btn = document.getElementById('start-btn');
        btn.classList.remove('hidden');
        btn.onclick = startGame;
    });
};

function startGame() {
    // Attempt to play music if enabled
    if (CONFIG.musicEnabled) {
        const audio = document.getElementById('bg-music');
        if (audio) audio.play().catch(e => console.log("Audio play prevented by browser"));
    }

    // Transition
    scenes.start.classList.remove('active');
    scenes.game.classList.remove('hidden');
    
    setTimeout(() => {
        scenes.game.classList.add('active');
        runScene2Intro();
    }, 500);
}

// SCENE 2: Intro Sequence
function runScene2Intro() {
    gameState = 'intro';
    
    // Position dog off screen right, then animate in
    const targetDogX = appContainer.clientWidth - 100; 
    
    setTimeout(() => {
        dog.classList.remove('out-of-screen');
        dog.classList.add('walking');
        dog.style.transform = `translateX(${targetDogX}px)`;
        
        // Stop dog animation and start game
        setTimeout(() => {
            dog.classList.remove('walking');
            startMiniGame(targetDogX);
        }, 1200); // Wait for transition to finish
    }, 500);
}

// SCENE 3: Mini Game
function startMiniGame(targetDogX) {
    gameState = 'play';
    
    // Show mobile controls
    document.getElementById('mobile-controls').classList.remove('hidden');
    
    // Spawn ambient hearts
    spawnHearts();

    // Start rendering loop
    requestAnimationFrame(gameLoop);
}

// SCENE 4: Win State
function triggerWin() {
    gameState = 'win';
    cancelAnimationFrame(gameLoopId);
    girl.classList.remove('walking');
    
    // Dog jumps
    dog.classList.add('jumping');
    
    setTimeout(() => {
        dog.classList.remove('jumping');
        
        // Show Envelope above dog
        const dogRect = dog.getBoundingClientRect();
        envelope.style.left = `${dogRect.left + 5}px`;
        envelope.classList.remove('hidden');
        
        envelope.onclick = openLetter;
    }, 400);
}

function openLetter() {
    envelope.classList.add('hidden');
    scenes.letter.classList.remove('hidden');
    
    // Small delay to let CSS transition happen
    setTimeout(() => {
        scenes.letter.classList.add('active');
        typeWriter(CONFIG.message2, 'letter-text', CONFIG.speed + 20, () => {
            const btn = document.getElementById('close-letter-btn');
            btn.classList.remove('hidden');
            btn.onclick = endExperience;
        });
    }, 100);
}

// SCENE 5: End
function endExperience() {
    scenes.game.classList.remove('active');
    scenes.letter.classList.remove('active');
    scenes.end.classList.remove('hidden');
    
    setTimeout(() => {
        scenes.end.classList.add('active');
    }, 500);
}

/* =========================================
   🕹️ MOVEMENT & COLLISION
   ========================================= */

function gameLoop() {
    if (gameState !== 'play') return;

    let moved = false;
    const maxRight = appContainer.clientWidth - 50;

    if (isMovingRight && girlX < maxRight) {
        girlX += moveSpeed;
        moved = true;
    }
    if (isMovingLeft && girlX > 10) {
        girlX -= moveSpeed;
        moved = true;
    }

    // Apply movement & animation
    girl.style.transform = `translateX(${girlX}px)`;
    if (moved) girl.classList.add('walking');
    else girl.classList.remove('walking');

    // Check Collision
    checkCollision();

    gameLoopId = requestAnimationFrame(gameLoop);
}

function checkCollision() {
    const gRect = girl.getBoundingClientRect();
    const dRect = dog.getBoundingClientRect();

    // Simple bounding box collision
    if (gRect.right >= dRect.left + 10 && gRect.left <= dRect.right) {
        triggerWin();
    }
}

/* =========================================
   ⌨️ EVENT LISTENERS (Inputs)
   ========================================= */

// Keyboard
window.addEventListener('keydown', (e) => {
    if (gameState !== 'play') return;
    if (e.key === 'ArrowRight') isMovingRight = true;
    if (e.key === 'ArrowLeft') isMovingLeft = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') isMovingRight = false;
    if (e.key === 'ArrowLeft') isMovingLeft = false;
});

// Mobile Touch Buttons
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

const handleTouchStart = (dir) => (e) => {
    e.preventDefault(); // Prevent screen zoom/scroll
    if (gameState !== 'play') return;
    if (dir === 'left') isMovingLeft = true;
    if (dir === 'right') isMovingRight = true;
};

const handleTouchEnd = (dir) => (e) => {
    e.preventDefault();
    if (dir === 'left') isMovingLeft = false;
    if (dir === 'right') isMovingRight = false;
};

// Bind Mouse/Touch events for mobile controls
btnLeft.addEventListener('mousedown', handleTouchStart('left'));
btnLeft.addEventListener('touchstart', handleTouchStart('left'), {passive: false});
btnLeft.addEventListener('mouseup', handleTouchEnd('left'));
btnLeft.addEventListener('touchend', handleTouchEnd('left'));

btnRight.addEventListener('mousedown', handleTouchStart('right'));
btnRight.addEventListener('touchstart', handleTouchStart('right'), {passive: false});
btnRight.addEventListener('mouseup', handleTouchEnd('right'));
btnRight.addEventListener('touchend', handleTouchEnd('right'));

/* =========================================
   ✨ EFFECTS
   ========================================= */

function spawnHearts() {
    const container = document.getElementById('heart-container');
    
    setInterval(() => {
        if(gameState !== 'play' && gameState !== 'win') return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.classList.add('floating-heart');
        
        // Randomize starting position and size
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = (Math.random() * 30 + 40) + '%';
        heart.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
        
        container.appendChild(heart);
        
        // Cleanup after animation
        setTimeout(() => {
            heart.remove();
        }, 3000);
    }, 800);
}
