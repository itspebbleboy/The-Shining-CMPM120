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
        
    }update(){

    }
}