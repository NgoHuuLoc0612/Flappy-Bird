// ---------------------- INITIALIZE ---------------------- //

// CANVAS
let cvs = document.getElementsByTagName("canvas")[0];
let ctx = cvs.getContext("2d");

// RESPONSIVE CANVAS CONFIGURATION
const GAME_CONFIG = {
    baseWidth: 520,
    baseHeight: 630,
    aspectRatio: 520 / 630
};

let scaleFactor = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;

// Initialize responsive canvas system
function initResponsiveCanvas() {
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate optimal dimensions based on viewport
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate scale to fit viewport while maintaining aspect ratio
    const scaleX = windowWidth / GAME_CONFIG.baseWidth;
    const scaleY = windowHeight / GAME_CONFIG.baseHeight;
    scaleFactor = Math.min(scaleX, scaleY) * 0.95; // 95% to add padding
    
    // Set display size (CSS pixels)
    const displayWidth = GAME_CONFIG.baseWidth * scaleFactor;
    const displayHeight = GAME_CONFIG.baseHeight * scaleFactor;
    
    cvs.style.width = displayWidth + 'px';
    cvs.style.height = displayHeight + 'px';
    
    // Set actual size in memory (scaled for DPR for crisp rendering)
    cvs.width = GAME_CONFIG.baseWidth * dpr;
    cvs.height = GAME_CONFIG.baseHeight * dpr;
    
    // Scale context to counter DPR scaling
    ctx.scale(dpr, dpr);
    
    // Calculate canvas offset for click position calculation
    const rect = cvs.getBoundingClientRect();
    canvasOffsetX = rect.left;
    canvasOffsetY = rect.top;
    
    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;
}

// Handle window resize and orientation change
function handleResize() {
    initResponsiveCanvas();
}

// Debounced resize handler to prevent excessive reflows
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
});

window.addEventListener('orientationchange', function() {
    setTimeout(handleResize, 200);
});

// Initialize on load
initResponsiveCanvas();

// Utility function to convert screen coordinates to canvas coordinates
function getCanvasCoordinates(clientX, clientY) {
    const rect = cvs.getBoundingClientRect();
    const scaleX = GAME_CONFIG.baseWidth / rect.width;
    const scaleY = GAME_CONFIG.baseHeight / rect.height;
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// VARIABLES
let frames = 0;
const degree = Math.PI/180;

// LOAD IMAGES
const bgDay = new Image();
bgDay.src = "assets/sprites/background-day.png";

const base = new Image();
base.src = "assets/sprites/base.png";

const getReadyMsg = new Image();
getReadyMsg.src = "assets/sprites/message.png";

const gameOverMsg = new Image();
gameOverMsg.src = "assets/sprites/gameover.png";

const medalImages = [];
const medalImageCollection = loadMedalImages(
    ["bronzeMedal", "silverMedal", "goldMedal", "platinumMedal"],
    ["bronze", "silver", "gold", "platinum"]
);

function loadMedalImages(names, files) {
    for (let i = 0; i < names.length; i++) {
        const img = medalImages[names[i]] = new Image;
        img.src = "assets/sprites/" + files[i] + ".png";
    }   
}

// LOAD SOUNDS
const sounds = [];
const soundsCollection = loadSounds(
    ["flap", "hit", "swoosh", "point", "die"],
    ["flap", "hit", "swoosh", "point", "die"],
);

function loadSounds(names, files) {
    for (let i = 0; i < names.length; i++) {
        const sound = sounds[names[i]] = new Audio();
        sound.src = "assets/audio/" + files[i] + ".wav";
    }   
}

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    play : 1,
    over : 2
}

// RESTART GAME OBJECT
const restartGameBtn = {
    x : 221,
    y : 332,
    width : 84,
    height : 26
}

// BACKGROUND OBJECT
const bg = {
    x : 0,
    y : 0,
    width : 275,
    height : 630,
    
    draw : function(){
        ctx.drawImage(bgDay, this.x, this.y, this.width, this.height);
        ctx.drawImage(bgDay, this.x + this.width, this.y, this.width, this.height);
    }
}

// FOREGROUND OBJECT
const fg = {
    x: 0,
    y: GAME_CONFIG.baseHeight - 142,
    width: 258,
    height: 142,
    dx: 2,

    draw : function(){
        ctx.drawImage(base, this.x, this.y, this.width, this.height);
        ctx.drawImage(base, this.x + this.width, this.y, this.width, this.height);
        ctx.drawImage(base, this.x + 2*this.width, this.y, this.width, this.height);
    },

    update: function(){ 
        if(state.current == state.play){
            this.x = (this.x - this.dx) % (this.width/1.15);
        }
    }
}

// GET READY MESSAGE
const getReady = {
    x : GAME_CONFIG.baseWidth/2 - 173/2,
    y : 50,
    width : 173,
    height : 252,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(getReadyMsg, this.x, this.y, this.width, this.height);
        }
    }
}

// GAME OVER MESSAGE
const gameOver = {
    x : GAME_CONFIG.baseWidth/2 - 275/2,
    y : 120,
    width : 275,
    height : 252,

    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(gameOverMsg, this.x, this.y, this.width, this.height);   
        }
    }
}
