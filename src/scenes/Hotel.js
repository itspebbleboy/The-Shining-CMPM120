class Hotel extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  create(){
    this.map = [
      [],
      [],
      [],
    ]
    this.hotel = new Graph(map);
  }

  preload(){
    //state machine for the player/camera's orientation
    
  }
  update(){

  }

  
}