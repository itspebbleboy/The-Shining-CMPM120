class Play extends Phaser.Scene {
  constructor() {
    super("playScene");

  }

  preload(){
    //state machine for eye orientation
    //load images
  }

  create(){
    this.hotelMap = [
      [],
      [],
      [],
    ]
    this.hotel = new Graph(hotelMap);

    this.hedgeMap = [
      [],
      [],
      [],
    ]
    this.hedge = new Graph(hedgeMap);
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