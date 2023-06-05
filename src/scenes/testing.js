// for eye movement testing
class testing extends Phaser.Scene{
    constructor(){
        super("testingScene");
    }
    
    preload(){
        this.load.image('hallway', './assets/hallway.png');
        this.load.atlas('pupil', './assets/pupil.png', './assets/shining.json');

    }

    create(){
        this.add.image(0,0,'hallway').setOrigin(0,0);
        this.anims.create({
            key: 'pupil',
            frames: this.anims.generateFrameNames('shining', { 
                prefix: "pupil",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });

    }

    update(){

    }
}