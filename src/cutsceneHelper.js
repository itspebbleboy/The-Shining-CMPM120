class CutsceneHelper {
    constructor(deathAnim, scene, textBox) {
      //#region QTE properties
      this.qteInProgress = false;
      this.dialogueList = []; // Array of dialogue lines
      this.currentTextIndex = 0; // Index of the current character being displayed in the dialogue
      this.fastForward = false; // Flag to enable fast forward
      this.currentIndex = 0; // Index of the current dialogue in the dialogue list
      this.textCrawlActive = false; // Flag to indicate if text crawl is active
      this.qteInputOptions = ['a', 'g', 'i', 'k', 'm', 'b', 'r', 'p']; // Array of QTE input options
      this.currentQTEInputOption = null; // Current QTE input option
      this.completedQTEs = 0; // Number of completed QTEs
      this.qteTimer = null; // Timer for QTE duration
      this.qteTimerDuration = 1000; // Duration of QTE timer = 5 seconds
      this.textCrawlSpeed = 20; // Speed of text crawl in milliseconds
      this.textCrawl = null;
      this.animCreate = deathAnim;
      this.scene= scene;
      this.textBox=textBox;
      //#endregion
    }  
  
    //#region <<QTE HANDLING>>
    startQTE(qteCount = 1, onSuccess) {
        this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
        this.qteText = this.scene.add.text(screen.center.x, screen.center.y+200, "Press" + " " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
        this.qteInProgress = true;
        console.log("QTE started!");
        this.qteTimer = this.scene.time.delayedCall(this.qteTimerDuration, this.handleQTEFailure, [], this);
        console.log("QTE timer started!");
        //this.animation = this.scene.add.sprite(screen.center.x,screen.center.y,'qte').play();
        this.scene.input.keyboard.removeAllListeners();
        this.scene.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), this.handleQTEInput, [qteCount, onSuccess], this);
    }
    
    handleQTEInput(event, qteCount, onSuccess) {
        if(this.animation){ this.animation.destroy(); }
        if (this.qteInProgress && event.key === this.currentQTEInputOption) {
          console.log("QTE input handled!");
          this.qteInProgress = false;
          this.qteTimer.remove();
          this.qteText.destroy();
          qteCount--;
      
          if (qteCount !=0) {
            this.startQTE(qteCount);
          } else {
            console.log("All QTEs completed");
            this.handleQTESuccess(onSucess);
          }
        }
    }
    handleQTESuccess(onSucess) {
      console.log("All QTEs completed");
      this.add.text(screen.center.x, screen.center.y, "All QTEs complete!", defaultQTEStyle).setOrigin(0.5, 0.5);
      onSucess();
    }
    handleQTEFailure() {
      console.log("QTE failure!");
      this.qteInProgress = false;
      this.qteText.destroy();
      
      this.createBlinkingText("IT'S OVER, TRY AGAIN", 2000);
      this.scene.time.delayedCall(2000, () => {
        this.scene.scene.restart();
      });

    }
    //#endregion

    //#region << TEXT HANDLING >>
    iterateThroughDialogue(dialogueList, onComplete, textBox) {
      let currentIndex = 0;
      this.startNextDialogue(dialogueList[currentIndex], textBox);
    
      const shiftKeyDownHandler = () => {

        if (!this.textCrawlActive) {
          console.log("hi we in !this.textCrawlActive");
          if (currentIndex === dialogueList.length - 1) {
            if (this.textCrawl && !this.textCrawl.destroyed) {
              this.textCrawl.destroy();
            }
            onComplete();
          } else {
            currentIndex++;
            console.log(currentIndex);
            if (this.textCrawl && !this.textCrawl.destroyed) {
              this.textCrawl.destroy();
            }
            this.fastForward = true; // Set fast-forward flag to true
            this.startNextDialogue(dialogueList[currentIndex], textBox);
            console.log("Proceeding to next dialogue");
          }
        }
      };
      
    
      const shiftKeyUpHandler = () => {
        this.fastForward = false;
      };
    
      this.scene.input.keyboard.on("keydown-SHIFT", shiftKeyDownHandler);
      this.scene.input.keyboard.on("keyup-SHIFT", shiftKeyUpHandler);
    }
    
    
    startNextDialogue(dialogue, textBox) {
      const textBoxPaddingX = 100;
      const textBoxPaddingY = 100;
      const textBoxX = this.scene.textBox.x - this.scene.textBox.width * this.scene.textBox.originX;
      const textBoxY = this.scene.textBox.y - this.scene.textBox.height * this.scene.textBox.originY;
      const textX = textBoxX + textBoxPaddingX;
      const textY = textBoxY + textBoxPaddingY;
      console.log("hi we here");
      this.textCrawl = this.scene.add.text(textX, textY, "", defaultTextCrawlStyle); // Assign to this.textCrawl
      this.textCrawl.setOrigin(0, 0);
      this.textCrawl.setWordWrapWidth(this.scene.textBox.width - textBoxPaddingX * 2);
      console.log(this.textCrawl.text);
      this.fastForward = false;
      this.currentTextIndex = 0;
      this.textCrawlActive = true;
      this.addCharacter(dialogue, this.textCrawl);
    }
    
      
      
    addCharacter(dialogue, textCrawl) {
      this.currentTextIndex++;
      textCrawl.text = dialogue.substring(0, this.currentTextIndex);
    
      if (this.currentTextIndex < dialogue.length && !this.fastForward) {
        const delay = this.fastForward ? 0 : this.textCrawlSpeed;
        this.scene.time.delayedCall(delay, () => this.addCharacter(dialogue, textCrawl)); // Use textCrawl instead of this.textCrawl
      } else {
        this.textCrawlActive = false;
        if (this.fastForward) {
          // Fast-forward: Set the full dialogue text immediately
          textCrawl.text = dialogue;
        }
        console.log("Setting textCrawlActive to false");
      }
    }
    
    
    //#endregion

    createBlinkingText(textString, duration, scene, x = screen.center.x, y = screen.center.y) {
      console.log("Scene:", scene);
      let style = defaultHeaderStyle
      let text = scene.add.text(x, y, textString, style); 
      text.setOrigin(0.5);
      text.setDepth(depth.deathAnims);
    
      const blinkDuration = 500; // Duration of each blink in milliseconds
      const visiblePauseDuration = 200; // Duration to keep the text visible between blinks
      const repeatCount = Math.floor(duration / (blinkDuration + visiblePauseDuration)); // Calculate the number of repeats
    
      let currentRepeat = 0; // Counter for the current repeat
    
      const blinkAnimation = () => {
        currentRepeat++;
    
        // Set the alpha to 0 after the visible pause duration
        scene.time.delayedCall(visiblePauseDuration, () => {
          text.alpha = 0;
        });
    
        // Set the alpha to 1 after the blink duration
        scene.time.delayedCall(visiblePauseDuration + blinkDuration, () => {
          text.alpha = 1;
        });
    
        // Repeat the blink animation until the desired number of repeats is reached
        if (currentRepeat < repeatCount) {
          scene.time.delayedCall(visiblePauseDuration + blinkDuration * 2, blinkAnimation);
        } else {
          // Destroy the text object when the blinking is complete
          scene.time.delayedCall(visiblePauseDuration + blinkDuration * 2, () => {
            text.destroy();
          });
        }
      };
    
      // Start the blinking animation
      blinkAnimation();
    }
  }
  