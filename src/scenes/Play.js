class Play extends Phaser.Scene {
  constructor() {
    super("playScene");

  }

  preload(){
    //#region << DEFINE KEYS >>
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    //#endregion

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
          //do things that happen when you first enter this state


        },
        update: () => {
          //do things u need to do in this state
          //check for state switch condition
          //if state switch condition, enter the state
          if(Phaser.Input.Keyboard.JustDown(keyRight) || Phaser.Input.Keyboard.JustDown(keyD)){
              console.log("pressed right while in left");
              // cause states are called in scenes we can assume that the eye will move in update before entering the right state
              //this.add.image('pupil_atlas', 'pupil')
              this.moveEyeRight();
              this.eyeState.FORWARD.enter();  // go to the right scene
          }

        },
      },
      RIGHT: {
        name: 'right',
        enter: () => {
          //set currEyeState to be this state
          console.log("Entered right");
          this.currEyeState = this.eyeState.RIGHT;
          
          //do things that happen when you first enter this state
        },
        update: () => {
          //do things u need to do in this state
          //check for state switch condition
          //if state switch condition, enter the state
          if(Phaser.Input.Keyboard.JustDown(keyLeft) || Phaser.Input.Keyboard.JustDown(keyA)){
            console.log("pressed left while in right");
            // cause states are called in scenes we can assume that the eye will move in update before entering the right state
            //this.add.image('pupil_atlas', 'pupil')
            this.moveEyeLeft();
            this.eyeState.FORWARD.enter();  // go to the right scene
          }
        },
      },
      FORWARD: {
        name: 'forward',
        enter: () => {
          console.log("Enter forward");
          //set currEyeState to be this state
          this.currEyeState = this.eyeState.FORWARD;
          //do things that happen when you first enter this state
        },
        update: () => {
        //do things u need to do in this state
        //check for state switch condition
          //if state switch condition, enter the state
          if(Phaser.Input.Keyboard.JustDown(keyRight) || Phaser.Input.Keyboard.JustDown(keyD)){
            console.log("pressed right while in forward");
            // cause states are called in scenes we can assume that the eye will move in update before entering the right state
            //this.add.image('pupil_atlas', 'pupil')
            this.moveEyeRight();
            this.eyeState.RIGHT.enter();  // go to the right scene

          }
          if(Phaser.Input.Keyboard.JustDown(keyRight) || Phaser.Input.Keyboard.JustDown(keyA)){
            console.log("pressed left while in forward");
            this.moveEyeLeft();
            this.eyeState.LEFT.enter();   // go to the left scene
          }
        }
      },
    }
    //#endregion

    //load images
    this.CD ={ 
      NORTH: 0,
      WEST: 1,
      SOUTH: 2,
      EAST: 3,
    }
    //#region << HOTEL AND EYE >>
    // << EYE ELEMENTS >>
    this.load.atlas('pupil_atlas', './assets/eye/pupil.png', './assets/eye/shining.json');  // holds the closing eye animation -> might add more to json later one who knows

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
    this.eye = this.add.image(0,0,'pupil_atlas', 'pupil1').setOrigin(0,0); // load eye alone texture
    this.pupil = this.add.image(0,0,'pupil_atlas', 'pupil_alone').setOrigin(0,0); // load in pupil alone

   
    //#endregion

    //set player's location
    //cardinal direction
    //& image display
    
    this.playerConfig={
      node: this.hotel.getNode(0),
      cardDirec: this.CD.NORTH,
      //imageDisplay: currImage,
    }
  

    //#region << PAUSE MENU STATE MACHINE EXAMPLE >>
    /*
    this.pauseState = { //kinda like an enum but the enum does things
      RESUMEBUT: {
          name: 'resumeButton',
          enter: () => {
              this.currPauseState = this.pauseState.RESUMEBUT;
              this.resText.setBackgroundColor(color_pal.grey);
              //make button less setBackgroundColor
              console.log('resume enter');
              this.soundManager.play('sfx_select');
          },
          update: () => {
              if(Phaser.Input.Keyboard.JustDown(keyENTER)){ //if enter is pressed, run resume
                  console.log("pressed enter while resume");
                  this.resText.setBackgroundColor(color_pal.black);
                  //this.resumeScene(this.data.key);
                  this.resumeScene(this.prevScene, this.input);
                  //this.scene.resume("playScene");
              }
              if(Phaser.Input.Keyboard.JustDown(keyDOWN)){ //if down, change state to VOLSLIDER & enter
                  //this.currPauseState=this.pauseState.VOLSLIDER;
                  this.resText.setBackgroundColor(color_pal.black);
                  this.pauseState.VOLSLIDER.enter();
              }
              if(Phaser.Input.Keyboard.JustDown(keyUP)){ //if down, enter RESTARTBUT & 
                  //this.currPauseState=this.pauseState.VOLSLIDER;
                  this.resText.setBackgroundColor(color_pal.black);
                  this.pauseState.RESTARTBUT.enter();
              }
          },
      },
      */
    //#endregion


    
  }

  update(){
    //player's location, cardinal direction, & image display
    this.currEyeState.update();
  }

  moveEyeRight(){
    //moves eye right
    //from state left -> forward
    //or state forward -> right
    console.log("in eye right");
    let eyeRight = this.tweens.add({
      //delay: 125,
      targets: this.eye,
      x: 500,
      ease: 'Linear',
      duration: 500,
      repeat: 0,
      //yoyo: true,
      //hold: 1650,
      paused: true
    });
    eyeRight.play();
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
    console.log("in eye left");
    let eyeLeft = this.tweens.add({
      //delay: 500,
      targets: this.eye,
      x: -500,
      ease: 'Linear',
      duration: 500,
      repeat: 0,
      //yoyo: true,
      //hold: 1650,
      paused: true
    });
    eyeLeft.play();

  }

  movePupilLeft(){
    //moves pupil left
    //from state right -> forward
    //or state forward -> left

  }

  movePupilRight(){
    // moves pupil to the left
    // from state left ->forward
    // or state forward ->right
  }
  changeCardinalDirection(currCardDirection, leftOrRIght){
    //given the current cardinal direction & if the movement is towards the left or the right
    //change the player's curr cardinal direction to be facing left or right
  }
}