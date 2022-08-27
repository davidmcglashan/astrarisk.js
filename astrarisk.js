// ==============================================================================================
// Game state stuff!
// We need to know the canvas dimensions to calculate some of this ...
// ==============================================================================================

// refs for the major scene elements
var gameover = document.getElementById( 'gameover' )
var booth = document.getElementById( 'booth' )
var game = document.getElementById( 'game' )
var stars = document.getElementById( 'stars' )

// Globals for screen dimensions, etc.
var width = 0;
var height = 0;
var beamPos = {
    x: 0,
    y: 0
}
var beamPath = []

// Moves the beam
// =====================
function beam( delta ) {
    // Add a new corner to the path if there has been a change in pressing state
    if ( isPressing !== wasPressing ) {
        var corner = {
            x: beamPos.x,
            y: beamPos.y
        }
        beamPath.push( corner )
    }
    wasPressing = isPressing

    // Move right
    beamPos.x += delta/2
    if ( beamPos.x > width ) {
        newBeam()
    }
    
    // Move up or down depending on mousey
    if ( isPressing ) {
        beamPos.y -= delta/2
    } else {
        beamPos.y += delta/2
    }

    // Have we gone out of bounds top and bottom?
    if ( beamPos.y < 0 || beamPos.y > height ) {
        return true
    }

    return false
}

// ==============================================================================================
// Graphics and painting stuff!
// Global graphics contexts for the canvases
// ==============================================================================================
var gameGfx = game.getContext( '2d' )
var starGfx = stars.getContext( '2d' )

// Draws the beam
// ===========================
function paintBeam() {
    gameGfx.clearRect( 0, 0, width, height );
    gameGfx.beginPath();
    gameGfx.strokeStyle = "#40d060"
    gameGfx.lineWidth = 5
    gameGfx.moveTo( 0, height/2 )

    for ( const corner of beamPath ) {
        gameGfx.lineTo( corner.x, corner.y )
    }

    gameGfx.lineTo( beamPos.x, beamPos.y )
    gameGfx.stroke()
}

// Draws the stars
// ===========================
function paintStars() {
    starGfx.clearRect( 0, 0, width, height );
    starGfx.strokeStyle = "#40d060"
    starGfx.lineWidth = 5

    starGfx.beginPath()
    starGfx.rect( 10, 10, width-20, height-20 )
    starGfx.stroke()

    starGfx.clearRect( 0, height/2 - 50, width, 100 );
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
    paintBeam()

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
    stars.style.display = 'block';
    booth.style.display = 'none';
    gameover.style.display = 'none';

    // kick off the game loops
    window.requestAnimationFrame( initState )    
}

// Reset the state of the beam and its path
// ========================================
function newBeam() {
    beamPos.x = 0
    beamPos.y = height / 2
    beamPath = []
    var corner = {
        x: beamPos.x,
        y: beamPos.y
    }
    beamPath.push( corner )
    paintStars()
}

// Initialise the game's state
// ===========================
function initState( timestamp ) {
    // update the dimensions now they're known
    width = game.offsetWidth;
    height = game.offsetHeight;
    game.width = width
    game.height = height
    stars.width = width
    stars.height = height

    newBeam()

    lastRender = timestamp
    window.requestAnimationFrame( loop )    
}

// End the game!
// ===============
function gameOver() {
    // Show the game over screen ...
    gameover.style.display = 'block';
}

// Returns to the booth
// ===============
function back() {
    // Show the game over screen ...
    booth.style.display = 'block';
    game.style.display = 'none';
    stars.style.display = 'none';
    gameover.style.display = 'none';
}

// ==============================================================================================
// Mouse stuff!
// Listen for mouse up and mouse down (hopefully fingers on touch devices!)
// ==============================================================================================

// When true, someone is pressing the mouse/touching the screen
var pressing = false;
var wasPressing = false;

// Determines if pressing is occurring or not. 
// ==============================
function isPressing( e ) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    isPressing = (flags & 1) === 1;
}

// Update state when the mouse buttons are pressed or released.
document.addEventListener( "mousedown", isPressing );
document.addEventListener( "mouseup", isPressing );