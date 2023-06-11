class BathroomScene extends Phaser.Scene {
    constructor() {
        super("bathroomScene");
        // cutscene properties
    }

    preload(){
        this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
        this.load.image('background', './assets/ui/brownBackground.png');
        this.load.image('textBox', './assets/ui/textBox.png');

        this.load.image('bathroom0', './assets/cutscene/bathroom1.png');
        this.load.image('bathroom1', './assets/cutscene/bathroom2.png');
        this.load.image('bathroom2', './assets/cutscene/bathroom3.png');
        this.load.image('bathroom3', './assets/cutscene/bathroom4.png');
        this.load.image('bathroom4', './assets/cutscene/bathroom5.png');
        this.load.image('bathroom5', './assets/cutscene/bathroom6.png');
        this.load.image('dannyWindow', './assets/cutscene/dannyWindow.png');
        this.load.image('wendyWindow', './assets/cutscene/wendyWindow.png');
        this.load.image('farAwayJack', './assets/cutscene/farAwayJack.png');
        this.load.image('redrum', './assets/cutscene/redRum.png');
        this.load.image('openWindow','./assets/cutscene/openWindow.png');
        this.load.image('closeWindow','./assets/cutscene/closeWindow.png');
        this.load.audio('doorLocked', './assets/audio/doorLocked.mp3');

    }create(){
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
            frameRate: 20,
        });
        
        this.cutsceneHelper = new CutsceneHelper(this.gameover,this);
        this.background = this.add.image(screen.center.x,screen.center.y, 'redrum').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "you found your room and your son,",
                "but you know your husband draws near",
            ], this.cutscenePartTwo, this);

    }update(){

    }
    cutscenePartTwo= () =>{
        //DORKNOB AUDIO
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "oh god,",
                "he's right outside!",
            ], this.cutscenePartThree, this);
    }
    cutscenePartThree= () =>{
        this.cutsceneHelper.createBlinkingText("GRAB YOUR SON", 2000, this);
        this.cutsceneHelper.startQTE(3, this.cutscenePartFour, this);
    }
    cutscenePartFour= () =>{
        this.background.destroy();
        this.background = this.add.image(screen.center.x,screen.center.y, 'background').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "he made it into the room, but you've locked yourself and your son in the bathroom.",
                "you've bought yourself some time but he's going to eventually get in here.",
            ], this.cutscenePartFive, this);
    }
    cutscenePartFive= () =>{
        this.background.destroy();
        this.background = this.add.image(screen.center.x,screen.center.y, 'closeWindow').setOrigin(0.5,0.5); //REPLACE WITH EMPTY WINDOW
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "wait,",
                "the window!",
            ], this.cutscenePartSix, this);
    }
    cutscenePartSix= () =>{
        this.cutsceneHelper.createBlinkingText("PUSH YOUR SON THROUGH", 2000, this);
        this.cutsceneHelper.startQTE(2, this.cutscenePartSeven, this);
    }
    cutscenePartSeven= () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'wendyWindow').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "now,",
                "he made it out but",
                "you still have to escape",
            ], this.cutscenePartEight, this);
    }
    cutscenePartEight =() =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'openWindow').setOrigin(0.5,0.5); //REPLACE WITH EMPTY WINDOW
        this.cutsceneHelper.createBlinkingText("ESCAPE THROUGH THE WINDOW", 2000, this);
        this.cutsceneHelper.startQTE(2, this.cutscenePartNine, this);
    }
    cutscenePartNine = () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'wendyWindow').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "you didn't fit through",
                "you told your son to run",
                "you're not sure if you're going to survive this",
            ], this.cutscenePartTen, this);
    }
    cutscenePartTen = () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'background').setOrigin(0.5,0.5); //THIS ONE STAYS BACKGROUND
        //PLAY AXE TO DOOR AUDIO
        this.cutsceneHelper.createBlinkingText("MOVE TO THE CORNER", 2000, this);
        this.cutsceneHelper.startQTE(2, this.cutscenePartEleven, this);
    }
    cutscenePartEleven = () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'bathroom0').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "that was close,",
                "but it isn't over",
            ], this.cutscenePartTwelve, this);
    }
    cutscenePartTwelve = () =>{
        //PLAY ANIMATION
        //on animation complete, play QTE
        this.cutsceneHelper.createBlinkingText("USE THE KNIFE", 2000, this);
        this.cutsceneHelper.startQTE(5, this.cutscenePartThirteen, this);
    }
    cutscenePartThirteen = () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'background').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "it's cold",
                "your mother...",
            ], this.cutscenePartFourteen, this);
    }
    cutscenePartFourteen= () => {
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'dannyWindow').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "she told you to run",
                "you don't know what's gonna happen to her",
                "you don't have much time to really think about it",
            ], this.cutscenePartFifteen, this);
    }
    cutscenePartFifteen = () =>{
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'farAwayJack').setOrigin(0.5,0.5);
        this.cutsceneHelper.iterateThroughDialogue(
            [
                "because...",
                "he's here."
            ], this.cutscenePartSixteen, this);
    }
    cutscenePartSixteen= () => {
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'background').setOrigin(0.5,0.5);
        this.cutsceneHelper.createBlinkingText("RUN", 2000, this);
        this.cutsceneHelper.startQTE(5, this.cutscenePartSeventeen, this);
    }
    cutscenePartSeventeen = () => {
        if(this.background) {this.background.destroy();}
        this.background = this.add.image(screen.center.x,screen.center.y, 'background').setOrigin(0.5,0.5); //REPLACE WITH MAZE ENTRANCE
        this.cutsceneHelper.createBlinkingText("ENTER THE MAZE", 2000, this);
        this.cutsceneHelper.startQTE(2, this.startScene, this);
    }
    startScene= () =>{
        this.scene.start("playScene", levelHedge);
    }
}