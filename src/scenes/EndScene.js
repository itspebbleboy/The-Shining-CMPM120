class EndScene extends Phaser.Scene {
    constructor() {
        super("endScene");
        // cutscene properties
    }

    preload(){
        this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
        this.load.image('background', './assets/ui/brownBackground.png');
        this.load.image('textBox', './assets/ui/textBox.png');

        this.load.image('endScene', './assets/cutscene/endScene.png');

    }create(){
        this.image = this.add.image(screen.center.x,screen.center.y, 'endScene').setOrigin(0.5,0.5);
        this.image.setDepth(10);
        this.nextSceneLogic();
    }update(){

    }
    nextSceneLogic = () =>{
        this.time.delayedCall(4000, this.fadeInImage, [1000],this);
      }

    fadeInImage(duration) {

        const image = this.add.image(screen.center.x, screen.center.y, 'background'); // Replace 'myImage' with your image key
        image.alpha = 0; // Set the initial alpha to 0
        image.setDepth(depth.mapSquares);
        image.setOrigin(0.5,0.5);
    
        this.tweens.add({
          targets: image,
          alpha: 1, // Animate the alpha property from 0 to 1
          duration: duration,
          ease: 'Linear', // Use a linear easing function for a constant rate
          onComplete: this.scene.start("menuScene")
          //onComplete: //GO TO NEXT SCENE
        });
        
      }
}