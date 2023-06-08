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
    this.mapsActive = false; // Flag to indicate if minimap is active or not
    this.cooldownDuration = 300; // Cooldown duration in milliseconds (0.2 seconds)
    this.lastSpacePressTime = 0; // Timestamp of the last space key press
    this.queue = [];
    this.compassGrid = [];
    this.inCooldown = false;
    this.squareListMap = [];
    this.squareListMiniMap = [];
    this.jackAnimTimerDuration = 10*1000;
    this.jackAnimDifference = 10*1000;
    this.deathDifferenceDuration= 5*1000;
    this.currentDeathAnimation = null;
    this.memoryQueue = [];
    this.visitedNodes = new Set();
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

    //#region << LOADING HOTEL, HEDGE, AND EYE IMAGES >>
    // << EYE ELEMENTS >>
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
    //#region << HOTEL ELEMENTS >> 
    this.load.image('deadend0', './assets/hotel/deadend0.png');
    this.load.image('deadend1', './assets/hotel/deadend1.png');
    this.load.image('deadend2', './assets/hotel/deadend2.png');
    this.load.image('deadend3', './assets/hotel/deadend3.png');
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
    this.load.image('hedgeDeadEnd0', './assets/hedge/hedgeDeadEnd0');
    this.load.image('hedgeDeadEnd1','./assets/hedge/hedgeDeadEnd1');
    this.load.image('hedgeDeadEnd2','./assets/hedge/hedgeDeadEnd2');
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
    this.load.image('tan', './assets/ui/tanSmall.png');
    this.load.image('tanBackground', './assets/ui/tanBackground.png');
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
    
    //#region << GAME VIEW STATE MACHINE >> 
    this.upAndDownArrowCoolDown = this.time.addEvent({
      delay: this.cooldownDuration,
      callback: this.onSpaceCooldownComplete,
      callbackScope: this,
      loop: false,
      onComplete: this.inCooldown = false,
    });

    this.gameState = {
      ROOMS: {
        name: 'room',
        enter: () => {
          this.currentGameState = this.gameState.ROOMS;
          this.destroyMiniMap();
          this.destroyBackground();
          this.mapsActive = false;
          this.upAndDownArrowCoolDown = this.time.addEvent({
            delay: this.cooldownDuration,
            callback: this.onSpaceCooldownComplete,
            callbackScope: this,
            loop: false,
            onComplete: this.inCooldown = false,
          });
          console.log("ENTERED ROOMS STATE");
        },
        update: () => {
          //console.log("this.inCooldown: " +this.inCooldown);
          if (this.upAndDownArrowCoolDown.getProgress() === 1 && keyUP.isDown) {
            this.gameState.MINIMAP.enter();
          }
          //if up arrow enter MINIMAP state
        },
      },
      MINIMAP: {
        name: 'miniMap',
        enter: () => {
          this.currentGameState = this.gameState.MINIMAP;
          this.drawMinimap();
          this.destroyMap();
          this.mapsActive = true;
          this.inCooldown = true;
          this.upAndDownArrowCoolDown = this.time.addEvent({
            delay: this.cooldownDuration,
            callback: this.onSpaceCooldownComplete,
            callbackScope: this,
            loop: false,
          });
          console.log("ENTERED MINIMAP STATE");
        },
        update: () => {
          if (this.upAndDownArrowCoolDown.getProgress() === 1 && keyUP.isDown) {
            this.gameState.MAP.enter();
          } else if (this.upAndDownArrowCoolDown.getProgress() === 1 && keyDOWN.isDown) {
            this.gameState.ROOMS.enter();
          }
        },
      },
      MAP: {
        name: 'map',
        enter: () => {
          this.currentGameState = this.gameState.MAP;
          this.drawMap();
          this.destroyMiniMap();
          this.inCooldown = true;
          this.upAndDownArrowCoolDown = this.time.addEvent({
            delay: this.cooldownDuration,
            callback: this.onSpaceCooldownComplete,
            callbackScope: this,
            loop: false,
            onComplete: this.inCooldown = false,
          });
          console.log("ENTERED MAP STATE");
        },
        update: () => {
          if (this.upAndDownArrowCoolDown.getProgress() === 1 && keyDOWN.isDown) {
            this.gameState.MINIMAP.enter();
          }
        },
      }
    };
    
    this.gameState.ROOMS.enter();
    //#endregion 
    //this.upAndDownArrowCoolDown = null;
  }

  create(){    
    
    //#region << THE HOTEL MAP >>
    this.hotelMap = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //0
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //1
      [0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0], //2
      [0,0,0,0,0,0,0,0,0,0,0,0,0,13,14,0,0,0,0,1,9,8,1,2,0,0,0,0,0,0,0,0], //3
      [0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,0,0,6,0,0,5,0,0,0,0,0,0,0,0,0], //4
      [0,0,0,0,0,0,0,0,2,1,5,9,8,1,4,5,3,7,5,1,2,0,9,0,0,0,0,0,0,0,0,0], //5
      [0,0,2,0,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,7,0,0,8,0,0,0,0,0,0,0,0,0], //6
      [0,2,1,4,12,3,6,7,9,1,2,0,2,1,6,10,7,2,4,1,0,0,4,0,2,0,0,0,2,0,0,0], //7
      [0,0,4,0,0,0,2,0,0,6,0,0,0,4,0,0,0,0,0,0,0,0,1,3,1,6,3,7,1,2,0,0], //8
      [0,0,7,0,0,2,1,8,5,1,2,0,0,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0], //9
      [0,0,8,0,0,0,9,0,0,3,0,0,0,5,0,0,0,0,0,0,0,0,0,0,5,0,0,0,5,0,0,0], //10
      [0,0,9,0,0,2,1,2,0,8,0,0,0,9,0,0,0,0,0,0,0,0,0,0,3,0,0,0,6,0,0,0], //11
      [0,0,6,0,0,0,2,0,0,1,5,7,6,1,8,10,5,7,1,3,4,3,6,3,1,2,0,0,3,0,0,0],//12
      [0,0,8,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2,0,0,0,8,0,0,0], //13
      [0,0,4,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,11,0,0,0],//14
      [0,2,1,7,4,8,9,5,6,1,2,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,4,0,0,0], //15
      [0,0,2,0,0,0,0,0,0,9,0,0,0,0,1,6,8,12,1,0,0,0,0,0,0,0,0,0,3,0,0,0],//16
      [0,0,0,0,0,0,0,0,2,1,6,11,0,0,9,0,0,0,7,0,0,0,0,0,0,0,0,0,7,0,0,0],//17
      [0,0,0,0,0,0,0,0,0,8,0,0,0,0,7,0,0,0,9,0,0,0,0,0,0,0,0,0,9,0,0,0], //18
      [0,0,0,0,0,0,0,0,0,6,0,0,0,2,1,3,9,6,1,2,0,0,0,0,0,0,0,0,3,0,0,0], //19
      [0,0,0,0,0,0,0,0,0,4,0,0,0,0,2,0,0,0,3,0,0,0,0,2,0,0,0,0,6,0,0,0], //20
      [0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,2,1,4,3,6,5,1,7,3,6,12,1,2,0,0],//21
      [0,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,2,0,0,0,4,0,0,0,0,2,0,0,0], //22
      [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0], //23
      [0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0], //24
      [0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,2,0,0,0,5,0,0,0,0,0,0,0,0], //25
      [0,0,0,0,0,0,0,0,2,1,3,4,5,12,9,6,3,8,7,1,2,0,0,7,0,0,0,0,0,0,0,0],//26
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,12,0,0,0,0,0,0,0,0],//27
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,8,0,0,0,0,0,0,0,0],//28
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,6,0,0,0,0,0,0,0,0], //29
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,3,7,9,1,0,0,0,0,0,0,0,0], //30
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0], //31   
    ]
    //console.log("rows: " + this.hotelMap.length + " colums: " + this.hotelMap[0].length);
    this.hotel = new Graph();
    this.hotel.buildGraph(this.hotelMap);
    this.hotel.printGraph();
    //#endregion

    //#region << THE HEDGE MAZE MAP >>
    /*
    this.hedgeMap = [
      [0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,2,8,1,7,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
    this.add.image(0,0,'hallway0').setOrigin(0,0);
    this.eye = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil1').setScale(.75);
    this.pupil = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil_alone').setScale(.75);

    this.eye.setOrigin(0.5); // Adjust the anchor point of the sprites to the center
    this.pupil.setOrigin(0.5);

    this.eye.setDepth(depth.eye);
    this.pupil.setDepth(depth.eye);
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
      yoyo:true,

    });

    // DEATH ANIMATIONS / JACK IS NEAR
    this.anims.create({
      key: 'heartbeat1',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 1,
        end: 2
      }),
      yoyo: true,
      frameRate: 20
    });

    this.anims.create({
      key: 'heartbeat2',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 3,
        end: 4
      }),
      yoyo: true,
      frameRate: 20
    });

    this.anims.create({
      key: 'heartbeat3',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 4,
        end: 6
      }),
      frameRate: 20
    });

    //#endregion

    //#endregion
    
    this.playerConfig={
      node: this.hotel.getNode(31,19), //set player's location
      cardDirec: this.CD.NORTH, //cardinal direction
      //imageDisplay: currImage, //& image display
    }
    // Add delayed calls to the list
    this.jackAnim0Timer = this.time.delayedCall(this.jackAnimTimerDuration, function JAT0() {
      // PLAY ANIMATION
      console.log("playing anim 1");
    }, [], this);
    this.jackAnim1Timer =  this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference, function JAT1()  {
      // PLAY ANIMATION
      console.log("playing anim 2");
    }, [], this);
    this.deathAnimTimer = this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference + this.deathDifferenceDuration, function DAT() {
      console.log("playing death");
      // YOU DIED SCREEN
    }, [], this);

    this.createCompassGrid(this.playerConfig.cardDirec);
    this.movePlayer();
    this.displayImage(this.playerConfig.cardDirec);
  }

  update(){
    this.currentGameState.update();

    if (this.mapsActive) {// If the maps are active, prevent other inputs from affecting the scene
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
      case 2: //DEAD_END
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'deadend0');
        break;
      case 13:
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'hallwayRoomDoor');
        break;
      case 14:
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'roomDoor');
        break;
      default:
        this.currHallwayImageString = 'hallway'+((this.currRoomType-3).toString());
        this.currImage = this.add.image(screen.center.x, screen.center.y, this.currHallwayImageString);
        console.log(this.currHallwayImageString);
        console.log(this.currRoomType-3);
        console.log('hallway'+(this.currRoomType-3).toString());
        break;
    }
    this.currImage.setDepth(0);
    if(this.prevImage){
      this.prevImage.destroy();
    }
  }
  //#endregion

  //#region << MAPS >>
  drawMinimap() {
    this.squareListMiniMap = [];
    this.minimapSize = 64; // Size of each square in the minimap
    const alphaStep = 1 / this.queue.length; // Step for decrementing alpha
  
    // Create the background image
    this.createBackground('tanBackground');  
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
      const image = this.add.image(x, y, 'blue').setDepth(depth.miniMapSquares);
      image.setOrigin(0, 0);
      image.setDisplaySize(this.minimapSize, this.minimapSize);
      image.setAlpha(alpha);
  
      this.squareListMiniMap.push(image);
    });
  }
  
  drawMap(){
    this.squareListMap = [];
    this.minimapSize = 64; // Size of each square in the minimap
    this.createBackground('brownBackground');
    for (let row = 0; row < this.hotel.numRows; row++) {
      for (let col = 0; col < this.hotel.numCols; col++) {
        const index = [row, col].toString();
        const currentNode = this.hotel.nodes.get(index);
        if(currentNode.isVal()){
          const x = col * this.minimapSize;
          const y = row * this.minimapSize;
          //console.log(`Image position: x=${x}, y=${y}`);
          const image = this.add.image(x, y, 'tan').setDepth(5);
          image.setOrigin(0, 0);
          image.setDisplaySize(this.minimapSize, this.minimapSize);
          this.squareListMap.push(image);
          //image.setAlpha(alpha);
          //calculate where node should be
          //add square image at coordinates
          //add image to array
        }
      }
    }
  }
  createBackground(color){
    if(this.background){ this.background.destroy(); }
    this.background = this.add.image(screen.center.x,screen.center.y, color).setDepth(depth.miniMapBackground);
    this.background.setVisible(true);
    this.background.setOrigin(0.5,0.5);
    console.log("creating background: " +color);
  }
  destroyMiniMap() {
    if (this.squareListMiniMap.length === 0) {
      return;
    }
    this.squareListMiniMap.forEach((square) => {
      square.destroy();
    });
    this.squareListMiniMap = [];
    //this.destroyBackground();
    console.log("destroyed minimap background");
  }
  
  destroyMap() {
    if (this.squareListMap.length === 0) {
      return;
    }
    this.squareListMap.forEach((square) => {
      square.destroy();
    });
    this.squareListMap = [];
    //this.destroyBackground();
    console.log("destroyed map background");
  }

  destroyBackground(){
    if(this.background){ this.background.destroy(); }
  }
  createCompassGrid(facingDirection, availableDirections) {
    const gridSize = 3;
    const gridAlpha = 0.5;
  
    const centerX = game.config.width / 2;
    const centerY = game.config.height / 2 - 800;
  
    const gridX = centerX - gridSize * 32;
    const gridY = centerY - gridSize * 32;
  
    // Create the compass grid
    for (let row = 0; row < gridSize; row++) {
      this.compassGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const offsetX = col * 64;
        const offsetY = row * 64;
  
        const imageX = gridX + offsetX;
        const imageY = gridY + offsetY;
  
        if (row === 1 && col === 1) {
          // Center square
          this.compassGrid[row][col] = this.add.image(imageX, imageY, 'blue').setDepth(3).setAlpha(1);
        } else {
          this.compassGrid[row][col] = this.add.image(imageX, imageY, 'blue').setDepth(3).setAlpha(0);
        }
      }
    }
  
    //return this.compassGrid;
  }
  
  updateCompassGrid(facingDirection, availableDirections) {
    const gridSize = 3;
    const gridAlpha = 0.5;
  
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const image = this.compassGrid[row][col];
  
        if (row === 1 && col === 1) {
          // Center square
          image.setAlpha(1);
        } else {
          const direction = this.getDirectionFromGridOffset(facingDirection, row - 1, col - 1);
  
          if (availableDirections.includes(direction)) {
            // Available direction
            image.setAlpha(gridAlpha);
          } else {
            // Unavailable direction
            image.setAlpha(0);
          }
        }
      }
    }
  }
  
  getDirectionFromGridOffset(facingDirection, rowOffset, colOffset) {
    const directionMapping = {
      [this.CD.NORTH]: {
        rowOffset: -1,
        colOffset: 0,
      },
      [this.CD.WEST]: {
        rowOffset: 0,
        colOffset: -1,
      },
      [this.CD.SOUTH]: {
        rowOffset: 1,
        colOffset: 0,
      },
      [this.CD.EAST]: {
        rowOffset: 0,
        colOffset: 1,
      },
    };
  
    for (const direction in directionMapping) {
      const { rowOffset: expectedRowOffset, colOffset: expectedColOffset } = directionMapping[direction];
  
      if (rowOffset === expectedRowOffset && colOffset === expectedColOffset) {
        return direction;
      }
    }
  
    return null;
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
    this.visitIncrementor(this.playerConfig.node);
    this.updateCompassGrid(this.playerConfig.cardDirec, this.playerConfig.node.availableDirections());
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
    this.updateCompassGrid(this.playerConfig.cardDirec, this.playerConfig.node.availableDirections());
  }

  visitIncrementor(node) {
    const nodeIndex = node.getIndex();
  
    if (this.memoryQueue.includes(nodeIndex)) {
      return; // Skip adding to visitedNodes and incrementing visitCounter
    }
    
    if (!this.visitedNodes.has(nodeIndex)) {
      this.visitedNodes.add(nodeIndex);
      this.memoryQueue.push(nodeIndex); 
    }
    if (this.memoryQueue.length > 5) {
      this.memoryQueue.shift(); // Remove the oldest element from the queue
    }
    this.visitCounter++;
    this.restartAllDelayedCalls();
    //reset all delayed calls
  }

  restartAllDelayedCalls() {
    this.jackAnim0Timer.remove();
    this.jackAnim1Timer.remove();
    this.deathAnimTimer.remove();
    
    this.jackAnim0Timer = this.time.delayedCall(this.jackAnimTimerDuration, () => {
      // PLAY ANIMATION
      console.log("playing anim 1");
    }, [], this);
    this.jackAnim1Timer =  this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference, () => {
      // PLAY ANIMATION
      console.log("playing anim 2");
    }, [], this);
    this.deathAnimTimer = this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference + this.deathDifferenceDuration, () => {
      console.log("playing death");
      // YOU DIED SCREEN
    }, [], this);
    console.log("resetting anim timers");
  }
  //#endregion
 
}