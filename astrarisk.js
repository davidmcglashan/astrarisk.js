// Obtain the canvas dimensions


var elem = document.getElementById( 'game' )
var gfx = elem.getContext( '2d' )
var width = elem.offsetWidth;
var height = elem.offsetHeight;

  elem.width = width
  elem.height = height


// Simple object to track the beam's position
var state = {
    x: 0,
    y: height / 2
}

// =======================
// Moves the beam
// =======================
function beam( delta ) {
    state.x += delta/2
    if ( state.x > width ) {
        state.x = 0
        state.y = height/2
    }
    
    state.y += delta/2

    console.log( state )
}

// =======================
// Draws the beam
// =======================
function paint() {
    gfx.clearRect(0, 0, width, height)
    gfx.strokeStyle = "#40d060"
    gfx.lineWidth = 5
    gfx.moveTo( 0, height/2 )
    gfx.lineTo( state.x, state.y )
    gfx.stroke()
}

// =======================
// Game loop.
// =======================
function loop( now ) {
    // Move the beam along and repaint the canvas
    beam( now - lastRender )
    paint()

    lastRender = now
    window.requestAnimationFrame( loop )
}

var lastRender = 0
window.requestAnimationFrame( loop )