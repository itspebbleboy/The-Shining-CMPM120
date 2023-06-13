class DebugMenu extends Phaser.Scene {
    constructor() {
        super("debugMenuScene");
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
        this.add.text(screen.center.x, screen.center.y+50,'created by Tatiana Lucero and Athena Patronas\ntheme cover created by Julian Rubinstein', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +600, 'space to return to regular menu', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +200, '→ for hotel level', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +300, '← for hedge level', subHeaderConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +400, '↑ for bathroom cutscene', subHeaderConfig).setOrigin(0.5);
        
        this.add.text(screen.center.x, screen.center.y +500, '↓ for axe cutscene', subHeaderConfig).setOrigin(0.5);
        
        this.add.text(screen.center.x, screen.center.y +800, 'you only get to see da end cutscene \nif you escape hedge maze tho >:(', subHeaderConfig).setOrigin(0.5);
        //console.log("level: " +levelHotel.num);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("menuScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("playScene", levelHotel);
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("playScene", levelHedge);
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("bathroomScene", levelHedge);
        }
    }
}