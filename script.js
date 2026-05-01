let currentDay = 0, gX = 250, gY = 0, vY = 0, hearts = 100;
let keys = {}, active = false, isJump = false, isPlacing = false, gameActive = false;
let distractionsDefeated = 0;
const TOTAL_TO_WIN = 10; 

window.onload = () => {
    const typewriter = document.getElementById('typewriter');
    const levelSelect = document.getElementById('level-select');
    const txt = "Hi Aaru!|you reached day 2! ❤️";
    let i = 0;

    // Safety check to prevent the "stuck" issue if the element isn't found
    if (!typewriter) {
        if (levelSelect) levelSelect.classList.remove('hidden');
        return;
    }

    const t = setInterval(() => {
        typewriter.innerHTML += txt[i] === "|" ? "<br>" : txt[i];
        i++; 
        if(i >= txt.length) { 
            clearInterval(t); 
            if (levelSelect) levelSelect.classList.remove('hidden'); 
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

    const incomeLoop = setInterval(() => {
        if(!gameActive) return clearInterval(incomeLoop);
        hearts += 25; 
        document.getElementById('score-val').innerText = hearts;
    }, 4000);

    const spawner = setInterval(() => {
        if(!gameActive) return clearInterval(spawner);
        spawnDistraction();
    }, 4500); 
}

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
            
            const shootTimer = setInterval(() => {
                if(!gameActive || !document.body.contains(w)) return clearInterval(shootTimer);
                shootHeart(lane, w);
            }, 2500);
        }
    };
});

function shootHeart(lane, bird) {
    const b = document.createElement('div');
    b.innerHTML = "🪨"; 
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
    const en = document.createElement('img');
    en.src = "Blu.PNG"; 
    en.className = "enemy"; 
    
    let startPos = window.innerWidth - 150;
    en.style.left = startPos + "px"; 
    lane.appendChild(en);
    
    let eX = startPos;
    const walk = setInterval(() => {
        if(!gameActive || !document.body.contains(en)) return clearInterval(walk);
        eX -= 2; 
        en.style.left = eX + "px"; 
        
        if(eX < 15) { 
            gameActive = false;
            clearInterval(walk); 
            alert("Blinkit reached Snoopy!😔💔"); 
            location.reload(); 
        }
    }, 30);
}

function checkWin() {
    if(distractionsDefeated >= TOTAL_TO_WIN) {
        gameActive = false;
        // Formatted with \n to ensure the multi-line message works in a browser alert
        alert("You Won! Snoopy stayed focused! 🥳❤️\n\nAnd heres 19 things I love about you:\n1. you\n2. your smile\n3. the way you laugh\n4. your eyes fr\n5. your voice\n6. the way you say some things\n7. your random moods\n8. your love to animals\n9. freaky aaru\n10. the way u say maine kya kiya\n11. pyara aaru\n12. your smart brain things that u talk about\n13. your pov about things\n14. your messages when i wake up\n15. the way you get me\n16. your presence\n17. your chaos\n18. your love\n19. us");
        location.reload();
    }
}

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
