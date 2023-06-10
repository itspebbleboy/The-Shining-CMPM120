class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutscene");
        // cutscene properties
    }

    preload(){
        //#region << LOADING CUTSCENE >>
        this.load.image('bat', './assets/cutscene/bat.png');
        this.load.image('bathroom0', './assets/cutscene/bathroom0.png');
        this.load.image('bathroom1', './assets/cutscene/bathroom1.png');
        this.load.image('bathroom2', './assets/cutscene/bathroom2.png');
        this.load.image('bathroom3', './assets/cutscene/bathroom3.png');
        this.load.image('bathroom4', './assets/cutscene/bathroom4.png');
        this.load.image('bathroom5', './assets/cutscene/bathroom5.png');
        this.load.image('dannyWindow', './assets/cutscene/dannyWindow.png');
        this.load.image('wendyWindow', './assets/cutscene/wendyWindow.png');
        this.load.image('farAwayJack', './assets/cutscene/farAwayJack.png');
        this.load.image('redrum', './assets/cutscene/redRum.png');
        this.load.image('endScene', './assets/cutscene/endScene.png');
        //#endregion
    }

    create(){
    //#region << LOADING IN TEXTBOX AND GAME OVER >>
    this.textBox = this.add.image(screen.center.x, screen.center.y + 400, 'textBox').setOrigin(0.5, 0);
  
    // << QTE ANIMATION >>
    this.gameover = this.anims.create({
      key: 'qte',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'jack',
        start: 1,
        end: 8
      }),
      frameRate: 1.5,
      repeat: -1,
    });
    this.cutsceneHelper = new CutsceneHelper();

    //#endregion
    }

    update(){

    }
    
}