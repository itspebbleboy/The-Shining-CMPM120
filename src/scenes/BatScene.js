class BatScene extends Phaser.Scene {
    constructor() {
        super("endScene");
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.load.image('textBox', './assets/ui/textBox.png');
        this.load.image('youDied', './assets/ui/youDiedText.png');
        this.load.image('restart', './assets/ui/spaceRestartTest.png');
        this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');
    }

    preload(){

    }create(){
        
    }update(){

    }sceneFinished(){
    }
}