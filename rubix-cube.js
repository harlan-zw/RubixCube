var DIRECTION = {
    LEFT  : { value: 0, name: "LEFT", x: 0, y: -90}, 
    RIGHT : { value: 1, name: "RIGHT", x: 0, y: 90}, 
    UP    : { value: 2, name: "UP", x: 90, y: 0},
    DOWN  : { value: 3, name: "DOWN", x: -90, y: 0},
    AUTO  : { value: 4, name: "AUTO", x: 90, y: 90},
};
/**
 * Each colour that is available on the cube
 */
var COLOURS = [
    'red',
    'white',
    'yellow',
    'green',
    'orange',
    'blue'
];
/*
 * Each class type of face the cube has
 */
var FACES = [
    'front-face',
    'back-face',
    'right-face',
    'left-face',
    'top-face',
    'bottom-face'
];
/**
 * Translates a name into a direction object
 * @param String name the name of the direction
 * @return Direction The direction object
 */
function getDirForName(name) {
    for (var dz in DIRECTION) {
        var dir = DIRECTION[dz]; 
        if (dir.name == name)
            return dir;
    }
    return null;
}
//current rotation of the cube on the x axis
var rotateX = 0;
//current rotation of the cube on the y axis
var rotateY = 0;
//random name added as a suffix to anim name to avoid duplicate anim problems
var nameRandom = 0;
//boolean for wether or not the animation is currently playing
var animPlaying = false;
/**
 * Updates the rotation data, updating the visual data of the page
 * as well
 * @param Integer x the x rotation
 * @param Integer y the y rotation
 */
function updateRotations(x, y) {
    rotateX += x;
    rotateY += y;
    //we update the visual info for the page
    $('#rotationX').text('RotationX: ' + rotateX);
    $('#rotationY').text('RotationY: ' + rotateY);
    $('#rand_id').text('RandomID: ' + nameRandom);
}
/**
 * Defines the new animations that can be played each iteration of the cube.
 */
function defineAnimations() {
    for (var dz in DIRECTION) {
        var dir = DIRECTION[dz]; 
        var pfx = $.keyframe.getVendorPrefix();
        var transform = pfx + 'transform'; 
        $.keyframe.define({
            name: 'rotation' + dir.name + nameRandom,
            from: {
                transform : 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)'
            },
            to: { 
                transform : 'rotateX(' + (rotateX + dir.x) + 'deg) rotateY(' + (rotateY + dir.y) + 'deg)'
            }
        });
    }
}
/**
  * Plays an animation 
  * @param Direction dir the direction of the movement
  */
function playAnimation(dir) {
    if (!animPlaying) {
        //generate a random number between 0 & 499 
        nameRandom = Math.floor(Math.random() * 5000);
        animPlaying = true;
        defineAnimations();


        var pfx = $.keyframe.getVendorPrefix();
        var anim = pfx + 'animation'; 

        $('#rubix-cube').playKeyframe({
            name: 'rotation' + dir + nameRandom, 
            duration: 2500, 
            timingFunction: 'linear', 
            delay: 0, 
            repeat: '1', 
            direction: 'normal', 
            //disabled fill mode to try and fix issue
            fillMode: 'both', 
            complete: function() {
                //the next direction the cube will go in
                var dirObj = getDirForName(dir);
                //update the cube for new direction
                updateRotations(dirObj.x, dirObj.y);
                //set no anim playing so we can request new anim to bne played
                animPlaying = false;
                if (dirObj.name == "AUTO") {
                    //replay anim if still on AUTO
                    playAnimation('AUTO');
                }
            } 
        });
    }
}
/**
 * Resets the cube css transform options 
 */
function resetCube() {
    $('.slot').css({ top: 0, left: 0});
    $('.slot').css({ transform: 'rotateX(0deg) rotateY(0deg)'});
    updateRotations(0, 0);
}
/**
 * Generates the HTML markup required for the cube and appends it to the page
 */
function generateMarkup() {
    if ($('#cube-container').length > 0) {
        var colourPallet = {};
        for (key in COLOURS) {
            colourPallet[COLOURS[key]] = 9;
        }
        console.log(colourPallet);

        var cube = '<div id="rubix-cube">';
        for (var f in FACES) {
            cube +=	'<div class="cube-face cube-' + FACES[f] + '">';
            for (var i = 0; i < 9; i++) {
                var validColours = new Array();
                //we check the pallet and fill the valid colours array
                //with the valid colours that can be chosen
                for (key in colourPallet) {
                    if (colourPallet[key] >= 1) {
                        validColours.push(key);
                    }
                }
                //pick a random colour from the valid ones
                var colour = validColours[Math.floor(Math.random() * validColours.length)];
                if (typeof colour !== 'undefined') {
                    colourPallet[colour]--;
                    cube += '<div class="cube-slot col-xs-4 ' + colour + '"></div>'
                }
            }
            cube +=	'</div>';
        }
        cube += '</div>';
        $('#cube-container').append(cube);
        console.log(colourPallet);

    }
}

$(document).ready(function() {
    generateMarkup();

    updateRotations(0, 0);

    playAnimation('AUTO');
});

