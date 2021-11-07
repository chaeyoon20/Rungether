
/**
 *
 * BOXY RUN
 * ----
 * Simple Temple-Run-esque game, created with love by Wan Fung Chui.
 *
 */

/**
 * Constants used in this game.
 */
var Colors = {
   cherry: 0xe35d6a,
   blue: 0x1560bd,
   white: 0xd8d0d1,
   black: 0x000000,
   brown: 0xffcba4,
   peach: 0xffdab9,
   yellow: 0xffff00,
   olive: 0x556b2f,
   grey: 0x696969,
   sand: 0x835c3b,
   brownDark: 0x23190f,
   green: 0x669900,
};

var deg2Rad = Math.PI / 180;


var cameraX = -1100;
var cameraY = 1500;
var cameraZ = -1000;

// Make a new world when the page is loaded.
window.addEventListener('load', function(){
   new World();
});

/** 
 *
 * THE WORLD
 * 
 * The world in which Boxy Run takes place.
 *
 */

/** 
  * A class of which the world is an instance. Initializes the game
  * and contains the main game loop.
  *
  */
function World() {


   // Explicit binding of this even in changing contexts.
   var self = this;

   // Scoped variables in this world.
   var element, scene, camera, character, renderer, light,
      objects, objects2, paused, paused2, keysAllowed, score, score2, difficulty,
      treePresenceProb, maxTreeSize, fogDistance, gameOver, gameOver2;

   // Initialize the world.
   init();
   
   /**
     * Builds the renderer, scene, lights, camera, and the character,
     * then begins the rendering loop.
     */
   function init() {

      // Locate where the world is to be located on the screen.
      element = document.getElementById('world');

      // Initialize the renderer.
      renderer = new THREE.WebGLRenderer({
         alpha: true,
         antialias: true
      });
      renderer.setSize(element.clientWidth, element.clientHeight);
      renderer.shadowMap.enabled = true;
      element.appendChild(renderer.domElement);

      // Initialize the scene.
      scene = new THREE.Scene();
      fogDistance = 40000;
      scene.fog = new THREE.Fog(0xbadbe4, 1, fogDistance);


      // Initialize the camera with field of view, aspect ratio,
      // near plane, and far plane.
      camera = new THREE.PerspectiveCamera(
         60, element.clientWidth / element.clientHeight, 1, 120000);
      camera.position.set(0, 1200, 0);
      camera.lookAt(new THREE.Vector3(0, 600, -5000));
      window.camera = camera;

      // Set up resizing capabilities.
      window.addEventListener('resize', handleWindowResize, false);

      // Initialize the lights.
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      scene.add(light);

      // Initialize the character and add it to the scene.
      character = new Character();
      scene.add(character.element);

      character2 = new Character2();
      scene.add(character2.element);

      var ground = createBox(2400, 20, 120000, Colors.sand, 0, -400, -60000);
      scene.add(ground);

      var ground2 = createBox(2400, 20, 120000, Colors.grey, -2500, -400, -60000);
      scene.add(ground2);

      objects = [];
	  objects2 = [];
      treePresenceProb = 0.2;
      maxTreeSize = 0.5;

      for (var i = 10; i <40; i++) {
         createRowOfTrees(i * -3000, treePresenceProb, 0.5, maxTreeSize);
      }

      // The game is paused to begin with and the game is not over.
      gameOver = false;
	  gameOver2 = false;
      paused = true;
	  paused2 = true;
      // Start receiving feedback from the player.
      var left = 37;
      var up = 38;
      var right = 39;
      var p = 80;

      var w = 87;
      var a = 65;
      var s = 83;
      var d = 68;
      var q = 81;
      var ee = 69;
      
      keysAllowed = {};
      document.addEventListener(
         'keydown',
         function(e) {
            if (!gameOver || !gameOver2) {
               var key = e.keyCode;
               if (keysAllowed[key] === false) return;
               keysAllowed[key] = false;
               if (paused && paused2 && !character1CollisionsDetected() && !character2CollisionsDetected() && key == 13) { //13==enter
                  paused = false;
				  paused2 = false;
                  character.onUnpause();
                  character2.onUnpause();
                  document.getElementById(
                     "variable-content").style.visibility = "hidden";
                  document.getElementById(
                     "controls").style.display = "none";
                  document.getElementById(
                     "variable-content2").style.visibility = "hidden";
                  document.getElementById(
                     "controls2").style.display = "none";
               } 
			   else {
                  if (key == p) {
                     paused = true;
					 paused2 = true;
                     character.onPause();
                     character2.onPause();
                     document.getElementById(
                        "variable-content").style.visibility = "visible";
                     document.getElementById(
                        "variable-content").innerHTML = 
                        "Game is paused. Press enter to resume.";
					 document.getElementById(
                        "variable-content2").style.visibility = "visible";
                     document.getElementById(
                        "variable-content2").innerHTML = 
                        "Game is paused. Press enter to resume.";
                  }
                  if (key == w && !paused ) {
                     character.onUpKeyPressed();
                  }
                  if (key == a && !paused  ) {
                     character.onLeftKeyPressed();
                  }
                  if (key == d && !paused  ) {
                     character.onRightKeyPressed();
                  }
                  if (key == up && !paused2 ) {
                     character2.onUpKeyPressed();
                  }
                  if (key == left && !paused2 ) {
                     character2.onLeftKeyPressed();
                  }
                  if (key == right && !paused2 ) {
                     character2.onRightKeyPressed();
                  }

                  //camera position setting
                  if (key == w && paused && paused2 ) {
                     character.onWKeyPressed();
                     character2.onWKeyPressed();
                  }
                  if (key == s && paused && paused2 ) {
                     character.onSKeyPressed();
                     character2.onSKeyPressed();
                  }
                  if (key == a && paused && paused2 ) {
                     character.onAKeyPressed();
                     character2.onAKeyPressed();
                  }
                  if (key == d && paused && paused2 ) {
                     character.onDKeyPressed();
                     character2.onDKeyPressed();
                  }
                  if (key == q && paused && paused2 ) {
                     character.onQKeyPressed();
                     character2.onQKeyPressed();
                  }
                  if (key == ee && paused && paused2 ) {
                     character.onEKeyPressed();
                     character2.onEKeyPressed();
                  }
                  if (key == 49 && paused && paused2 ) {
                     character.on1KeyPressed();
                     character2.on1KeyPressed();
                  }
                  if (key == 50 && paused && paused2 ) {
                     character.on2KeyPressed();
                     character2.on2KeyPressed();
                  }
                  if (key == 51 && paused && paused2 ) {
                     character.on3KeyPressed();
                     character2.on3KeyPressed();
                  }
                  if (key == 52 && paused && paused2 ) {
                     character.on4KeyPressed();
                     character2.on4KeyPressed();
                  }
                  if (key == 53 && paused && paused2 ) {
                     character.on5KeyPressed();
                     character2.on5KeyPressed();
                  }
               }
            }
         }
      );

      document.addEventListener(
         'keyup',
         function(e) {
            keysAllowed[e.keyCode] = true;
         }
      );
      document.addEventListener(
         'focus',
         function(e) {
            keysAllowed = {};
         }
      );

      // Initialize the scores and difficulty.
      score = 0;
	  score2 = 0;
      difficulty = 0;
      document.getElementById("score").innerHTML = score;
      document.getElementById("score2").innerHTML = score2;

      // Begin the rendering loop.
      loop();

   }
   
   /**
     * The main animation loop.
     */
   function loop() {
      // Update the game.
      if (!paused || !paused2 ) {

         // Add more trees and increase the difficulty.
         if ((objects[objects.length - 1].mesh.position.z) % 2400 == 0) {
            difficulty += 1;
            var levelLength = 30;
            if (difficulty % levelLength == 0) {
               var level = difficulty / levelLength;
               switch (level) {
                  case 1:
                     treePresenceProb = 0.35;
                     maxTreeSize = 0.5;
                     break;
                  case 2:
                     treePresenceProb = 0.35;
                     maxTreeSize = 0.85;
                     break;
                  case 3:
                     treePresenceProb = 0.5;
                     maxTreeSize = 0.85;
                     break;
                  case 4:
                     treePresenceProb = 0.5;
                     maxTreeSize = 1.1;
                     break;
                  case 5:
                     treePresenceProb = 0.5;
                     maxTreeSize = 1.1;
                     break;
                  case 6:
                     treePresenceProb = 0.55;
                     maxTreeSize = 1.1;
                     break;
                  default:
                     treePresenceProb = 0.55;
                     maxTreeSize = 1.25;
               }
            }
            if ((difficulty >= 5 * levelLength && difficulty < 6 * levelLength)) {
               fogDistance -= (25000 / levelLength);
            } else if (difficulty >= 8 * levelLength && difficulty < 9 * levelLength) {
               fogDistance -= (5000 / levelLength);
            }
            createRowOfTrees(-120000, treePresenceProb, 0.5, maxTreeSize);
            
            scene.fog.far = fogDistance;
         }
		
	     if (!gameOver)
	     {
			 character.update();
			 objects.forEach(function(object) {
			 object.mesh.position.z += 100;
			 });	
	     }
		 if (!gameOver2)
	     {
			 character2.update();
			 objects2.forEach(function(object) {
			 object.mesh.position.z += 100;
			 });	
	     }
		 
		 
         // Remove trees that are outside of the world.
         objects = objects.filter(function(object) {
            return object.mesh.position.z < 0;
         });
		 objects2 = objects2.filter(function(object) {
            return object.mesh.position.z < 0;
         });
         // Make the character move according to the controls.
        

         // Check for collisions between the character and objects.
         if (character1CollisionsDetected()) {
            gameOver = true;
			paused = true;
			
            document.addEventListener(
                 'keydown',
                 function(e) {   
                    if (e.keyCode == 13)
                     document.location.reload(true);
                 }
             );
             var variableContent = document.getElementById("variable-content");
             variableContent.style.visibility = "visible";
             if (gameOver2 == true)
			 {
				variableContent.innerHTML = "Press enter to try again !";
			
			 }
			 else{
				 variableContent.innerHTML = 
                "Game over! User2 WIN !";
			 }
         }

         if (character2CollisionsDetected()) {
            gameOver2 = true;
			paused2 = true;
			
            document.addEventListener(
                 'keydown',
                 function(e) {   
                    if (e.keyCode == 13)
                     document.location.reload(true);
                 }
             );
             var variableContent = document.getElementById("variable-content2");
             variableContent.style.visibility = "visible";
             if (gameOver == true)
			 {
					variableContent.innerHTML = "Press enter to try again !";
			 }
			 else{
				variableContent.innerHTML = 
                "Game over! User1 WIN !";
			 }
         }

         // Update the scores.
		 if (!gameOver)
		 {
			score += 10;
			document.getElementById("score").innerHTML = score;
		 }
		 if (!gameOver2)
		 {
			 score2 += 10;
			 document.getElementById("score2").innerHTML = score2;
		 }

      }

      camera.position.set(cameraX, cameraY, cameraZ);

      // Render the page and repeat.
      renderer.render(scene, camera);
      requestAnimationFrame(loop);

   } //end loop

   /**
     * A method called when window is resized.
     */
   function handleWindowResize() {
      renderer.setSize(element.clientWidth, element.clientHeight);
      camera.aspect = element.clientWidth / element.clientHeight;
      camera.updateProjectionMatrix();
   }

   /**
    * Creates and returns a row of trees according to the specifications.
    *
    * @param {number} POSITION The z-position of the row of trees.
     * @param {number} PROBABILITY The probability that a given lane in the row
     *                             has a tree.
     * @param {number} MINSCALE The minimum size of the trees. The trees have a 
     *                     uniformly distributed size from minScale to maxScale.
     * @param {number} MAXSCALE The maximum size of the trees.
     *
    */
   function createRowOfTrees(position, probability, minScale, maxScale) {
      for (var lane = -1; lane < 2; lane++) {
         var randomNumber = Math.random();
         if (randomNumber < probability) {
         		var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(lane * 700, -400, position, scale);
				lane -= 3;
				var tree2 = new Tree(lane * 800, -400, position, scale);
				lane += 3;
				objects2.push(tree);
				objects.push(tree2);
				scene.add(tree.mesh);
				scene.add(tree2.mesh);

         }
      }
   }

   /**
    * Returns true if and only if the character is currently colliding with
    * an object on the map.
    */

   function character1CollisionsDetected() {

       var charMinX = character.element.position.x - 115;
       var charMaxX = character.element.position.x + 115;
       var charMinY = character.element.position.y - 310;
       var charMaxY = character.element.position.y + 320;
       var charMinZ = character.element.position.z - 40;
       var charMaxZ = character.element.position.z + 40;
       for (var i = 0; i < objects.length; i++) {
          if (objects[i].collides(charMinX, charMaxX, charMinY, 
                charMaxY, charMinZ, charMaxZ)) {
             return true;
          }
       }

       return false;
    }

    function character2CollisionsDetected() {
       var charMinX2 = character2.element.position.x - 115;
       var charMaxX2 = character2.element.position.x + 115;
       var charMinY2 = character2.element.position.y - 320;
       var charMaxY2 = character2.element.position.y + 320;
       var charMinZ2 = character2.element.position.z - 40;
       var charMaxZ2 = character2.element.position.z + 40;
       for (var i = 0; i < objects2.length; i++) {
          if (objects2[i].collides(charMinX2, charMaxX2, charMinY2, 
                charMaxY2, charMinZ2, charMaxZ2)) {
            return true;
         }
      }

      return false;

   }
   
}

