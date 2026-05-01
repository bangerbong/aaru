let currentDay = 0, gX = 250, gY = 0, vY = 0, hearts = 100;
let keys = {}, active = false, isJump = false, isPlacing = false, gameActive = false;
let distractionsDefeated = 0;
const TOTAL_TO_WIN = 10; 

window.onload = () => {
    let i = 0; const txt = "Hi Beautiful!|Pick a day and enjoy! ❤️";
    const t = setInterval(() => {
        document.getElementById('typewriter').innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; if(i >= txt.length) { clearInterval(t); document.getElementById('level-select').classList.remove('hidden'); }
    }, 40);
};

function startLevel(day) {
    currentDay = day;
    document.getElementById('scene-start').classList.add('hidden');
    document.getElementById('scene-game').classList.remove('hidden');
    day === 1 ? setupDay1() : setupDay2();
}

function setupDay1() {
    active = true;
    document.getElementById('score-val').innerText = "0/5";
    requestAnimationFrame(loop);
}

function setupDay2() {
    gameActive = true;
    distractionsDefeated = 0;
    hearts = 100; // Reset hearts to 100
    document.getElementById('pvz-grid').classList.remove('hidden');
    document.getElementById('pvz-ui').classList.remove('hidden');
    document.getElementById('controls-d1').classList.add('hidden');
    document.getElementById('girl').style.display = 'none';
    document.getElementById('snoopy').style.left = "40px";
    document.getElementById('score-val').innerText = hearts;

    // SPAWNER: Sends the notes
    const spawner = setInterval(() => {
        if(!gameActive) return clearInterval(spawner);
        spawnDistraction();
    }, 4500); 

    // INCOME: Gives you +10 hearts every 3 seconds so you can buy more birds!
    const income = setInterval(() => {
        if(!gameActive) return clearInterval(income);
        hearts += 10;
        document.getElementById('score-val').innerText = hearts;
    }, 3000);
}

function selectWoodstock() {
    if(hearts >= 50) {
        isPlacing = true;
        document.querySelector('.seed-card').classList.add('selected');
    } else {
        // Visual feedback if you're too poor
        const card = document.querySelector('.seed-card');
        card.style.background = "#ff5252";
        setTimeout(() => card.style.background = "#795548", 200);
    }
}

document.querySelectorAll('.lane').forEach(lane => {
    lane.onclick = (e) => {
        if(isPlacing && hearts >= 50) {
            // Check if lane already has a bird (optional cleanup)
            if (lane.querySelector('.defender')) return; 

            const w = document.createElement('img');
            w.src = "Woodstock.png"; w.className = "defender"; 
            lane.appendChild(w);
            
            hearts -= 50;
            document.getElementById('score-val').innerText = hearts;
            
            isPlacing = false;
            document.querySelector('.seed-card').classList.remove('selected');
            
            // Start shooting immediately and then every 2.5s
            shootHeart(lane);
            setInterval(() => { if(gameActive) shootHeart(lane); }, 2500);
        }
    };
});

function shootHeart(lane) {
    if (!lane.querySelector('.defender')) return; // Don't shoot if bird was removed
    
    const b = document.createElement('div');
    b.innerHTML = "❤️"; b.className = "bullet"; b.style.left = "60px";
    lane.appendChild(b);
    let bX = 60;

    const move = setInterval(() => {
        if(!gameActive || !document.body.contains(b)) return clearInterval(move);
        bX += 8; 
        b.style.left = bX + "px"; 

        const enemies = lane.querySelectorAll('.enemy');
        enemies.forEach(en => {
            const enX = parseInt(en.style.left);
            if (bX >= enX - 20 && bX <= enX + 40) {
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
    en.innerHTML = "📝"; en.className = "enemy"; 
    
    let startPos = window.innerWidth - 100;
    en.style.left = startPos + "px"; 
    lane.appendChild(en);
    
    let eX = startPos;
    const walk = setInterval(() => {
        if(!gameActive) return clearInterval(walk);
        if(!document.body.contains(en)) return clearInterval(walk);

        eX -= 1.8; 
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
function loop() {
    if(!active || currentDay !== 1) return;
    if(keys['Left'] && gX > 50) gX -= 8;
    if(keys['Right'] && gX < 5800) gX += 8;
    gY += vY;
    if(gY > 0) vY -= 1.2; else { gY = 0; vY = 0; isJump = false; }
    
    document.getElementById('girl').style.left = gX + "px";
    document.getElementById('girl').style.bottom = (15 + (gY/10)) + "%";
    document.getElementById('snoopy').style.left = (gX - 80) + "px";
    document.getElementById('snoopy').style.bottom = (15 + (gY/10)) + "%";
    
    const viewX = -(gX - window.innerWidth / 2);
    document.getElementById('world').style.transform = `translateX(${viewX > 0 ? 0 : viewX}px)`;
    requestAnimationFrame(loop);
}

const setupIn = (id, k) => {
    const el = document.getElementById(id);
    if(!el) return;
    el.ontouchstart = (e) => { e.preventDefault(); keys[k] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[k] = false; };
};
setupIn('left', 'Left'); setupIn('right', 'Right');
document.getElementById('jump').ontouchstart = (e) => { if(!isJump){vY=22;isJump=true;}};
