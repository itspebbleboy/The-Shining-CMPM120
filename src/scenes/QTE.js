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
  }

  preload() {
    this.dialogueList = [
      "First dialogue",
      "Second dialogue",
      "Third dialogue",
      // Add more dialogues as needed
    ];
  }

  create() {
    this.textCrawlSpeed = 100; // Adjust the speed of the text crawl (time between each character)
  
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
    // QTE logic goes here
    // Generate a new random QTE input option
    this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];

    // Display text
    this.qteText = this.add.text(screen.topMid.x, screen.topMid.y, "Press " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle);
    this.qteInProgress = true; // Set the QTE in progress flag to true
    console.log("QTE started!");

    // Update event listener for the new QTE input option
    this.input.keyboard.removeAllListeners(); // Remove all previous event listeners
    this.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), this.handleQTEInput, this);
  }

  handleQTEInput(event) {
    // QTE input handling goes here
    if (this.qteInProgress && event.key === this.currentQTEInputOption) {
      console.log("QTE input handled!");
      this.qteInProgress = false;
    }
  }

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
  
    this.textCrawl = this.add.text(screen.botMid.x, screen.botMid.y - 20, "", defaultTextCrawlStyle);
    this.textCrawl.setOrigin(0, 1);
    this.textCrawl.setAlign("center");
  
    this.currentTextIndex = 0;
    this.textCrawlActive = true; // Set the text crawl state to active
  
    this.addCharacter(dialogue);
  }
}
