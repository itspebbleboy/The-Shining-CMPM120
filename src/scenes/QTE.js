class QTE extends Phaser.Scene {
  constructor() {
    super("qteScene");
    this.qteInProgress = false;
    this.dialogueList = [];
    this.currentTextIndex = 0;
    this.fastForward = false;
    this.currentIndex = 0;
    this.textCrawlActive = false; // Flag to track the text crawl state
    this.qteInputOptions = ['a', 'g', 'i', 'k', 'm', 'b', 'r', 'p']; // QTE input options
    this.currentQTEInputOption = null; // Current QTE input option
    this.qteCount = 3; // Number of QTEs
    this.completedQTEs = 0; // Number of completed QTEs
    this.qteTimer = null; // Timer for QTE
    this.qteTimerDuration = 5000; // Duration of the QTE timer in milliseconds (5 seconds)
  }
  preload() {
    this.dialogueList = [
      "this is the First line of dialogue omg i'm writing it really long so that hopefully it'll wrap omg will it wrap?",
      "Second dialogue",
      "Third dialogue",
      // Add more dialogues as needed
    ];
    this.load.atlas('shining_atlas', './assets/shining.png', './assets/shining.json');  // holds the closing eye animation -> might add more to json later one who knows
    this.load.image('textBox', './assets/ui/textBox.png');
    //qte images

    this.load.image('deathText', './assets/ui/deathText.png');
    this.load.image('restartText', './assets/ui/restartText.png');

    this.load.image('QTE1', './assets/ui/QTE.png');
    this.load.image('QTE2', './assets/ui/QTE.png');
    this.load.image('QTE3', './assets/ui/QTE.png');
    this.load.image('QTE4', './assets/ui/QTE.png');
    this.load.image('QTE5', './assets/ui/QTE.png');

  }

  create() {

    this.anims.create({
      key: 'gameoverScreen',
      frames: this.anims.generateFrameNames('shining_atlas', { 
          prefix: "gameover",
          start: 1, 
          end: 5, 
      }),
      frameRate: 20,  // change as needed
      //repeat: -1
      
  });

    this.textCrawlSpeed = 100; // Adjust the speed of the text crawl (time between each character)
    this.textBox = this.add.image(screen.center.x,screen.center.y+400,'textBox').setOrigin(0.5,0);
    this.startNextDialogue();
  
    // Add event listener for the spacebar key during text crawl and QTE
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.textCrawlActive) {
        // If the text crawl is not active, proceed to the next dialogue when spacebar is pressed
        if (this.currentIndex === this.dialogueList.length - 1) {
          // Last dialogue, start QTE
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
    // Add event listener for the Shift key to enable fast forward
    this.input.keyboard.on("keydown-SHIFT", () => {
      this.fastForward = true;
    });

    // Add event listener for releasing the Shift key to disable fast forward
    this.input.keyboard.on("keyup-SHIFT", () => {
      this.fastForward = false;
    });
  }

  startQTE() {
    // Generate a new random QTE input option
    this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];

    // Display text
    const qteSprite = this.add.sprite(screen.center.x, screen.center.y, 'qteSpritesheet');
    const numFrames = qteSprite.anims.currentAnim.frames.length;
    const frameRate = numFrames / (this.qteTimerDuration / 1000); // Calculate the frame rate based on the number of frames and QTE duration
    qteSprite.anims.play('qteAnimation', true).setFrameRate(frameRate);
    this.qteSprites.add(qteSprite);

    // Show the death text after the QTE duration
    this.time.delayedCall(this.qteTimerDuration, () => {
      this.deathText = this.add.image(screen.center.x, screen.center.y, 'deathText');
    });

    // Show the restart text after a delay
    const restartDelay = this.qteTimerDuration + 1000; // Add a delay of 1 second after the QTE duration
    this.time.delayedCall(restartDelay, () => {
      this.restartText = this.add.image(screen.center.x, screen.center.y, 'restartText');
    });

    // Update event listener for the new QTE input option
    this.input.keyboard.removeAllListeners(); // Remove all previous event listeners
    this.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), this.handleQTEInput, this);
  }

  handleQTEInput(event) {
    // QTE input handling goes here
    if (this.qteInProgress && event.key === this.currentQTEInputOption) {
      console.log("QTE input handled!");
      this.qteInProgress = false;
      this.qteTimer.remove(); // Remove the QTE timer
      this.qteText.destroy(); // Destroy the current QTE text

      this.completedQTEs++;

      if (this.completedQTEs < this.qteCount) {
        // Start the next QTE
        this.startQTE();
      } else {
        // All QTEs completed, do something else
        console.log("All QTEs completed");
      }
    }
    if (this.completedQTEs === this.qteCount) {
      this.completionText = this.add.text(screen.center.x, screen.center.y, 'All QTEs are completed!', { font: '24px Arial', fill: '#ffffff' }).setOrigin(0.5);
    }
  }

  handleQTEFailure() {
    console.log("QTE failure!");

    this.qteInProgress = false;
    this.qteText.destroy(); // Destroy the current QTE text

    // Display failure message
    this.failureText = this.add.text(screen.topMid.x, screen.topMid.y, "You were too slow, you lost!", defaultQTEStyle);
    this.time.delayedCall(2000, () => {
      this.failureText.destroy();
      /*
      if (this.completedQTEs < this.qteCount) {
        // Start the next QTE
        this.startQTE();
      } else {
        // All QTEs completed, do something else
        console.log("All QTEs completed");
      }*/
    });
  }

  // ...

  addCharacter(dialogue) {
    this.currentTextIndex++;
    this.textCrawl.text = dialogue.substring(0, this.currentTextIndex);

    if (this.currentTextIndex < dialogue.length) {
      const delay = this.fastForward ? 0 : this.textCrawlSpeed;
      this.time.delayedCall(delay, () => this.addCharacter(dialogue));
    } else {
      this.textCrawlActive = false; // Set the text crawl state to inactive
      console.log("setting textCrawlActive false");
    }
  }

  startNextDialogue() {
    if (this.currentIndex >= this.dialogueList.length) {
      // All dialogues completed, exit or do something else
      return;
    }
  
    const dialogue = this.dialogueList[this.currentIndex];

    const textBoxPaddingX = 50; // Padding in the X direction
    const textBoxPaddingY = 50; // Padding in the Y direction
  
    // Calculate the position of the text box
    const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
    const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
  
    // Calculate the position of the text
    const textX = textBoxX + textBoxPaddingX;
    const textY = textBoxY + textBoxPaddingY;
  
    this.textCrawl = this.add.text(textX, textY, "", defaultTextCrawlStyle);
    this.textCrawl.setOrigin(0, 0);
    this.textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);
  
    this.currentTextIndex = 0;
    this.textCrawlActive = true; // Set the text crawl state to active
  
    this.addCharacter(dialogue);
  }
}
