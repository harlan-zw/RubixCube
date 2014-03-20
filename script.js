var DIRECTION = {
  LEFT  : { value: 0, name: "LEFT", x: 0, y: -90}, 
  RIGHT : { value: 1, name: "RIGHT", x: 0, y: 90}, 
  UP    : { value: 2, name: "UP", x: 90, y: 0},
  DOWN  : { value: 3, name: "DOWN", x: -90, y: 0},
  AUTO  : { value: 4, name: "AUTO", x: 90, y: 90},
};

function getDirForName(name) {
	for (var dz in DIRECTION) {
 		 var dir = DIRECTION[dz]; 
 		 if (dir.name == name)
 		 	return dir;
 	}
 	return null;
}

var rotateX = 0;
var rotateY = 0;
var animPlaying = false;

function updateRotations(x, y) {
	rotateX += x;
	rotateY += y;
	$('#rotationX').text('RotationX: ' + rotateX);
	$('#rotationY').text('RotationY: ' + rotateY);
}

function defineAnimations() {
	for (var dz in DIRECTION) {
 		 var dir = DIRECTION[dz]; 
 		 console.log('defined anim: rotation' + dir.name);
 		 var pfx = $.keyframe.getVendorPrefix();
 		 var transform = pfx + 'transform'; 
 		 $.keyframe.define({
	    	name: 'rotation' + dir.name,
	    	from: {
	    		 transform : 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)'
	    	},
	    	to: { 
	    		transform : 'rotateX(' + (rotateX + dir.x) + 'deg) rotateY(' + (rotateY + dir.y) + 'deg)'
	    	}
		});
	}
}

function playAnimation(dir) {
	if (!animPlaying) {
		animPlaying = true;
		defineAnimations();
		console.log('playing anim: rotation' + dir);

		var pfx = $.keyframe.getVendorPrefix();
		var anim = pfx + 'animation'; 
		console.log('anim: ' + anim);

		$('#rubix_cube').playKeyframe({
		    name: 'rotation' + dir, 
		    duration: 2500, 
		    timingFunction: 'linear', 
		    delay: 0, 
		    repeat: '1', 
		    direction: 'normal', 
		    //disabled fill mode to try and fix issue
		    fillMode: 'both', 
		    complete: function() {

		    	var dirObj = getDirForName(dir);
		    	updateRotations(dirObj.x, dirObj.y);


		    	//set the cubes rotation to the rotation it should be at
		    	//var pfx = $.keyframe.getVendorPrefix();
 				// var transform = pfx + 'transform'; 
		    	//$('#rubix_cube').css({ transform : 'rotateX(' + rotateX + ') rotateY(' + rotateY + ')'})

		    	animPlaying = false;
		    	console.log('finished anim  rotate: ' + rotateX + ' , ' + rotateY);
		    	if (dirObj.name == "AUTO") {
		    		setTimeout(function(){playAnimation('RIGHT')},100);
		    	}
		    } 
		});
	} else {
		console.log('already playing!');
	}
}
$( document ).keypress(function( event ) {
	switch(event.key) {
		case 'Up':
			playAnimation('UP');		
		break;
		case 'Down':
			playAnimation('DOWN');		
		break;
		case 'Left':
			playAnimation('LEFT');
		break;
		case 'Right':
			playAnimation('RIGHT');
		break;
		case 'a':
			playAnimation('AUTO');
		break;
	}
});

$(document).ready(function() {
	updateRotations(0, 0);
	console.log('document ready!');
});

