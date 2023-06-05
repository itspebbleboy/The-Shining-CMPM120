// for eye movement testing
class testing extends Phaser.Scene{
    constructor(){
        super("testingScene");
    }
    
    preload(){
        this.load.image('hallway', './assets/hotel/hallway.png');
        this.load.atlas('pupil_atlas', './assets/eye/pupil.png', './assets/eye/shining.json');

    }

    create(){
        this.add.image(0,0,'hallway').setOrigin(0,0);

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNames('pupil_atlas', { 
                prefix: "pupil",
                start: 1, 
                end: 4, 
            }),
            frameRate: 10,
            repeat: -1
        });

        this.add.image(0,0,'pupil_atlas', 'pupil1').setOrigin(0,0);
    }

    update(){

    }
}