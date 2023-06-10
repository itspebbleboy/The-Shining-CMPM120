class EndScene extends Phaser.Scene {
    constructor() {
        super("endScene");
        // cutscene properties
    }

    preload(){
        this.load.image('background', './assets/ui/brownBackground.png');
        this.load.image('textBox', './assets/ui/textBox.png');

        this.load.image('endScene', './assets/cutscene/endScene.png');
    }create(){
        this.add.image(screen.center.x,screen.center.y, 'endScene').setOrigin(0.5,0.5);
    }update(){

    }
}