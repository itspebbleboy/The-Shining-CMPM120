class QTE extends Phaser.Scene {
  constructor() {
    super("qteScene");
    // QTE properties
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
    this.qteTimerDuration = 5000; // Duration of QTE timer in milliseconds
    this.textCrawlSpeed = 100; // Speed of text crawl in milliseconds
    this.dialogueList = [
      "this is my dialogue one",
      "this is dialogue two",
    ]
  }

  preload() {
    this.load.image('textBox', './assets/ui/textBox.png');
  }

  create() {
    this.textBox = this.add.image(screen.center.x, screen.center.y + 400, 'textBox').setOrigin(0.5, 0);
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
      }
    }
  }

  handleQTEFailure() {
    console.log("QTE failure!");

    this.qteInProgress = false;
    this.qteText.destroy();

    this.failureText = this.add.text(screen.topMid.x, screen.topMid.y, "You were too slow, you lost!", defaultQTEStyle);
    this.time.delayedCall(2000, () => {
      this.failureText.destroy();
    });
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