/** 
 *
 * IMPORTANT OBJECTS
 * 
 * The character and environmental objects in the game.
 *
 */

/**
 * The player's character in the game.
 */
function Character() {

   // Explicit binding of this even in changing contexts.
   var self = this;

   // Character defaults that don't change throughout the game.
   this.skinColor = Colors.brown;
   this.hairColor = Colors.black;
   this.shirtColor = Colors.yellow;
   this.shortsColor = Colors.olive;
   this.jumpDuration = 0.6;
   this.jumpHeight = 2000;

   // Initialize the character.
   init();

   /**
     * Builds the character in depth-first order. The parts of are 
       * modelled by the following object hierarchy:
     *
     * - character (this.element)
     *    - head
     *       - face
     *       - hair
     *    - torso
     *    - leftArm
     *       - leftLowerArm
     *    - rightArm
     *       - rightLowerArm
     *    - leftLeg
     *       - rightLowerLeg
     *    - rightLeg
     *       - rightLowerLeg
     *
     * Also set up the starting values for evolving parameters throughout
     * the game.
     * 
     */
   function init() {

      // Build the character.
      self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
      self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
      self.head = createGroup(0, 260, -25);
      self.head.add(self.face);
      self.head.add(self.hair);

      self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

      self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -170, 0);
      self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
      self.leftArm.add(self.leftLowerArm);

      self.rightLowerArm = createLimb(
         20, 120, 30, self.skinColor, 0, -170, 0);
      self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
      self.rightArm.add(self.rightLowerArm);

      self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -200, 0);
      self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
      self.leftLeg.add(self.leftLowerLeg);

      self.rightLowerLeg = createLimb(
         40, 200, 40, self.skinColor, 0, -200, 0);
      self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
      self.rightLeg.add(self.rightLowerLeg);

      self.element = createGroup(-2500, 0, -4000);
      self.element.add(self.head);
      self.element.add(self.torso);
      self.element.add(self.leftArm);
      self.element.add(self.rightArm);
      self.element.add(self.leftLeg);
      self.element.add(self.rightLeg);

      // Initialize the player's changing parameters.
      self.isJumping = false;
      self.isSwitchingLeft = false;
      self.isSwitchingRight = false;
      self.currentLane = -3;
      self.runningStartTime = new Date() / 1000;
      self.pauseStartTime = new Date() / 1000;
      self.stepFreq = 2;
      self.queuedActions = [];

   }

   /**
    * Creates and returns a limb with an axis of rotation at the top.
    *
    * @param {number} DX The width of the limb.
    * @param {number} DY The length of the limb.
    * @param {number} DZ The depth of the limb.
    * @param {color} COLOR The color of the limb.
    * @param {number} X The x-coordinate of the rotation center.
    * @param {number} Y The y-coordinate of the rotation center.
    * @param {number} Z The z-coordinate of the rotation center.
    * @return {THREE.GROUP} A group that includes a box representing
    *                       the limb, with the specified properties.
    *
    */
   function createLimb(dx, dy, dz, color, x, y, z) {
       var limb = createGroup(x, y, z);
       var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
      var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
      limb.add(limbBox);
      return limb;
   }
   
   /**
    * A method called on the character when time moves forward.
    */
   this.update = function() {

      // Obtain the curren time for future calculations.
      var currentTime = new Date() / 1000;

      // Apply actions to the character if none are currently being
      // carried out.
      if (!self.isJumping &&
         !self.isSwitchingLeft &&
         !self.isSwitchingRight &&
         self.queuedActions.length > 0) {
         switch(self.queuedActions.shift()) {
            case "up":
               self.isJumping = true;
               self.jumpStartTime = new Date() / 1000;
               break;
            case "left":
               if (self.currentLane != -4) {
                  self.isSwitchingLeft = true;
               }
               break;
            case "right":
               if (self.currentLane != -2) {
                  self.isSwitchingRight = true;
               }
               break;
         }
      }

      // If the character is jumping, update the height of the character.
      // Otherwise, the character continues running.
      if (self.isJumping) {
         var jumpClock = currentTime - self.jumpStartTime;
         self.element.position.y = self.jumpHeight * Math.sin(
            (1 / self.jumpDuration) * Math.PI * jumpClock) +
            sinusoid(2 * self.stepFreq, 0, 20, 0,
               self.jumpStartTime - self.runningStartTime);
         if (jumpClock > self.jumpDuration) {
            self.isJumping = false;
            self.runningStartTime += self.jumpDuration;
         }
      } else {
         var runningClock = currentTime - self.runningStartTime;
         self.element.position.y = sinusoid(
            2 * self.stepFreq, 0, 20, 0, runningClock);
         self.head.rotation.x = sinusoid(
            2 * self.stepFreq, -10, -5, 0, runningClock) * deg2Rad;
         self.torso.rotation.x = sinusoid(
            2 * self.stepFreq, -10, -5, 180, runningClock) * deg2Rad;
         self.leftArm.rotation.x = sinusoid(
            self.stepFreq, -70, 50, 180, runningClock) * deg2Rad;
         self.rightArm.rotation.x = sinusoid(
            self.stepFreq, -70, 50, 0, runningClock) * deg2Rad;
         self.leftLowerArm.rotation.x = sinusoid(
            self.stepFreq, 70, 140, 180, runningClock) * deg2Rad;
         self.rightLowerArm.rotation.x = sinusoid(
            self.stepFreq, 70, 140, 0, runningClock) * deg2Rad;
         self.leftLeg.rotation.x = sinusoid(
            self.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
         self.rightLeg.rotation.x = sinusoid(
            self.stepFreq, -20, 80, 180, runningClock) * deg2Rad;
         self.leftLowerLeg.rotation.x = sinusoid(
            self.stepFreq, -130, 5, 240, runningClock) * deg2Rad;
         self.rightLowerLeg.rotation.x = sinusoid(
            self.stepFreq, -130, 5, 60, runningClock) * deg2Rad;

         // If the character is not jumping, it may be switching lanes.
         if (self.isSwitchingLeft) {
            //self.element.position.x -= 200;

            var offset = self.currentLane * 800 - self.element.position.x;
            if (offset > -800) {
               self.currentLane -= 1;
               self.element.position.x = self.currentLane * 800;
               self.isSwitchingLeft = false;
            }

         }
         if (self.isSwitchingRight) {
            self.element.position.x += 200;
            var offset = self.element.position.x - self.currentLane * 800;
            if (offset > 800) {
               self.currentLane += 1;
               self.element.position.x = self.currentLane * 800;
               self.isSwitchingRight = false;
            }
         }
      }
   }

   /**
     * Handles character activity when the left key is pressed.
     */
   this.onLeftKeyPressed = function() {
      self.queuedActions.push("left");
   }

   /**
     * Handles character activity when the up key is pressed.
     */
   this.onUpKeyPressed = function() {
      self.queuedActions.push("up");
   }

   /**
     * Handles character activity when the right key is pressed.
     */
   this.onRightKeyPressed = function() {
      self.queuedActions.push("right");
   }

   /**
     * Handles character activity when the game is paused.
     */
   this.onPause = function() {
      self.pauseStartTime = new Date() / 1000;
   }

   /**
     * Handles character activity when the game is unpaused.
     */
   this.onUnpause = function() {
      var currentTime = new Date() / 1000;
      var pauseDuration = currentTime - self.pauseStartTime;
      self.runningStartTime += pauseDuration;
      if (self.isJumping) {
         self.jumpStartTime += pauseDuration;
      }
   }

}

