class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.music = null;
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
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        //#endregion
        this.load.image('brownBackground', './assets/ui/brownBackground.png');
        this.load.audio('theme', './assets/audio/Theme.mp3');
        
    }

    create(){
        this.add.image(screen.center.x, screen.center.y, 'brownBackground');
        this.add.text(screen.center.x, screen.center.y-100, 'Escape', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y+50,'created by Tatiana Lucero and Athena Patronas\ntheme cover by Julian Rubinstein', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +600, 'press space to start', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +800, '↑ for scene select (for graders)', subHeaderConfig).setOrigin(0.5);
        console.log("level: " +levelHotel.num);
        if(!this.music){
        this.music = this.sound.add('theme').play({loop: true});
        }
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("introScene", levelHotel);
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("debugMenuScene");
        }
    }
}
