class BathroomScene extends Phaser.Scene {
    constructor() {
        super("bathroomScene");
        // cutscene properties
    }

    preload(){
        this.load.image('background', './assets/ui/brownBackground.png');
        this.load.image('bat', './assets/cutscene/bat.png');
        this.load.image('textBox', './assets/ui/textBox.png');

        this.load.image('bathroom0', './assets/cutscene/bathroom0.png');
        this.load.image('bathroom1', './assets/cutscene/bathroom1.png');
        this.load.image('bathroom2', './assets/cutscene/bathroom2.png');
        this.load.image('bathroom3', './assets/cutscene/bathroom3.png');
        this.load.image('bathroom4', './assets/cutscene/bathroom4.png');
        this.load.image('bathroom5', './assets/cutscene/bathroom5.png');
        this.load.image('wendyWindow', './assets/cutscene/wendyWindow.png');
        this.load.image('farAwayJack', './assets/cutscene/farAwayJack.png');
        this.load.image('redrum', './assets/cutscene/redRum.png');
    }create(){
        
    }update(){

    }
    sceneFinished(){
    }
}