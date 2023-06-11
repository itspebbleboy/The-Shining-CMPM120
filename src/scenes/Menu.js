class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //#region << EXCESSIVE AMOUNT OF KEYS >>
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        //#endregion
        this.load.image('brownBackground', './assets/ui/brownBackground.png');
        this.load.audio('theme', './assets/audio/Theme.mp3');
        
    }

    create(){
        this.add.image(screen.center.x, screen.center.y, 'brownBackground');
        this.add.text(screen.center.x, screen.center.y, 'THE SHINING BY:\n Tatiana Lucero and Athena Patronas', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +250, 'press <-- for game', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +350, 'press --> for hotel', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +450, 'press UP for hedge', headerConfig).setOrigin(0.5);
        console.log("level: " +levelHotel.num);
        this.sound.add('theme').play();
        this.add.text(screen.center.x, screen.center.y +550, 'press DOWN for murder', headerConfig).setOrigin(0.5);
    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //this.scene.start("qteScene");
            this.scene.start("introScene", levelHotel);
          }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("playScene", levelHotel );
          }
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("playScene", levelHedge );
        }
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
            this.scene.start("axeScene");
        }
    }
}
