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
    this.jackAnimTimerDuration = 20*1000;
    this.jackAnimDifference = 5*1000;
    this.deathDifferenceDuration= 5*1000;
    this.currentDeathAnimation = null;
    this.memoryQueue = [];
    this.visitedNodes = new Set();

    this.textCrawlActive = false;
    this.textCrawlSpeed = 75;
    this.currentTextIndex = 0; // Index of the current character being displayed in the dialogue
    this.fastForward = false; // Flag to enable fast forward
    this.currentIndex = 0; // Index of the current dialogue in the dialogue list
    this.dialogueList = [
      "you can look using the left and right arrow keys",
      "to go towards the direction you’re looking in, press space",
      "The hallways in this hotel seem to change all the time but your memory of where you’ve been and the layout of the floor might serve you correctly if you press the up arrow key.",
      "now press it again,",
      "time isn’t paused when you’re recalling the layout of the hotel, so be cautious,",
      "when it’s a matter of life and death, there is no time to stall.",
      "he might have already found a way to escape so make sure you don’t frequent around an area for too long.",
      "enough with the tutorial.",
    ]

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
    //#region << INTERSECTION VAR >>
    this.load.image('hallInter0', './assets/hotel/hallwayIntersection0.png');
    this.load.image('hallInter1', './assets/hotel/hallwayIntersection1.png');
    this.load.image('hallInter2', './assets/hotel/hallwayIntersection2.png');
    this.load.image('hallInter3', './assets/hotel/hallwayIntersection3.png');
    this.load.image('hallInter4', './assets/hotel/hallwayIntersection4.png');
    this.load.image('deadendInter', './assets/hotel/hallwayIntersection5.png');
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
    this.load.image('rightArrow', './assets/ui/rightArrow.png');
    this.load.image('rightArrow', './assets/ui/rightArrow.png');
    this.load.image('leftArrow', './assets/ui/leftArrow.png');
    this.load.image('spaceButton', './assets/ui/spaceButton.png');
    this.load.image('forward', './assets/ui/forward.png');
    this.load.image('forwardx2', './assets/ui/forwardx2.png');
    this.load.image('mapArrowBlue', './assets/ui/mapArrowBlue.png');
    this.load.image('mapArrowDot', './assets/ui/mapArrowBlueDot.png');
    //#endregion

    // << UI ELEMENTS >>
    this.load.image('textBox', './assets/ui/textBox.png');

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
      frameRate: 20,
      yoyo:true,
      hideOnComplete: true,
    });

    // DEATH ANIMATIONS / JACK IS NEAR
    this.heartbeat1= this.anims.create({
      key: 'heartbeat1',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 1,
        end: 2
      }),
      yoyo: true,
      frameRate: 3,
      repeat: -1
    });

    this.heartbeat2= this.anims.create({
      key: 'heartbeat2',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 3,
        end: 4
      }),
      yoyo: true,
      frameRate: 3,
      repeat: -1
    });

    this.heartbeat3= this.anims.create({
      key: 'heartbeat3',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 4,
        end: 8
      }),
      frameRate: 1.5,
      repeat: 0,
      hideOnComplete: false,
    });

    //#endregion

    this.textBox = this.add.image(screen.center.x, screen.center.y + 300, 'textBox').setOrigin(0.5, 0);
    this.textBox.setDepth(depth.textBox);

    this.playerConfig={
      node: this.hotel.getNode(31,19), //set player's location
      cardDirec: this.CD.NORTH, //cardinal direction
      //imageDisplay: currImage, //& image display
    }
    // Add delayed calls to the list

    this.createCompassGrid(this.playerConfig.cardDirec);
    this.movePlayer();
    this.displayImage(this.playerConfig.cardDirec);
    
    this.input.keyboard.on("keydown-SHIFT", () => {
      if (!this.textCrawlActive) {
        if (this.currentIndex === this.dialogueList.length - 1) {
          this.createBlinkingText(screen.center.x, screen.center.y, 'FIND YOUR SON', 3000 , defaultHeaderStyle);
          this.textCrawl.destroy();
          this.textBox.destroy();
        } else {
          this.currentIndex++;
          this.textCrawl.destroy();
          this.startNextDialogue();
          console.log("Proceeding to next dialogue");
        }
      }
    });
    
    this.input.keyboard.on("keydown-SHIFT", () => {
      this.fastForward = true;
    });

    this.input.keyboard.on("keyup-SHIFT", () => {
      this.fastForward = false;
    });

    this.startNextDialogue();



  }

  update(){
    this.currentGameState.update();

    if (this.mapsActive) {// If the maps are active, prevent other inputs from affecting the scene
      return;
    }
    this.currEyeState.update();
    this.readInput();

    //console.log("heartbeat1 repeat:" + this.heartbeat1.repeat + ", heatbeat1 hideOnComplete: " + this.heartbeat1.hideOnComplete);
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

    this.add.sprite(this.eye.x,this.eye.y).play('blink182').setScale(0.75); // play blink
    this.time.delayedCall(this.wholeEyeDuration, function() { // cooldown time
      console.log("eye lul");
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
      //
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
    /* EMPTY: 0,
    INTER: 1,
    DEAD_END: 2,
    DEAD_END0: 3,
    DEAD_END1: 4,
    DEAD_END2: 5,
    HALLWAY_0: 6,
    HALLWAY_1: 7,
    HALLWAY_2: 8,
    HALLWAY_3: 9,
    HALLWAY_4: 10,
    HALLWAY_5: 11,
    HALLWAY_6: 12,
    HALLWAY_7: 13,
    HALLWAY_8: 14,
    HALLWAY_9: 15,
    SPECIAL_HALLWAY: 16,
    SPECIAL_DOOR: 17,
    */
    /*
    if(this.currRoomType==null || this.currRoomType==0) { this.currImage = this.add.image(screen.center.x, screen.center.y, 'door'); }
    if(this.currRoomType==1) { this.currImage = this.add.image(screen.center.x, screen.center.y, 'intersection'); }
    if(this.currRoomType > 1 && this.currRoomType < 6){
      if(this.playerConfig.node.roomType==RoomType.INTER){ //if ur looking at a dead end from an intersection
        this.currImage = this.add.image(screen.center.x, screen.center.y, 'intersection');
      }
      
    }
    */
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
    const alphaStep = 1 / (this.queue.length - 1); // Step for decrementing alpha
  
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
    for (let i = newQueue.length - 1; i >= 0; i--) {
      const node = newQueue[i];
      const index = newQueue.length - 1 - i;
      const row = node.index[0];
      const col = node.index[1];
      console.log(`Node index: row=${row}, col=${col}`);
  
      const x = col * this.minimapSize;
      const y = row * this.minimapSize;
      console.log(`Image position: x=${x}, y=${y}`);
      const alpha = 1 - index * alphaStep;
  
      // Create an image with the appropriate alpha and rotation
      let imageKey = (i === newQueue.length - 1) ? 'mapArrowDot' : 'blue';
      const image = this.add.image(x, y, imageKey).setDepth(depth.miniMapSquares);
      image.setOrigin(0, 0);
      image.setDisplaySize(this.minimapSize, this.minimapSize);
      image.setAlpha(alpha);
  
      if (i === newQueue.length - 1) {
        // Rotate the image based on the cardinal direction
        const { cardDirec } = this.playerConfig;
        switch (cardDirec) {
          case this.CD.NORTH:
            image.setRotation(0);
            break;
          case this.CD.WEST:
            image.setRotation(Phaser.Math.DegToRad(-90));
            image.setOrigin(1, 0); // Adjust origin to top-right corner
            //image.setX(x + this.minimapSize); // Adjust x position to compensate for origin change
            break;
          case this.CD.SOUTH:
            image.setRotation(Phaser.Math.DegToRad(180));
            image.setOrigin(1, 1); // Adjust origin to bottom-right corner
            //image.setX(x + this.minimapSize); // Adjust x position to compensate for origin change
            //image.setY(y + this.minimapSize); // Adjust y position to compensate for origin change
            break;
          case this.CD.EAST:
            image.setRotation(Phaser.Math.DegToRad(90));
            image.setOrigin(0, 1); // Adjust origin to bottom-left corner
            //image.setY(y + this.minimapSize); // Adjust y position to compensate for origin change
            break;
          default:
            break;
        }
      }
  
      this.squareListMiniMap.push(image);
    }
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
  
    // Define the rotation matrix based on the facing direction
    let rotationMatrix;
    switch (facingDirection) {
      case this.CD.NORTH:
        rotationMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // No rotation
        break;
      case this.CD.EAST:
        rotationMatrix = [[0, -1, 0], [1, 0, 0], [0, 0, 1]]; // 90 degrees clockwise rotation
        break;
      case this.CD.SOUTH:
        rotationMatrix = [[-1, 0, 0], [0, -1, 0], [0, 0, 1]]; // 180 degrees clockwise rotation
        break;
      case this.CD.WEST:
        rotationMatrix = [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]; // 270 degrees clockwise rotation
        break;
      default:
        rotationMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // Default to no rotation
        break;
    }
  
    // Create the compass grid
    for (let row = 0; row < gridSize; row++) {
      this.compassGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const offsetX = col * 64;
        const offsetY = row * 64;
  
        // Apply rotation to the coordinates
        const rotatedX = offsetX * rotationMatrix[0][0] + offsetY * rotationMatrix[0][1];
        const rotatedY = offsetX * rotationMatrix[1][0] + offsetY * rotationMatrix[1][1];
  
        const imageX = gridX + rotatedX;
        const imageY = gridY + rotatedY;
  
        if (row === 1 && col === 1) {
          // Center square
          this.compassGrid[row][col] = this.add.image(imageX, imageY, 'blue').setDepth(3).setAlpha(1);
        } else {
          this.compassGrid[row][col] = this.add.image(imageX, imageY, 'blue').setDepth(3).setAlpha(0);
        }
  
        console.log(`Created image at row ${row}, col ${col} with position (${imageX}, ${imageY})`);
      }
    }
  }
  
  updateCompassGrid(facingDirection, availableDirections) {
    const gridSize = 3;
    const gridAlpha = 0.5;
  
    // Define the rotation matrix based on the facing direction
    let rotationMatrix;
    switch (facingDirection) {
      case this.CD.NORTH:
        rotationMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // No rotation
        break;
      case this.CD.EAST:
        rotationMatrix = [[0, -1, 0], [1, 0, 0], [0, 0, 1]]; // 90 degrees clockwise rotation
        break;
      case this.CD.SOUTH:
        rotationMatrix = [[-1, 0, 0], [0, -1, 0], [0, 0, 1]]; // 180 degrees clockwise rotation
        break;
      case this.CD.WEST:
        rotationMatrix = [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]; // 270 degrees clockwise rotation
        break;
      default:
        rotationMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // Default to no rotation
        break;
    }
  
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const image = this.compassGrid[row][col];
  
        if (row === 1 && col === 1) {
          // Center square
          image.setAlpha(1);
        } else {
          // Apply rotation to the grid offset
          const offsetX = col - 1;
          const offsetY = row - 1;
  
          const rotatedOffset = [
            offsetY * rotationMatrix[0][0] + offsetX * rotationMatrix[0][1],
            offsetY * rotationMatrix[1][0] + offsetX * rotationMatrix[1][1]
          ];
  
          const direction = this.getDirectionFromGridOffset(facingDirection, rotatedOffset[0], rotatedOffset[1]);
  
          if (availableDirections.includes(direction)) {
            // Available direction
            image.setAlpha(gridAlpha);
          } else {
            // Unavailable direction
            image.setAlpha(0);
          }
        }
        console.log(`Updated image at row ${row}, col ${col} with alpha ${image.alpha}`);
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
    if (this.queue.length > 10) {
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
    if (this.memoryQueue.length > 10) {
      this.memoryQueue.shift(); // Remove the oldest element from the queue
    }
    this.visitCounter++;
    this.restartAllDelayedCalls();
    //reset all delayed calls
  }

  restartAllDelayedCalls() {
    if(this.jackAnim0Timer) { this.jackAnim0Timer.remove(); }
    if(this.jackAnim1Timer) { this.jackAnim1Timer.remove(); }
    if(this.deathAnimTimer) { this.deathAnimTimer.remove(); }

    if(this.heartBeat1) {
      this.heartBeat1.stop();
      this.heartBeat1.visible = false;
    }if(this.heartBeat2){
      this.heartBeat2.stop();
      this.heartBeat2.visible = false;
    }if(this.heartBeat3){
      this.heartBeat3.stop();
      this.heartBeat3.visible = false;
    }
    this.jackAnim0Timer = this.time.delayedCall(this.jackAnimTimerDuration, function JAT0() {
      this.heartbeat1.repeat=-1;
      this.heartbeat1.hideOnComplete = false;
      this.heartBeat1 = this.add.sprite(screen.center.x,screen.center.y).play('heartbeat1').setDepth(depth.deathAnims); // play blink

      console.log("playing anim 1");
    }, [], this);
    this.jackAnim1Timer =  this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference, function JAT1()  {
      this.heartbeat2.repeat=-1;
      this.heartbeat2.hideOnComplete = false;
      this.heartBeat2 = this.add.sprite(screen.center.x,screen.center.y).play('heartbeat2').setDepth(depth.deathAnims);
      console.log("playing anim 2");
    }, [], this);
    this.deathAnimTimer = this.time.delayedCall(this.jackAnimTimerDuration + this.jackAnimDifference + this.deathDifferenceDuration, function DAT() {
      this.heartbeat3.repeat=-1;
      this.heartbeat3.hideOnComplete = false;
      this.heartBeat3 = this.add.sprite(screen.center.x,screen.center.y).play('heartbeat3').setDepth(depth.deathAnims);

    }, [], this);
  }
  //#endregion
 
  //#region << TEXT GRAPPLERS >>  
  createBlinkingText(x, y, textString, duration, style) {
    const text = this.add.text(x, y, textString, style);
    text.setOrigin(0.5);
    text.setDepth(depth.deathAnims);
  
    const blinkDuration = 500; // Duration of each blink in milliseconds
    const visiblePauseDuration = 200; // Duration to keep the text visible between blinks
    const repeatCount = Math.floor(duration / (blinkDuration + visiblePauseDuration)); // Calculate the number of repeats
  
    let currentRepeat = 0; // Counter for the current repeat
  
    const blinkAnimation = () => {
      currentRepeat++;
  
      // Set the alpha to 0 after the visible pause duration
      this.time.delayedCall(visiblePauseDuration, () => {
        text.alpha = 0;
      });
  
      // Set the alpha to 1 after the blink duration
      this.time.delayedCall(visiblePauseDuration + blinkDuration, () => {
        text.alpha = 1;
      });
  
      // Repeat the blink animation until the desired number of repeats is reached
      if (currentRepeat < repeatCount) {
        this.time.delayedCall(visiblePauseDuration + blinkDuration * 2, blinkAnimation);
      } else {
        // Destroy the text object when the blinking is complete
        this.time.delayedCall(visiblePauseDuration + blinkDuration * 2, () => {
          text.destroy();
        });
      }
    };
  
    // Start the blinking animation
    blinkAnimation();
  }


  addCharacter(dialogue) {
    this.currentTextIndex++;
    this.textCrawl.text = dialogue.substring(0, this.currentTextIndex);

    if (this.currentTextIndex < dialogue.length) {
      const delay = this.fastForward ? 0 : this.textCrawlSpeed;
      this.time.delayedCall(delay, () => this.addCharacter(dialogue));
    } else {
      this.textCrawlActive = false;
      console.log("Setting textCrawlActive false");
    }
  }

  startNextDialogue() {
    if (this.currentIndex >= this.dialogueList.length) {
      return;
    }
    const dialogue = this.dialogueList[this.currentIndex];
    const textBoxPaddingX = 100;
    const textBoxPaddingY = 100;
    const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
    const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
    const textX = textBoxX + textBoxPaddingX;
    const textY = textBoxY + textBoxPaddingY;

    this.textCrawl = this.add.text(textX, textY, "", defaultTextCrawlStyle);
    this.textCrawl.setOrigin(0, 0);
    this.textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);
    this.textCrawl.setDepth(depth.textBox+1);

    this.currentTextIndex = 0;
    this.textCrawlActive = true;
    this.addCharacter(dialogue);
  }
  
  //#endregion
}