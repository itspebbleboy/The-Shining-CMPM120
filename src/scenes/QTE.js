class QTE extends Phaser.Scene {
  constructor() {
    super("qteScene");
    this.qteInProgress = false;
    this.dialogueList = [
      "This is the first line of dialogue. I'm writing it really long so that hopefully it'll wrap. Will it wrap?",
      "Second dialogue",
      "Third dialogue",
      // Add more dialogues as needed
    ];
    this.currentTextIndex = 0;
    this.fastForward = false;
    this.currentIndex = 0;
    this.textCrawlActive = false;
    this.qteInputOptions = ['a', 'g', 'i', 'k', 'm', 'b', 'r', 'p'];
    this.currentQTEInputOption = null;
    this.qteCount = 3;
    this.completedQTEs = 0;
    this.qteTimer = null;
    this.qteTimerDuration = 5000;
    this.textCrawlSpeed = 100;
  }

  preload() {
    this.load.image('textBox', './assets/ui/textBox.png');
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');
  }

  create() {
    this.anims.create({
      key: 'gameoverScreen',
      frames: this.anims.generateFrameNames('shining_atlas', {
        prefix: 'gameover',
        start: 1,
        end: 5,
      }),
      frameRate: this.calculateFrameRate(5, this.qteTimerDuration),
    });

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

  calculateFrameRate(numFrames, duration) {
    return Math.floor(numFrames / (duration / 1000));
  }

  startQTE() {
    this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
    this.qteText = this.add.text(screen.center.x, screen.center.y, "Press " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
    this.qteInProgress = true;
    console.log("QTE started!");
    this.anims.play('gameoverScreen', true);
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
}
