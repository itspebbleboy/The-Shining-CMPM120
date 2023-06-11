class AxeScene extends Phaser.Scene {
    constructor() {
        super("axeScene");
        // cutscene properties
    }

    preload(){
        this.load.image('bathroom0', './assets/cutscene/bathroom1.png');
        this.load.image('bathroom1', './assets/cutscene/bathroom2.png');
        this.load.image('bathroom2', './assets/cutscene/bathroom3.png');
        this.load.image('bathroom3', './assets/cutscene/bathroom4.png');
        this.load.image('bathroom4', './assets/cutscene/bathroom5.png');
        this.load.image('bathroom5', './assets/cutscene/bathroom6.png');
    }

    create(){
        this.anims.create({
                key: 'axeScene',
                frames: [
                    {key: 'bathroom0', frame:null},
                    {key: 'bathroom1', frame:null},
                    {key: 'bathroom2', frame:null},
                    {key: 'bathroom3', frame:null},
                    {key: 'bathroom4', frame:null},
                    {key: 'bathroom5', frame:null}
                ],
                frameRate: 1,
         });
         this.add.sprite(screen.center.x,screen.center.y).play('axeScene'); // play axe
    }
    
}
