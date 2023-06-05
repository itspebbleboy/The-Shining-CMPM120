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
  }

  create(){
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
    /*
    this.hedgeMap = [
      [],
      [],
      [],
    ]
    this.hedge = new Graph(this, this.hedgeMap);
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