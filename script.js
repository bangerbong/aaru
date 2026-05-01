let currentDay = 0, gX = 250, gY = 0, vY = 0, hearts = 100;
let keys = {}, active = false, isJump = false, isPlacing = false, gameActive = false;
let distractionsDefeated = 0;
const TOTAL_TO_WIN = 10; 

window.onload = () => {
    let i = 0; const txt = "Hi Beautiful!|Pick a day and enjoy! ❤️";
    const t = setInterval(() => {
        const typewriter = document.getElementById('typewriter');
        if (typewriter) {
            typewriter.innerHTML += txt[i] === "|" ? "<br>" : txt[i];
            i++; 
            if(i >= txt.length) { 
                clearInterval(t); 
                document.getElementById('level-select').classList.remove('hidden'); 
            }
        }
    }, 40);
};

function startLevel(day) {
    currentDay = day;
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    day === 1 ? setupDay1() : setupDay2();
}

function setupDay2() {
    gameActive = true;
    distractionsDefeated = 0;
    hearts = 100; 
    
    document.getElementById('pvz-grid').classList.remove('hidden');
    document.getElementById('pvz-ui').classList.remove('hidden');
    document.getElementById('controls-d1').classList.add('hidden');
    document.getElementById('girl').style.display = 'none';
    document.getElementById('score-val').innerText = hearts;

    // FIX 1: PASSIVE INCOME (Money over time)
    const incomeLoop = setInterval(() => {
        if(!gameActive) return clearInterval(incomeLoop);
        hearts += 25; 
        document.getElementById('score-val').innerText = hearts;
    }, 4000);

    // FIX 2: SPAWNER
    const spawner = setInterval(() => {
        if(!gameActive) return clearInterval(spawner);
        spawnDistraction();
    }, 5000); 
}

// FIX 3: MANUAL INCOME (Tap the heart icon for cash)
document.getElementById('hud').onclick = () => {
    if(gameActive) {
        hearts += 10;
        document.getElementById('score-val').innerText = hearts;
    }
};

function selectWoodstock() {
    if(hearts >= 50) {
        isPlacing = true;
        document.querySelector('.seed-card').classList.add('selected');
    }
}

document.querySelectorAll('.lane').forEach(lane => {
    lane.onclick = (e) => {
        if(isPlacing && hearts >= 50) {
            // Prevent lane overcrowding
            if (lane.querySelectorAll('.defender').length >= 3) return;

            const w = document.createElement('img');
            w.src = "Woodstock.png"; 
            w.className = "defender"; 
            w.style.left = (lane.querySelectorAll('.defender').length * 40) + "px";
            lane.appendChild(w);
            
            hearts -= 50;
            document.getElementById('score-val').innerText = hearts;
            isPlacing = false;
            document.querySelector('.seed-card').classList.remove('selected');
            
            // Shooting logic for this bird
            const shootTimer = setInterval(() => {
                if(!gameActive || !document.body.contains(w)) return clearInterval(shootTimer);
                shootHeart(lane, w);
            }, 2500);
        }
    };
});

function shootHeart(lane, bird) {
    const b = document.createElement('div');
    b.innerHTML = "❤️"; 
    b.className = "bullet"; 
    b.style.left = (parseInt(bird.style.left) + 30) + "px";
    lane.appendChild(b);
    
    let bX = parseInt(b.style.left);
    const move = setInterval(() => {
        if(!gameActive || !document.body.contains(b)) return clearInterval(move);
        bX += 10; 
        b.style.left = bX + "px"; 

        const enemies = lane.querySelectorAll('.enemy');
        enemies.forEach(en => {
            const enX = parseInt(en.style.left);
            // Collision detection
            if (bX >= enX - 20 && bX <= enX + 30) {
                en.remove();
                b.remove();
                distractionsDefeated++;
                checkWin();
                clearInterval(move);
            }
        });

        if(bX > window.innerWidth) { b.remove(); clearInterval(move); }
    }, 20);
}

function spawnDistraction() {
    const lanes = document.querySelectorAll('.lane');
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const en = document.createElement('div');
    en.innerHTML = "📝"; 
    en.className = "enemy"; 
    en.style.left = (window.innerWidth - 200) + "px"; 
    lane.appendChild(en);
    
    let eX = window.innerWidth - 200;
    const walk = setInterval(() => {
        if(!gameActive || !document.body.contains(en)) return clearInterval(walk);
        eX -= 1.5; 
        en.style.left = eX + "px"; 
        
        if(eX < 10) { 
            gameActive = false;
            clearInterval(walk); 
            alert("Snoopy got distracted! ❤️"); 
            location.reload(); 
        }
    }, 30);
}

function checkWin() {
    if(distractionsDefeated >= TOTAL_TO_WIN) {
        gameActive = false;
        alert("You Won! Snoopy stayed focused! 🥳❤️");
        location.reload();
    }
}

// Day 1 Logic
function setupDay1() {
    active = true;
    document.getElementById('score-val').innerText = "0/5";
    requestAnimationFrame(loop);
}

function loop() {
    if(!active || currentDay !== 1) return;
    if(keys['Left'] && gX > 50) gX -= 8;
    if(keys['Right'] && gX < 5800) gX += 8;
    gY += vY;
    if(gY > 0) vY -= 1.2; else { gY = 0; vY = 0; isJump = false; }
    
    const girl = document.getElementById('girl');
    const snoopy = document.getElementById('snoopy');
    const world = document.getElementById('world');

    if(girl) {
        girl.style.left = gX + "px";
        girl.style.bottom = (15 + (gY/10)) + "%";
    }
    if(snoopy) {
        snoopy.style.left = (gX - 80) + "px";
        snoopy.style.bottom = (15 + (gY/10)) + "%";
    }
    
    const viewX = -(gX - window.innerWidth / 2);
    if(world) world.style.transform = `translateX(${viewX > 0 ? 0 : viewX}px)`;
    requestAnimationFrame(loop);
}

const setupIn = (id, k) => {
    const el = document.getElementById(id);
    if(!el) return;
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
setupIn('left', 'Left'); setupIn('right', 'Right');
const jumpBtn = document.getElementById('jump');
if(jumpBtn) jumpBtn.ontouchstart = (e) => { if(!isJump){vY=22;isJump=true;}};