function Character2() {

   // Explicit binding of this even in changing contexts.
   var self = this;

   // Character defaults that don't change throughout the game.
   this.skinColor = Colors.brown;
   this.hairColor = Colors.black;
   this.shirtColor = Colors.yellow;
   this.shortsColor = Colors.olive;
   this.jumpDuration = 0.6;
   this.jumpHeight = 2000;

   // Initialize the character.
   init();

   /**
     * Builds the character in depth-first order. The parts of are 
       * modelled by the following object hierarchy:
     *
     * - character (this.element)
     *    - head
     *       - face
     *       - hair
     *    - torso
     *    - leftArm
     *       - leftLowerArm
     *    - rightArm
     *       - rightLowerArm
     *    - leftLeg
     *       - rightLowerLeg
     *    - rightLeg
     *       - rightLowerLeg
     *
     * Also set up the starting values for evolving parameters throughout
     * the game.
     * 
     */
   function init() {

      // Build the character.
      self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
      self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
      self.head = createGroup(0, 260, -25);
      self.head.add(self.face);
      self.head.add(self.hair);

      self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

      self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -170, 0);
      self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
      self.leftArm.add(self.leftLowerArm);

      self.rightLowerArm = createLimb(
         20, 120, 30, self.skinColor, 0, -170, 0);
      self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
      self.rightArm.add(self.rightLowerArm);

      self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -200, 0);
      self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
      self.leftLeg.add(self.leftLowerLeg);

      self.rightLowerLeg = createLimb(
         40, 200, 40, self.skinColor, 0, -200, 0);
      self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
      self.rightLeg.add(self.rightLowerLeg);

      self.element = createGroup(0, 0, -4000);
      self.element.add(self.head);
      self.element.add(self.torso);
      self.element.add(self.leftArm);
      self.element.add(self.rightArm);
      self.element.add(self.leftLeg);
      self.element.add(self.rightLeg);

      // Initialize the player's changing parameters.
      self.isJumping = false;
      self.isSwitchingLeft = false;
      self.isSwitchingRight = false;
      self.currentLane = 0;
      self.runningStartTime = new Date() / 1000;
      self.pauseStartTime = new Date() / 1000;
      self.stepFreq = 2;
      self.queuedActions = [];

   }

   /**
    * Creates and returns a limb with an axis of rotation at the top.
    *
    * @param {number} DX The width of the limb.
    * @param {number} DY The length of the limb.
    * @param {number} DZ The depth of the limb.
    * @param {color} COLOR The color of the limb.
    * @param {number} X The x-coordinate of the rotation center.
    * @param {number} Y The y-coordinate of the rotation center.
    * @param {number} Z The z-coordinate of the rotation center.
    * @return {THREE.GROUP} A group that includes a box representing
    *                       the limb, with the specified properties.
    *
    */
   function createLimb(dx, dy, dz, color, x, y, z) {
       var limb = createGroup(x, y, z);
       var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
      var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
      limb.add(limbBox);
      return limb;
   }
   
   /**
    * A method called on the character when time moves forward.
    */
   this.update = function() {

      // Obtain the curren time for future calculations.
      var currentTime = new Date() / 1000;

      // Apply actions to the character if none are currently being
      // carried out.
      if (!self.isJumping &&
         !self.isSwitchingLeft &&
         !self.isSwitchingRight &&
         self.queuedActions.length > 0) {
         switch(self.queuedActions.shift()) {
            case "up":
               self.isJumping = true;
               self.jumpStartTime = new Date() / 1000;
               break;
            case "left":
               if (self.currentLane != -1) {
                  self.isSwitchingLeft = true;
               }
               break;
            case "right":
               if (self.currentLane != 1) {
                  self.isSwitchingRight = true;
               }
               break;
         }
      }

      // If the character is jumping, update the height of the character.
      // Otherwise, the character continues running.
      if (self.isJumping) {
         var jumpClock = currentTime - self.jumpStartTime;
         self.element.position.y = self.jumpHeight * Math.sin(
            (1 / self.jumpDuration) * Math.PI * jumpClock) +
            sinusoid(2 * self.stepFreq, 0, 20, 0,
               self.jumpStartTime - self.runningStartTime);
         if (jumpClock > self.jumpDuration) {
            self.isJumping = false;
            self.runningStartTime += self.jumpDuration;
         }
      } else {
         var runningClock = currentTime - self.runningStartTime;
         self.element.position.y = sinusoid(
            2 * self.stepFreq, 0, 20, 0, runningClock);
         self.head.rotation.x = sinusoid(
            2 * self.stepFreq, -10, -5, 0, runningClock) * deg2Rad;
         self.torso.rotation.x = sinusoid(
            2 * self.stepFreq, -10, -5, 180, runningClock) * deg2Rad;
         self.leftArm.rotation.x = sinusoid(
            self.stepFreq, -70, 50, 180, runningClock) * deg2Rad;
         self.rightArm.rotation.x = sinusoid(
            self.stepFreq, -70, 50, 0, runningClock) * deg2Rad;
         self.leftLowerArm.rotation.x = sinusoid(
            self.stepFreq, 70, 140, 180, runningClock) * deg2Rad;
         self.rightLowerArm.rotation.x = sinusoid(
            self.stepFreq, 70, 140, 0, runningClock) * deg2Rad;
         self.leftLeg.rotation.x = sinusoid(
            self.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
         self.rightLeg.rotation.x = sinusoid(
            self.stepFreq, -20, 80, 180, runningClock) * deg2Rad;
         self.leftLowerLeg.rotation.x = sinusoid(
            self.stepFreq, -130, 5, 240, runningClock) * deg2Rad;
         self.rightLowerLeg.rotation.x = sinusoid(
            self.stepFreq, -130, 5, 60, runningClock) * deg2Rad;

         // If the character is not jumping, it may be switching lanes.
         if (self.isSwitchingLeft) {
            self.element.position.x -= 200;
            var offset = self.currentLane * 800 - self.element.position.x;
            if (offset > 800) {
               self.currentLane -= 1;
               self.element.position.x = self.currentLane * 800;
               self.isSwitchingLeft = false;
            }
         }
         if (self.isSwitchingRight) {
            self.element.position.x += 200;
            var offset = self.element.position.x - self.currentLane * 800;
            if (offset > 800) {
               self.currentLane += 1;
               self.element.position.x = self.currentLane * 800;
               self.isSwitchingRight = false;
            }
         }
      }
   }

   /**
     * Handles character activity when the left key is pressed.
     */
   this.onLeftKeyPressed = function() {
      self.queuedActions.push("left");
   }

   /**
     * Handles character activity when the up key is pressed.
     */
   this.onUpKeyPressed = function() {
      self.queuedActions.push("up");
   }

   /**
     * Handles character activity when the right key is pressed.
     */
   this.onRightKeyPressed = function() {
      self.queuedActions.push("right");
   }

   /**
     * Handles character activity when the game is paused.
     */
   this.onPause = function() {
      self.pauseStartTime = new Date() / 1000;
   }

   /**
     * Handles character activity when the game is unpaused.
     */
   this.onUnpause = function() {
      var currentTime = new Date() / 1000;
      var pauseDuration = currentTime - self.pauseStartTime;
      self.runningStartTime += pauseDuration;
      if (self.isJumping) {
         self.jumpStartTime += pauseDuration;
      }
   }

   this.onWKeyPressed = function() {
      cameraY += 200;
   };

   this.onSKeyPressed = function() {
      cameraY -= 200;
   };

   this.onAKeyPressed = function() {
      cameraX -= 200;
   };

   this.onDKeyPressed = function() {
      cameraX += 200;
   };

   this.onQKeyPressed = function() {
      cameraZ += 200;
   };

   this.onEKeyPressed = function() {
      cameraZ -= 200;
   };

   this.on1KeyPressed = function() {
      cameraX = -1200;
      cameraY = 500;
      cameraZ = -1500;

   };

   this.on2KeyPressed = function() {
      cameraX = -1000;
      cameraY = 3000;
      cameraZ = 3000;   
   };

   this.on3KeyPressed = function() {
      cameraX = -5000;
      cameraY = 3000;
      cameraZ = 3000;      
   };

   this.on4KeyPressed = function() {
      cameraX = 2500;
      cameraY = 3000;
      cameraZ = 3000;   
   };

   this.on5KeyPressed = function() {
      cameraX = -1100;
      cameraY = 1500;
      cameraZ = -1000;      
   };
}

