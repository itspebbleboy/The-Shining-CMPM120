class IntroScene extends Phaser.Scene {
    constructor() {
        super("introScene");
        this.background;
        // cutscene properties
    }

    preload(){
        this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
        this.load.image('background', './assets/ui/brownBackground.png');
        this.load.image('bat', './assets/cutscene/bat.png');
        this.load.image('textBox', './assets/ui/textBox.png');
    }
    create(){
        //#region << LOADING IN TEXTBOX AND GAME OVER >>
        this.background = this.add.image(screen.center.x,screen.center.y, 'background');
        //this.textBox = this.add.image(screen.center.x, screen.center.y + 300, 'textBox').setOrigin(0.5, 0);
  
        // << QTE ANIMATION >>
        this.gameover = this.anims.create({
        key: 'qte',
        frames: this.anims.generateFrameNames('shining_atlas', {
            prefix: 'jack',
            start: 1,
            end: 8
        }),
        frameRate: 1
        });

        this.cutsceneHelper = new CutsceneHelper(this.gameover,this);
        //#endregion
        this.cutsceneHelper.iterateThroughDialogue(
            [
            "welcome to our adaptation of a movie you might have heard of. (press shift to advance)",
            
            "this is our build for our CMPM 120 class (june 2023).",
            
            "some content warnings before we begin:",
            
            "implied domestic abuse, implied child abuse, implied violence, implied death, knife imagery, and general dark themes, ",
            "now, it begins...",
            ], this.cutscenePartTwo, this);
    }
    update(){

    }

    cutscenePartTwo = () => {
        //this.cutsceneHelper.destroy();
        this.cutsceneHelper.iterateThroughDialogue(
            [
              "this is your husband.",
              "you've been in this hotel for a couple months now and he's slowly been becoming more and more aggressive with you and your son.",
              "he's getting closer, in this game you will be faced with moments like these where you have to act quickly.",
              "you managed to get this baseball bat,",
              "It's starting to look like…",
              "you're going to have to use it.",
            ],
            this.batQTE, this,
        );

        this.background.destroy();
        this.background = this.add.image(screen.center.x, screen.center.y, 'bat');

      };
      
    batQTE=() =>{
        console.log(">>> batQTE");
        this.cutsceneHelper.createBlinkingText("SWING THE BAT", 2000, this);
        this.cutsceneHelper.startQTE(3, this.cutscenePartThree, this);
    }
    cutscenePartThree = () =>{
        this.background.destroy()
        this.background = this.add.image(screen.center.x,screen.center.y, 'background');
        this.cutsceneHelper.iterateThroughDialogue( [
            "well done.",
            "he's unconscious now, the time you have to act is small.",
            "you managed to lock him in the hotel's kitchen pantry but you don't know how long that'll hold him back.",
            "you grabbed a knife while you were there.",
            "you have to go back to your room to get your son and escape.",
        ], this.startScene, this)
    }
    startScene = () =>{
        this.scene.start("playScene", levelHotel);
    }
}