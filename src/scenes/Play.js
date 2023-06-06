class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
    this.stateCooldown = false; // Cooldown state
    this.cooldownDuration = 500; // Cooldown duration in milliseconds (0.5 seconds)

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

    //load images
    this.CD ={ 
        NORTH: 0,
        WEST: 1,
        SOUTH: 2,
        EAST: 3,
    }

    //#region >> EYE STATE MACHINE >>
    //state machine for eye orientation
    //kinda like an enum but da enum do things
    this.eyeState = { //in main update() you do a currEyeState.update();
      LEFT: {
        name: 'left',
        enter: () => {
          //set currEyeState to be this state
          console.log("Entered Left");
          this.currEyeState = this.eyeState.LEFT; 
          // change the cardinal direction based on current position
       //   this.changeCardinalDirection(this.currCardDirection, this.leftOrRight = 0);
        },
        update: () => {
          //do things u need to do in this state
          //check for state switch condition
          //if state switch condition, enter the state
          if(keyRIGHT.isDown || keyD.isDown){
              console.log("pressed right while in left");
              // cause states are called in scenes we can assume that the eye will move in update before entering the right state
              this.moveEyeRight();
              // if moving back forward gotta move cardinal direction back before we enter forward
         //     this.changeCardinalDirection(this.currCardDirection, this.leftOrRight = 1);
              this.eyeState.FORWARD.enter();  // go to the right scene
          }
          // if space is hit IMAGE CHANGES but LOCATION REMAINS -> cardinal direction changes from entering LEFT
          if(keySPACE.isDown){  
              console.log("hi hi im flipping a new LEFT leaf woahhhhh");
          }
        },
      },
      RIGHT: {
        name: 'right',
        enter: () => {
          // set currEyeState to be this state
          console.log("Entered right");
          this.currEyeState = this.eyeState.RIGHT;
          // change the cardinal direction based on current position
       //   this.changeCardinalDirection(this.currCardDirection, this.leftOrRight = 1);
        },
        update: () => {
          // do things u need to do in this state
          // check for state switch condition
          // if state switch condition, enter the state
          if(keyLEFT.isDown || keyA.isDown){
            console.log("pressed left while in right");
            // cause states are called in scenes we can assume that the eye will move in update before entering the right state
            this.moveEyeLeft();
            // if moving back forward gotta move cardinal direction back before we enter forward
           // this.changeCardinalDirection(this.currCardDirection, this.leftOrRight = 0);
            this.eyeState.FORWARD.enter();  // go to the right scene
          }
          // if space is hit IMAGE CHANGES but LOCATION REMAINS -> cardinal direction changes from entering RIGHT
          if(keySPACE.isDown){  
            console.log("hi hi im flipping a new RIGHT leaf woahhhhh");
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
          //do things u need to do in this state
          //check for state switch condition
          //if state switch condition, enter the state
          if(keyRIGHT.isDown || keyD.isDown){
            //console.log()
            console.log("pressed right while in forward");
            // cause states are called in scenes we can assume that the eye will move in update before entering the right state
            //this.add.image('pupil_atlas', 'pupil')
            this.moveEyeRight();
            this.eyeState.RIGHT.enter();  // go to the right scene

          }
          if(keyLEFT.isDown || keyA.isDown){
            console.log("pressed left while in forward");
            this.moveEyeLeft();
            this.eyeState.LEFT.enter();   // go to the left scene
          }
          // if space is hit then move DIRECTIONALLY forward and IMAGE CHANGE -> cardinal direction remains the same
          if(keySPACE.isDown){  
            console.log("hi hi im flipping a new FORWARD leaf woahhhhh");
        }
        }
      },
    }
    //#endregion


    //#region << HOTEL AND EYE >>
    // << EYE ELEMENTS >>
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows

    // << HOTEL AREAS >> 
    this.load.image('deadend', './assets/hotel/deadend.png');
    this.load.image('door', './assets/hotel/door.png');
    this.load.image('hallway', './assets/hotel/hallway.png');
    this.load.image('intersection', './assets/hotel/intersection.png');

    //#endregion
  
    //this.eyeState.FORWARD.enter();
    this.currEyeState=this.eyeState.FORWARD;
  }

  create(){
    this.leftOrRight = 0; // 0 equals left , 1 equals right

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
    this.hotel = new Graph(this, this.hotelMap);
    //#endregion
    
    /*
    //#region << THE HEDGE MAZE MAP >>
    this.hedgeMap = [
      [],
      [],
      [],
    ]
    this.hedge = new Graph(this, this.hedgeMap);
    //#endregion
    */
    this.hotel.displayGraph(this, 100, 100, 100);

    //#region just some shit for testing 
    this.add.image(0,0,'hallway').setOrigin(0,0);
    this.eye = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil1').setScale(0.5);
    this.pupil = this.add.image(screen.center.x, screen.center.y, 'shining_atlas', 'pupil_alone').setScale(0.5);

    // Adjust the anchor point of the sprites to the center
    this.eye.setOrigin(0.5);
    this.pupil.setOrigin(0.5);

   
    //#endregion
    //set player's location
    //cardinal direction
    //& image display
    this.playerConfig={
      node: this.hotel.getNode(0),
      cardDirec: this.CD.NORTH,
      //imageDisplay: currImage,
    }    
  }

  update(){
    //player's location, cardinal direction, & image display
    this.currEyeState.update();
  }

  moveEyeRight(){
    //moves eye right
    //from state left -> forward
    //or state forward -> right
    // console.log("in eye right");
    if (this.stateCooldown) {
        return; // Exit the function if currently in cooldown
    }

    this.stateCooldown = true; // Set the cooldown state to true

    let eyeRight = this.tweens.add({
      targets: this.eye,
      x: this.eye.x+=600,
      ease: 'Linear',
      duration: 10,
      repeat: 0,
      paused: true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }
    });
    let pupilRight = this.tweens.add({
      delay:100,
      targets: this.pupil,
      x: this.pupil.x +=750,
      ease:'Linear',
      duration:10,
      repeat: 0,
      paused:true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }  
    });
    eyeRight.play();
    pupilRight.play();
    //if(this.currEyeState == this.eyeState.LEFT){

    //}
    //if(this.currEyeState == this.eyeState.FORWARD){

    //}
    //this.add.image('pupil_atlas', 'pupil');
    
  }
  moveEyeLeft(){
    //moves eye left
    //from state right -> forward
    //or state forward -> left
    if (this.stateCooldown) {
      return; // Exit the function if currently in cooldown
    }

    this.stateCooldown = true; // Set the cooldown state to true

    let eyeLeft = this.tweens.add({
      targets: this.eye,
      x: this.eye.x-=600,
      ease: 'Linear',
      duration: 10,
      repeat: 0,
      paused: true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }    
    });

    let pupilLeft = this.tweens.add({
      delay:100,
      targets: this.pupil,
      x: this.pupil.x-=750,
      ease:'Linear',
      duration:10,
      repeat: 0,
      paused:true,
      onComplete: () => {
        this.stateCooldown = false; // Reset the cooldown state when the tween is complete
      }  
    });
    eyeLeft.play();
    pupilLeft.play();

  }


