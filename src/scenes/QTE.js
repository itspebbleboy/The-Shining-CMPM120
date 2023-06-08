class QTE extends Phaser.Scene {
  constructor() {
    super("qteScene");
    //#region QTE properties
    this.qteInProgress = false;
    this.dialogueList = []; // Array of dialogue lines
    this.currentTextIndex = 0; // Index of the current character being displayed in the dialogue
    this.fastForward = false; // Flag to enable fast forward
    this.currentIndex = 0; // Index of the current dialogue in the dialogue list
    this.textCrawlActive = false; // Flag to indicate if text crawl is active
    this.qteInputOptions = ['a', 'g', 'i', 'k', 'm', 'b', 'r', 'p']; // Array of QTE input options
    this.currentQTEInputOption = null; // Current QTE input option
    this.qteCount = 5; // Number of QTEs to complete
    this.completedQTEs = 0; // Number of completed QTEs
    this.qteTimer = null; // Timer for QTE duration
    this.qteTimerDuration = 1000; // Duration of QTE timer = 5 seconds
    this.textCrawlSpeed = 100; // Speed of text crawl in milliseconds
    this.dialogueList = [
      "this is my dialogue one",
      "this is dialogue two",
    ]
    //#endregion
  }

  preload() {
    keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.load.image('textBox', './assets/ui/textBox.png');
    this.load.image('youDied', './assets/ui/youDiedText.png');
    this.load.image('restart', './assets/ui/spaceRestartTest.png');
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');
  }

  create() {
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

    //#endregion
    this.startNextDialogue();

    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.textCrawlActive) {
        if (this.currentIndex === this.dialogueList.length - 1) {
          this.textCrawl.destroy();
          this.startQTE();
        } else {
          this.currentIndex++;
          this.textCrawl.destroy();
          this.startNextDialogue();
          console.log("Proceeding to next dialogue");
        }
      }
    });

    this.input.keyboard.on("keydown-SHIFT", () => {
      this.fastForward = true;
    });

    this.input.keyboard.on("keyup-SHIFT", () => {
      this.fastForward = false;
    });
  }

  //#region <<QTE HANDLING>>
  startQTE() {
    this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
    this.qteText = this.add.text(screen.center.x, screen.center.y, "Press " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
    this.qteInProgress = true;
    console.log("QTE started!");
    this.qteTimer = this.time.delayedCall(this.qteTimerDuration, this.handleQTEFailure, [], this);
    console.log("QTE timer started!");

    this.input.keyboard.removeAllListeners();
    this.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), this.handleQTEInput, this);
  }
  
  handleQTEInput(event) {
    if (this.qteInProgress && event.key === this.currentQTEInputOption) {
      console.log("QTE input handled!");
      this.qteInProgress = false;
      this.qteTimer.remove();
      this.qteText.destroy();
      this.completedQTEs++;
  
      if (this.completedQTEs < this.qteCount) {
        this.startQTE();
      } else {
        console.log("All QTEs completed");
        this.handleQTESuccess();
      }
    }
  }
  handleQTESuccess() {
    console.log("All QTEs completed");
    this.add.text(screen.center.x, screen.center.y, "All QTEs complete!", defaultQTEStyle).setOrigin(0.5, 0.5);
  }
  handleQTEFailure() {
    console.log("QTE failure!");
    this.qteInProgress = false;
    this.qteText.destroy();

    this.failureText1 = this.add.image(screen.center.x-20, screen.center.y-20, "youDied"); // adding the uyou died
    this.failureText2 = this.add.image(screen.center.x, screen.center.y, "restart"); // adding the restart text
    this.time.delayedCall(2000, () => {
      this.failureText1.destroy();    // destroys the text
      this.failureText2.destroy();    // destroys the text
      this.scene.start('menuScene');
    });
    /* well fuck me ig
    if(keySPACE.isDown){
      console.log("i pressed space"); 
      qteScene.scene.restart();  // restarts to menu
    }
    */
  }
  //#endregion

  //#region << TEXT HANDLING >>
  addCharacter(dialogue) {
    this.currentTextIndex++;
    this.textCrawl.text = dialogue.substring(0, this.currentTextIndex);

    if (this.currentTextIndex < dialogue.length) {
      const delay = this.fastForward ? 0 : this.textCrawlSpeed;
      this.time.delayedCall(delay, () => this.addCharacter(dialogue));
    } else {
      this.textCrawlActive = false;
      console.log("Setting textCrawlActive false");
    }
  }

  startNextDialogue() {
    if (this.currentIndex >= this.dialogueList.length) {
      return;
    }

    const dialogue = this.dialogueList[this.currentIndex];
    const textBoxPaddingX = 50;
    const textBoxPaddingY = 50;
    const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
    const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
    const textX = textBoxX + textBoxPaddingX;
    const textY = textBoxY + textBoxPaddingY;

    this.textCrawl = this.add.text(textX, textY, "", defaultTextCrawlStyle);
    this.textCrawl.setOrigin(0, 0);
    this.textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);

    this.currentTextIndex = 0;
    this.textCrawlActive = true;
    this.addCharacter(dialogue);
  }
  //#endregion
}
