class QTE extends Phaser.Scene {
    constructor() {
      super("qteScene");
      this.qteInProgress = false;
      this.dialogueList = [];
      this.currentTextIndex = 0;
      this.fastForward = false;
      this.currentIndex = 0;
      this.waitForSpace = false;
      this.textCrawl = null;
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
      const textCrawlSpeed = 100; // Adjust the speed of the text crawl (time between each character)
  
      const addCharacter = (textCrawlText) => {
        this.currentTextIndex++;
        this.textCrawl.text = textCrawlText.substring(0, this.currentTextIndex);
  
        if (this.currentTextIndex < textCrawlText.length) {
          const delay = this.fastForward ? 0 : textCrawlSpeed;
          this.time.delayedCall(delay, addCharacter, [textCrawlText]);
        } else {
          if (this.currentIndex < this.dialogueList.length - 1) {
            this.currentIndex++;
            this.currentTextIndex = 0;
            const nextTextCrawlText = this.dialogueList[this.currentIndex];
            addCharacter(nextTextCrawlText);
          } else {
            this.waitForSpace = true;
          }
        }
      };
  
      const startNextDialogue = () => {
        console.log("starting next ")
        if (this.currentIndex >= this.dialogueList.length) {
          this.startQTE();
          return;
        }
  
        const dialogue = this.dialogueList[this.currentIndex];
  
        this.textCrawl = this.add.text(screen.botMid.x, screen.botMid.y - 20, "", defaultTextCrawlStyle);
  
        this.textCrawl.setOrigin(0, 1);
        this.textCrawl.setAlign("center");
  
        this.currentTextIndex = 0;
        this.waitForSpace = false;
  
        addCharacter(dialogue);
      };
  
      startNextDialogue();
  
      // Add event listener for the spacebar key during text crawl
      this.input.keyboard.on("keydown-SPACE", () => {
        if (!this.waitForSpace) {
            if (this.currentIndex === this.dialogueList.length - 1) {
                // Last dialogue, start QTE
                this.startQTE();
            }else {
            // Proceed to the next dialogue
                this.currentIndex++;
                this.textCrawl.destroy();
                startNextDialogue();
            }
        }
      });
  
      // Add event listener for the spacebar key during QTE
      this.input.keyboard.on("keydown-SPACE", this.handleQTEInput, this);
  
      // Enable fast forward on shift keydown
      this.input.keyboard.on("keydown-SHIFT", () => {
        this.fastForward = true;
      });
  
      // Disable fast forward on shift keyup
      this.input.keyboard.on("keyup-SHIFT", () => {
        this.fastForward = false;
      });
    }
  
    // ...
  
    startQTE() {
      // QTE logic goes here
      // display text
      this.qteText = this.add.text(screen.topMid.x, screen.topMid.y, "Press SPACE!", defaultQTEStyle);
      this.qteInProgress = true; // Set the QTE in progress flag to true
      console.log("QTE started!");
    }
  
    handleQTEInput() {
      // QTE input handling goes here
      if (this.qteInProgress) {
        console.log("QTE input detected!");
        this.qteInProgress = false;
      }
    }
  }
  