/*
  changeCardinalDirection(currCardDirection, leftOrRIght){
    //given the current cardinal direction & if the movement is towards the left or the right
    //change the player's curr cardinal direction to be facing left or right
    if(this.leftOrRight == 1){
        // upon entering RIGHT the cardinal direction must change
        // if N -> E
        if(this.currCardDirection == this.CD.NORTH){
            console.log("I am now East");
            this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> S
        if(this.currCardDirection == this.CD.EAST){
            console.log("I am now south");
            this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> W
        if(this.playerConfig.cardDirec == this.CD.SOUTH){
            console.log("I am now West");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> N
        if(this.currCardDirection == this.CD.WEST){
            console.log("I am now North");
            this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
    if(this.leftOrRight == 0){
        // upon entering LEFT the cardinal direction must change 
        // if N -> W
        if(this.currCardDirection == this.CD.NORTH){
            console.log("I am now West");
            this.playerConfig.cardDirec = this.CD.WEST;
        }
        // if W -> S
        if(this.currCardDirection == this.CD.WEST){
          console.log("I am now south");
          this.playerConfig.cardDirec = this.CD.SOUTH;
        }
        // if S -> E
        if(this.currCardDirection == this.CD.SOUTH){
          console.log("I am now East");
          this.playerConfig.cardDirec = this.CD.EAST;
        }
        // if E -> N
        if(this.currCardDirection == this.CD.EAST){
          console.log("I am now North");
          this.playerConfig.cardDirec = this.CD.NORTH;
        }
    }
  }
  */
}