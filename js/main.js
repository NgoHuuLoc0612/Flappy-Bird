// ---------------------- GAME CONTROL FUNCTIONS ---------------------- //

// SCORE (Updated to not use localStorage)
const score = {
    medalX: 154,
    medalY: 237,
    medalWidth: 54,
    medalHeight: 52,
    best : 0,
    current : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.play){
            ctx.lineWidth = 2;
            ctx.font = "55px Teko";
            ctx.fillText(this.current, GAME_CONFIG.baseWidth/2, 50);
            ctx.strokeText(this.current, GAME_CONFIG.baseWidth/2, 50);
        }else if(state.current == state.over){
            ctx.lineWidth = 1.2;
            ctx.font = "35px Teko";
            ctx.fillText(this.current, 338, 248);
            ctx.strokeText(this.current, 338, 248);
            ctx.fillText(this.best, 338, 295);
            ctx.strokeText(this.best, 338, 295);

            if(this.current >= 40){
                ctx.drawImage(medalImages["platinumMedal"], this.medalX, this.medalY, this.medalWidth, this.medalHeight);
            } else if(this.current >= 30){
                ctx.drawImage(medalImages["goldMedal"], this.medalX, this.medalY, this.medalWidth, this.medalHeight);
            } else if(this.current >= 20){
                ctx.drawImage(medalImages["silverMedal"], this.medalX, this.medalY, this.medalWidth, this.medalHeight);
            } else if(this.current >= 10){
                ctx.drawImage(medalImages["bronzeMedal"], this.medalX, this.medalY, this.medalWidth, this.medalHeight);
            } 
        }
    },

    reset : function(){
        this.current = 0;
    }
}

// UNIFIED INPUT HANDLER (Mouse + Touch)
function handleInput(e) {
    e.preventDefault(); // Prevent default touch behavior
    
    // Get coordinates (works for both mouse and touch events)
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Convert to canvas coordinates
    const coords = getCanvasCoordinates(clientX, clientY);
    
    switch(state.current){
        case state.getReady:
            state.current = state.play;
            sounds["swoosh"].play();
            break;

        case state.play:
            if(bird.y - bird.radius <= 0) return;
            sounds["flap"].play();
            bird.flap();
            break;
                         
        case state.over:
            // Check if click is on restart button
            if(coords.x >= restartGameBtn.x 
                && coords.x <= restartGameBtn.x + restartGameBtn.width 
                && coords.y >= restartGameBtn.y 
                && coords.y <= restartGameBtn.y + restartGameBtn.height
            ){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;       
    }
}

// Add event listeners for both mouse and touch
cvs.addEventListener("click", handleInput);
cvs.addEventListener("touchstart", handleInput);

// Prevent scrolling on canvas
cvs.addEventListener("touchmove", function(e) {
    e.preventDefault();
}, { passive: false });

// DRAW
function draw(){
    // Clear canvas before drawing
    ctx.clearRect(0, 0, GAME_CONFIG.baseWidth, GAME_CONFIG.baseHeight);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

// GAME LOOP
function game(){
    update();
    draw();
    frames++;
    requestAnimationFrame(game);
}

// Start game after small delay to ensure all resources are loaded
setTimeout(game, 100);
