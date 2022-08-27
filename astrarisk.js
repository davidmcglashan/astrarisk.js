// ==============================================================================================
// Game state stuff!
// We need to know the canvas dimensions to calculate some of this ...
// ==============================================================================================

// refs for the major scene elements
var gameover = document.getElementById( 'gameover' )
var booth = document.getElementById( 'booth' )
var game = document.getElementById( 'game' )

// Globals for screen dimensions, etc.
var width = 0;
var height = 0;
var state = {
    x: 0,
    y: 0
}

// Moves the beam
// =====================
function beam( delta ) {
    // Move right
    state.x += delta/2
    if ( state.x > width ) {
        state.x = 0
        state.y = height/2
    }
    
    // Move up or down depending on mousey
    if ( isPressing ) {
        state.y -= delta/2
    } else {
        state.y += delta/2
    }

    // Have we gone out of bounds top and bottom?
    if ( state.y < 0 || state.y > height ) {
        return true
    }

    return false
}

// ==============================================================================================
// Graphics and painting stuff!
// Global graphics context for the canvas
// ==============================================================================================
var gfx = game.getContext( '2d' )

// Draws the beam
// ===========================
function paint() {
    gfx.clearRect( 0, 0, width, height );
    gfx.beginPath();
    gfx.strokeStyle = "#40d060"
    gfx.lineWidth = 5
    gfx.moveTo( 0, height/2 )
    gfx.lineTo( state.x, state.y )
    gfx.stroke()
}

// ==============================================================================================
// Game loop stuff!
// Tracks the time difference between frame updates.
// ==============================================================================================
var lastRender = 0

// Main game loop function. 
// Very simple: work out time diff, update everything, paint everything, repeat until death
// =======================
function loop( now ) {
    // Move the beam along and repaint the canvas
    isGameOver = beam( now - lastRender )
    paint()

    if ( !isGameOver ) {
        lastRender = now
        window.requestAnimationFrame( loop )
    } else {
        gameOver()
    }
}

// Start the game!
// ===============
function play() {
    // Make the canvas visible, hide the booth ...
    game.style.display = 'block';
    booth.style.display = 'none';
    gameover.style.display = 'none';

    // kick off the game loops
    window.requestAnimationFrame( initDisplay )    
}

// Initialise the game display
// ===========================
function initDisplay( timestamp ) {
    // update the dimensions now they're known
    width = game.offsetWidth;
    height = game.offsetHeight;

    game.width = width
    game.height = height
    state.x = 0
    state.y = height / 2

    lastRender = timestamp
    window.requestAnimationFrame( loop )    
}

// End the game!
// ===============
function gameOver() {
    // Show the game over screen ...
    gameover.style.display = 'block';
    game.style.display = 'none';
    booth.style.display = 'none';
}

// Returns to the booth
// ===============
function back() {
    // Show the game over screen ...
    booth.style.display = 'block';
    game.style.display = 'none';
    gameover.style.display = 'none';
}

// ==============================================================================================
// Mouse stuff!
// Listen for mouse up and mouse down (hopefully fingers on touch devices!)
// ==============================================================================================

// When true, someone is pressing the mouse/touching the screen
var pressing = false;

// Determines if pressing is occurring or not. 
// ==============================
function isPressing( e ) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    isPressing = (flags & 1) === 1;
}

// Update state when the mouse buttons are pressed or released.
document.addEventListener( "mousedown", isPressing );
document.addEventListener( "mouseup", isPressing );