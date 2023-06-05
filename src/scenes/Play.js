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

}