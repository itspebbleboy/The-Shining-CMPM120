class Play extends Phaser.Scene {
  constructor() {
    super("playScene");

  }

  preload(){
    //state machine for eye orientation

    //load images
    const CD ={ 
      NORTH: 0,
      WEST: 1,
      SOUTH: 2,
      EAST: 3,
    }
    //#region << HOTEL AND EYE >>
    // << EYE ELEMENTS >>
    this.load.atlas('pupil', './assets/eye/pupil.png', './assets/eye/shining.json');  // holds the closing eye animation -> might add more to json later one who knows

    // << HOTEL AREAS >> 
    this.load.image('deadend', './assets/hotel/deadend.png');
    this.load.image('door', './assets/hotel/door.png');
    this.load.image('hallway', './assets/hotel/hallway.png');
    this.load.image('intersection', './assets/hotel/intersection.png');

    //#endregion
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

    //set player's location
    //cardinal direction
    //& image display

    this.playerConfig={
      node: this.hotel.getNode(0),
      cardDirec: CD.NORTH,
      imageDisplay: currImage,
    }
    //kinda like an enum but da enum do things
    this.eyeState = { //in update you do a currEyeState.update();
      NAMEOFSTATE1: {
        name: '',
        enter: () => {
          //set currEyeState to be this state
          //do things that happen when you first enter this state
        },
        update: () => {
        //do things u need to do in this state
        //check for state switch condition
          //if state switch condition, enter the state
        },
      },
      NAMEOFSTATE2: {
        name: '',
        enter: () => {
          //set currEyeState to be this state
          //do things that happen when you first enter this state
        },
        update: () => {
        //do things u need to do in this state
        //check for state switch condition
          //if state switch condition, enter the state
        },
      }
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
  }

  moveEyeRight(){
    //moves eye right
    //from state left -> forward
    //or state forward -> right
  }
  moveEyeLeft(){
    //moves eye left
    //from state right -> forward
    //or state forward -> left
  }
  changeCardinalDirection(currCardDirection, leftOrRIght){
    //given the current cardinal direction & if the movement is towards the left or the right
    //change the player's curr cardinal direction to be facing left or right
  }
}