/**
  * A collidable tree in the game positioned at X, Y, Z in the scene and with
  * scale S.
  */
function Tree(x, y, z, s) {

   // Explicit binding.
   var self = this;

   // The object portrayed in the scene.
   this.mesh = new THREE.Object3D();
    var top = createCylinder(1, 300, 300, 4, Colors.green, 0, 1000, 0);
    var mid = createCylinder(1, 400, 400, 4, Colors.green, 0, 800, 0);
    var bottom = createCylinder(1, 500, 500, 4, Colors.green, 0, 500, 0);
    var trunk = createCylinder(100, 100, 250, 32, Colors.brownDark, 0, 125, 0);
    this.mesh.add(top);
    this.mesh.add(mid);
    this.mesh.add(bottom);
    this.mesh.add(trunk);
    this.mesh.position.set(x, y, z);
   this.mesh.scale.set(s, s, s);
   this.scale = s;

   /**
    * A method that detects whether this tree is colliding with the character,
    * which is modelled as a box bounded by the given coordinate space.
    */
    this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
       var treeMinX = self.mesh.position.x - this.scale * 250;
       var treeMaxX = self.mesh.position.x + this.scale * 250;
       var treeMinY = self.mesh.position.y - this.scale * 1150;
       var treeMaxY = self.mesh.position.y + this.scale * 1150;
       var treeMinZ = self.mesh.position.z - this.scale * 250;
       var treeMaxZ = self.mesh.position.z + this.scale * 250;
       return treeMinX <= maxX && treeMaxX >= minX
          && treeMinY <= maxY && treeMaxY >= minY
          && treeMinZ <= maxZ && treeMaxZ >= minZ;
    }

}

