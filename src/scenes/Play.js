class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
    //#region << CLASS PROPERTIES >>
    this.stateCooldown = false; // Cooldown state
    this.eyeDelta = 575;
    this.pupilDelta = 750;
    this.wholeEyeDuration = 300;
    this.CD ={ 
      NORTH: 'north',
      WEST: 'west',
      SOUTH: 'south',
      EAST: 'east',
    }
    this.minimapActive = false; // Flag to indicate if minimap is active or not
    this.cooldownDuration = 200; // Cooldown duration in milliseconds (0.2 seconds)
    this.lastSpacePressTime = 0; // Timestamp of the last space key press
    this.queue = [];
    //#endregion
  }

  preload(){

    //#region << DEFINE KEYS >>
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    //#endregion

    //#region << LOADING HOTEL AND EYE IMAGES >>
    // << EYE ELEMENTS >>
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
    //#region << HOTEL ELEMENTS >> 
    this.load.image('deadend', './assets/hotel/deadend.png');
    this.load.image('door', './assets/hotel/door.png');
    this.load.image('roomDoor','./assets/hotel/roomDoor.png');
    this.load.image('intersection', './assets/hotel/intersection.png');
    //#region << HALLWAY VAR >>
    this.load.image('hallwayRoomDoor','./assets/hotel/hallwayRoomDoor.png');
    this.load.image('hallway0', './assets/hotel/hallway0.png');
    this.load.image('hallway1', './assets/hotel/hallway1.png');
    this.load.image('hallway2', './assets/hotel/hallway2.png');
    this.load.image('hallway3', './assets/hotel/hallway3.png');
    this.load.image('hallway4', './assets/hotel/hallway4.png');
    this.load.image('hallway5', './assets/hotel/hallway5.png');
    this.load.image('hallway6', './assets/hotel/hallway6.png');
    this.load.image('hallway7', './assets/hotel/hallway7.png');
    this.load.image('hallway8', './assets/hotel/hallway8.png');
    this.load.image('hallway9', './assets/hotel/hallway9.png');
    //#endregion
    //#endregion
    //#region << HEDGE ELEMENTS >>
    this.load.image('hedgeDeadEnd', './assets/hedge/hedgeDeadEnd');
    this.load.image('hedgeEnd', './assets/hedge/hedgeEnd');
    this.load.image('hedgeIntersection', './assets/hedge/hedgeIntersection');
    this.load.image('hedgeWall', './assets/hedge/hedgeWall');
    this.load.image('hedgeHallway0', './assets/hedge/hedgeHallway0.png');
    this.load.image('hedgeHallway1', './assets/hedge/hedgeHallway1.png');
    this.load.image('hedgeHallway2', './assets/hedge/hedgeHallway2.png');
    //#endregion
    // << MAP ELEMENTS >>
    this.load.image('brownBackground', './assets/ui/brownBackground.png');
    this.load.image('blue', './assets/ui/blueMap.png');
    //#endregion

    //#region >> EYE STATE MACHINE >>
    this.eyeState = { //state machine for eye orientation
      LEFT: {
        name: 'left',
        enter: () => {
          console.log("Entered Left");
          this.currEyeState = this.eyeState.LEFT; 
        },
        update: () => {
          if(this.space()){ //if space is pressed change the cardinal direction based on current position
            this.changeCardinalDirection(this.playerConfig.cardDirec, this.leftOrRight = 0);
            this.displayImage(this.playerConfig.cardDirec);
            this.moveEyeRight();
            this.eyeState.FORWARD.enter();
            // NEED TO ADD : change eye state & move back to middle & update state to forward
          }
        },
      },
      RIGHT: {
        name: 'right',
        enter: () => {
          // set currEyeState to be this state
          console.log("Entered right");
          this.currEyeState = this.eyeState.RIGHT;
        },
        update: () => {
          // check input for switches
          if(this.space()){//if space is pressed change the cardinal direction based on current position
            this.changeCardinalDirection(this.playerConfig.cardDirec, this.leftOrRight = 1);
            this.displayImage(this.playerConfig.cardDirec);
            this.moveEyeLeft();
            this.eyeState.FORWARD.enter();
            // NEED TO ADD : change eye state & move back to middle & update state to forward
          }
        },
      },
      FORWARD: {
        name: 'forward',
        enter: () => {
          console.log("Enter forward");
          //set currEyeState to be this state
          this.currEyeState = this.eyeState.FORWARD;
          
        },
        update: () => {
          // check input for switches
        }
      },
    }
    //#endregion

    this.eyeState.FORWARD.enter();
    
  }

  create(){    
    
    //#region << THE HOTEL MAP >>
    this.hotelMap = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
    console.log("rows: " + this.hotelMap.length + " colums: " + this.hotelMap[0].length);
    this.hotel = new Graph();
    this.hotel.buildGraph(this.hotelMap);
    this.hotel.printGraph();
    //#endregion

    //#region <<SPACE BAR TIMER >>
    // Create a Phaser Time Event for the space key cooldown
    this.spaceCooldownEvent = this.time.addEvent({
      delay: this.cooldownDuration,
      callback: this.onSpaceCooldownComplete,
      callbackScope: this,
      loop: false,
    });
    //#endregion


    //#region << THE HEDGE MAZE MAP >>
    /*
    this.hedgeMap = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
    this.hedge = new Graph(this, this.hedgeMap);
    */
    //#endregion

    //this.hotel.displayGraph(this, 100, 100, 100);

    //#region << IMAGES FOR TESTING >>
    this.add.image(0,0,'hallway').setOrigin(0,0);
    this.eye = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil1').setScale(.75);
    this.pupil = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil_alone').setScale(.75);

    this.eye.setOrigin(0.5); // Adjust the anchor point of the sprites to the center
    this.pupil.setOrigin(0.5);

    this.eye.setDepth(2);
    this.pupil.setDepth(2);
    //#endregion

    //#region << ANIMS >>
    this.anims.create({
      key: 'blink182',
      frames: this.anims.generateFrameNames('shining_atlas', { 
          prefix: "pupil",
          start: 2, 
          end: 4, 
      }),
      showOnStart: true,
      hideOnComplete: true,
      frameRate: 20,
      yoyo:true

    });
    //#endregion

    this.playerConfig={
      node: this.hotel.getNode(0,5), //set player's location
      cardDirec: this.CD.SOUTH, //cardinal direction
      //imageDisplay: currImage, //& image display
    }
    this.displayImage(this.playerConfig.cardDirec);
  }

  update(){

    if (Phaser.Input.Keyboard.JustDown(keyM)) {
      this.minimapActive = !this.minimapActive; // Toggle the minimap state
      if (this.minimapActive) {
        this.drawMinimap(); // Draw the minimap
      } else {
        this.destroyMinimap();
      }
    }

    // If the minimap is active, prevent other inputs from affecting the scene
    if (this.minimapActive) {
      return;
    }

    this.currEyeState.update();
    this.readInput();
    
  }

  //#region << HELPER FUNCTIONS FOR THE EYE >>

  //EYE JJIGGG I FALL I WIGGLE WIGGLE FO SHORE 
  moveEyeForward(){
    if(this.stateCooldown){
      return; // Exit if currently in cooldown
    }
    this.stateCooldown = true;  // Set the cooldown state to true
    this.eye.setVisible(false); // hide the current eye
    this.pupil.setVisible(false); // hide the current pupil
    this.add.sprite(this.eye.x,this.eye.y).play('blink182').setScale(0.5); // play blink

    this.time.delayedCall(this.wholeEyeDuration, function() { // cooldown time
      this.eye.setVisible(true);  // show eye
      this.pupil.setVisible(true); // show pupil
      this.stateCooldown = false; // set cooldown to false
    }, [], this);
   
  }
  moveEyeRight(){//moves eye right
    if (this.stateCooldown) {
      return; // Exit if currently in cooldown
    }
    this.stateCooldown = true; // Set the cooldown state to true

    let eyeRight = this.tweens.add({ //animation for the eye
      targets: this.eye,
      x: this.eye.x+=this.eyeDelta,
      ease: 'Linear',
      duration: this.wholeEyeDuration,
      repeat: 0,
      paused: true,
      onStart: () => {
        pupilRight.play();
      },
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }
    });
    let pupilRight = this.tweens.add({ //animation for the pupil
      targets: this.pupil,
      x: this.pupil.x +=this.pupilDelta,
      ease:'Linear',
      duration:this.wholeEyeDuration,
      repeat: 0,
      paused:true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }  
    });
    eyeRight.play();    
  }
  
  moveEyeLeft(){
    if (this.stateCooldown) {
      return; // Exit the function if currently in cooldown
    }
    this.stateCooldown = true; // Set the cooldown state to true

    let eyeLeft = this.tweens.add({
      targets: this.eye,
      x: this.eye.x-=this.eyeDelta,
      ease: 'Linear',
      duration: this.wholeEyeDuration,
      repeat: 0,
      paused: true,
      onStart: () => {
        pupilLeft.play();
      },
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }    
    });

    let pupilLeft = this.tweens.add({
      targets: this.pupil,
      x: this.pupil.x-=this.pupilDelta,
      ease:'Linear',
      duration:this.wholeEyeDuration,
      repeat: 0,
      paused:true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }  
    });
    eyeLeft.play();
  }
  //#endregion
  
  //#region << INPUT READERS >>
  space() {//returns true if space bar
    if (Phaser.Input.Keyboard.JustDown(keySPACE) && !this.stateCooldown/*&& this.spaceCooldownEvent.getElapsed() === 0*/) {
      //this.spaceCooldownEvent.reset({ delay: this.cooldownDuration });
      return true;
    }
    return false;
  }
  
  readInput(){
    if(this.stateCooldown){
      return;
    }
    if(this.currEyeState == this.eyeState.FORWARD && keyLEFT.isDown) // if forward and "<-" go to the left
    {
      console.log("in forward go left");
      this.moveEyeLeft();
      this.eyeState.LEFT.enter(); // update sprite position and curr state.
    }
    
    if(this.currEyeState == this.eyeState.FORWARD && keyRIGHT.isDown) // if forward & "->" go to the right
    {
      console.log("in forward go right");
      this.moveEyeRight(); //update sprite
      this.eyeState.RIGHT.enter(); // update state
    }
    if(this.currEyeState == this.eyeState.FORWARD && keySPACE.isDown && this.hotel.getNeighborRoomType(this.playerConfig.node, this.playerConfig.cardDirec)) // if forward and the "SPACE" UPDATE PLAYER LOCATION
    {
      this.movePlayer();
      this.displayImage();
      //MOVE EYE FORWARD FYUNCTION TRHAT DOES JIGGLE ANIMATION CALL GO HEREREJIEWRJUBHIKRUHJHUIJALR
      this.moveEyeForward();
    }

    if(this.currEyeState == this.eyeState.LEFT && keyRIGHT.isDown) //if left & "->" go forward
    {
      this.moveEyeRight(); //update sprite
      this.eyeState.FORWARD.enter(); //update state
    }
    
    if(this.currEyeState == this.eyeState.RIGHT && keyLEFT.isDown) //if right & "<-" go forward
    {
      this.moveEyeLeft(); //update sprite
      this.eyeState.FORWARD.enter(); //update state
    }
  }
  //#endregion

  //#region << IMAGE DISPLAY >>
  displayImage(){
    this.currRoomType = this.hotel.getNeighborRoomType(this.playerConfig.node, this.playerConfig.cardDirec);
    if(this.currImage){
      this.prevImage = this.currImage; 
    }
    console.log("currRoomType: " + this.currRoomType);
    switch(this.currRoomType){
      case null:
        console.log("roomtype = null  :((((");
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'door');
        break;
      case 0: //EMPTY (door)
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'door');
        break;
      case 1: //INTER
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'intersection');
        break;
      case 2: //HALLWAY
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'hallway');
        break;
      case 3: //DEAD_END
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'deadend');
        break;
    }
    this.currImage.setDepth(0);
    if(this.prevImage){
      this.prevImage.destroy();
    }
  }
  //#endregion

  //#region << MINI MAP >>
  drawMinimap() {
    this.squareList = [];
    this.minimapSize = 64; // Size of each square in the minimap
    const alphaStep = 1 / this.queue.length; // Step for decrementing alpha
  
    console.log("Entering drawMinimap");
  
    // Create the background image
    this.createBackground();
    console.log("Added background image");
  
    // Create a new queue without duplicates
    const newQueue = [];
    const visitedNodes = new Set();
  
    // Iterate over the queue nodes
    for (let i = this.queue.length - 1; i >= 0; i--) {
      const node = this.queue[i];
      const nodeKey = `${node.index[0]},${node.index[1]}`;
  
      // Check if the node has already been visited
      if (!visitedNodes.has(nodeKey)) {
        visitedNodes.add(nodeKey);
        newQueue.unshift(node);
      }
    }
  
    // Iterate over the new queue nodes
    newQueue.forEach((node, index) => {
      const row = node.index[0];
      const col = node.index[1];
      console.log(`Node index: row=${row}, col=${col}`);
  
      const x = col * this.minimapSize;
      const y = row * this.minimapSize;
      console.log(`Image position: x=${x}, y=${y}`);
      const alpha = 1 - index * alphaStep;
  
      // Create an image with the appropriate alpha
      const image = this.add.image(x, y, 'blue').setDepth(5);
      image.setOrigin(0, 0);
      image.setDisplaySize(this.minimapSize, this.minimapSize);
      image.setAlpha(alpha);
  
      this.squareList.push(image);
  
      console.log(`Added blue image at (${x}, ${y}) with alpha ${alpha}`);
    });
  }
  
  
  destroyMinimap(){
    this.squareList.forEach((square) => {
      square.destroy();
    });
  
    // Clear the squareList array
    this.squareList = [];
    this.background.destroy();
  }


  createBackground(){
    this.background = this.add.image(screen.center.x,screen.center.y, 'brownBackground').setDepth(3);
    this.background.setVisible(true);
    this.background.setOrigin(0.5,0.5);
  }
  //#endregion

  //#region << PLAYER HELPER FUNCTIONS >>
  movePlayer(){
    this.playerConfig.node=this.hotel.getNeighborInDirection(this.playerConfig.node, this.playerConfig.cardDirec)
    this.hotel.printGraphAsMatrix(this.playerConfig.node);
    // Add the newly moved node to the back of the queue
    this.queue.push(this.playerConfig.node);
    // Check if the queue has reached its maximum length
    if (this.queue.length > 20) {
      // Remove the front element of the queue
      this.queue.shift();
    }
  }
  
  
  changeCardinalDirection(currCardDirection, leftOrRight){
    //given the current cardinal direction & if the movement changes player's curr cardinal direction
    if(leftOrRight == 1){ //GOING RIGHT
        // if N -> E
        if(currCardDirection == this.CD.NORTH){
            console.log("EAST");
            this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> S
        if(currCardDirection == this.CD.EAST){
            console.log("SOUTH");
            this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> W
        if(currCardDirection == this.CD.SOUTH){
            console.log("WEST");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> N
        if(currCardDirection == this.CD.WEST){
            console.log("NORTH");
            this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
    if(leftOrRight == 0){ //GOING LEFT
        // if N -> W
        if(currCardDirection == this.CD.NORTH){
            console.log("WEST");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> S
        if(currCardDirection == this.CD.WEST){
          console.log("SOUTH");
          this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> E
        if(currCardDirection == this.CD.SOUTH){
          console.log("EAST");
          this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> N
        if(currCardDirection == this.CD.EAST){
          console.log("NORTH");
          this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
  }
  //#endregion
 
}