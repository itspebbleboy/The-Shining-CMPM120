class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
    //#region << CLASS PROPERTIES >>
    this.stateCooldown = false; // Cooldown state
    this.eyeDelta = 600;
    this.pupilDelta = 750;
    this.wholeEyeDuration = 300;
    this.CD ={ 
      NORTH: 'north',
      WEST: 'west',
      SOUTH: 'south',
      EAST: 'east',
    }

    this.cooldownDuration = 200; // Cooldown duration in milliseconds (0.2 seconds)
    this.lastSpacePressTime = 0; // Timestamp of the last space key press
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
    //#endregion

    //#region << LOADING HOTEL AND EYE IMAGES >>
    // << EYE ELEMENTS >>
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
    // << HOTEL AREAS >> 
    this.load.image('deadend', './assets/hotel/deadend.png');
    this.load.image('door', './assets/hotel/door.png');
    this.load.image('hallway', './assets/hotel/hallway.png');
    this.load.image('intersection', './assets/hotel/intersection.png');
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
          if(this.space()){
            //update player location!
          }
        }
      },
    }
    //#endregion

    this.eyeState.FORWARD.enter();
  }

  create(){    
    
    //#region << THE HOTEL MAP >>
    this.hotelMap = [
      [0,0,0,0,0,3,0],
      [0,0,0,3,0,2,0],
      [0,3,0,2,0,2,0],
      [3,1,2,1,2,1,3],
      [0,2,0,0,0,2,0],
      [3,1,2,2,2,1,3],
      [0,3,0,0,0,3,0],
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
      [],
      [],
      [],
    ]
    this.hedge = new Graph(this, this.hedgeMap);
    */
    //#endregion

    //this.hotel.displayGraph(this, 100, 100, 100);

    //#region << IMAGES FOR TESTING >>
    this.add.image(0,0,'hallway').setOrigin(0,0);
    this.eye = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil1').setScale(0.5);
    this.pupil = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil_alone').setScale(0.5);

    this.eye.setOrigin(0.5); // Adjust the anchor point of the sprites to the center
    this.pupil.setOrigin(0.5);

    this.eye.setDepth(2);
    this.pupil.setDepth(2);
    //#endregion

    this.playerConfig={
      node: this.hotel.getNode(0,5), //set player's location
      cardDirec: this.CD.SOUTH, //cardinal direction
      //imageDisplay: currImage, //& image display
    }
    this.displayImage(this.playerConfig.cardDirec);
  }

  update(){
    this.currEyeState.update();
    this.readInput();
  }

  //#region << HELPER FUNCTIONS FOR THE EYE >>
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
    if(this.currEyeState == this.eyeState.FORWARD && keySPACE.isDown) // if forward and the "SPACE" UPDATE PLAYER LOCATION
    {
      console.log("move forward");
      this.movePlayer();
      this.displayImage();
    }

    if(this.currEyeState == this.eyeState.LEFT && keyRIGHT.isDown) //if left & "->" go forward
    {
      console.log("in left pressed right go forward");
      this.moveEyeRight(); //update sprite
      this.eyeState.FORWARD.enter(); //update state
    }
    
    if(this.currEyeState == this.eyeState.RIGHT && keyLEFT.isDown) //if right & "<-" go forward
    {
      console.log("in right pressed left go forward");
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

  //#region << PLAYER HELPER FUNCTIONS >>
  movePlayer(){
    this.playerConfig.node=this.hotel.getNeighborInDirection(this.playerConfig.node, this.playerConfig.cardDirec)
  }
  
  
  changeCardinalDirection(currCardDirection, leftOrRight){
    //given the current cardinal direction & if the movement changes player's curr cardinal direction
    if(leftOrRight == 1){ //GOING RIGHT
        // if N -> E
        if(currCardDirection == this.CD.NORTH){
            console.log("I am now East");
            this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> S
        if(currCardDirection == this.CD.EAST){
            console.log("I am now south");
            this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> W
        if(currCardDirection == this.CD.SOUTH){
            console.log("I am now West");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> N
        if(currCardDirection == this.CD.WEST){
            console.log("I am now North");
            this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
    if(leftOrRight == 0){ //GOING LEFT
        // if N -> W
        if(currCardDirection == this.CD.NORTH){
            console.log("I am now West");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> S
        if(currCardDirection == this.CD.WEST){
          console.log("I am now south");
          this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> E
        if(currCardDirection == this.CD.SOUTH){
          console.log("I am now East");
          this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> N
        if(currCardDirection == this.CD.EAST){
          console.log("I am now North");
          this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
  }
  //#endregion
 
}