/** 
 *
 * UTILITY FUNCTIONS
 * 
 * Functions that simplify and minimize repeated code.
 *
 */

/**
 * Utility function for generating current values of sinusoidally
 * varying variables.
 *
 * @param {number} FREQUENCY The number of oscillations per second.
 * @param {number} MINIMUM The minimum value of the sinusoid.
 * @param {number} MAXIMUM The maximum value of the sinusoid.
 * @param {number} PHASE The phase offset in degrees.
 * @param {number} TIME The time, in seconds, in the sinusoid's scope.
 * @return {number} The value of the sinusoid.
 *
 */
function sinusoid(frequency, minimum, maximum, phase, time) {
   var amplitude = 0.5 * (maximum - minimum);
   var angularFrequency = 2 * Math.PI * frequency;
   var phaseRadians = phase * Math.PI / 180;
   var offset = amplitude * Math.sin(
      angularFrequency * time + phaseRadians);
   var average = (minimum + maximum) / 2;
   return average + offset;
}

/**
 * Creates an empty group of objects at a specified location.
 *
 * @param {number} X The x-coordinate of the group.
 * @param {number} Y The y-coordinate of the group.
 * @param {number} Z The z-coordinate of the group.
 * @return {Three.Group} An empty group at the specified coordinates.
 *
 */
