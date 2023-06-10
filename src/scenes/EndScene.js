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
    }update(){

    }
}