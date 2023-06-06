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
    }

    create(){
        this.add.text(screen.center.x, screen.center.y, 'THE SHINING BY:\n Tatiana Lucero and Athena Patronas', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +250, 'press <-- for QTE Practice', headerConfig).setOrigin(0.5);
        this.add.text(screen.center.x, screen.center.y +350, 'press --> for Hotel Exploration', headerConfig).setOrigin(0.5);
    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("qteScene");
          }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("playScene");
          }
  
    }
}