function createGroup(x, y, z) {
   var group = new THREE.Group();
   group.position.set(x, y, z);
   return group;
}

/**
 * Creates and returns a simple box with the specified properties.
 *
 * @param {number} DX The width of the box.
 * @param {number} DY The height of the box.
 * @param {number} DZ The depth of the box.
 * @param {color} COLOR The color of the box.
 * @param {number} X The x-coordinate of the center of the box.
 * @param {number} Y The y-coordinate of the center of the box.
 * @param {number} Z The z-coordinate of the center of the box.
 * @param {boolean} NOTFLATSHADING True iff the flatShading is false.
 * @return {THREE.Mesh} A box with the specified properties.
 *
 */
function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var mat = new THREE.MeshPhongMaterial({
      color:color, 
       flatShading: notFlatShading != true
    });
    var box = new THREE.Mesh(geom, mat);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
}

/**
 * Creates and returns a (possibly asymmetrical) cyinder with the 
 * specified properties.
 *
 * @param {number} RADIUSTOP The radius of the cylinder at the top.
 * @param {number} RADIUSBOTTOM The radius of the cylinder at the bottom.
 * @param {number} HEIGHT The height of the cylinder.
 * @param {number} RADIALSEGMENTS The number of segmented faces around 
 *                                the circumference of the cylinder.
 * @param {color} COLOR The color of the cylinder.
 * @param {number} X The x-coordinate of the center of the cylinder.
 * @param {number} Y The y-coordinate of the center of the cylinder.
 * @param {number} Z The z-coordinate of the center of the cylinder.
 * @return {THREE.Mesh} A box with the specified properties.
 */
function createCylinder(radiusTop, radiusBottom, height, radialSegments, 
                  color, x, y, z) {
    var geom = new THREE.CylinderGeometry(
       radiusTop, radiusBottom, height, radialSegments);
    var mat = new THREE.MeshPhongMaterial({
       color: color,
       flatShading: true
    });
    var cylinder = new THREE.Mesh(geom, mat);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.position.set(x, y, z);
    return cylinder;
}
