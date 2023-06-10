class CutsceneHelper {
    constructor(deathAnim, scene) {
      //#region QTE properties
      this.qteInProgress = false;
      this.dialogueList = []; // Array of dialogue lines
      this.currentIndex = 0;
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
      console.log(this.scene);
      //#endregion
    }  
  
    //#region <<QTE HANDLING>>
    startQTE(qteCount = 1, onSuccess, scene) {
        this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
        this.qteText = scene.add.text(screen.center.x, screen.center.y+200, "Press" + " " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
        this.qteInProgress = true;
        console.log("QTE started!");
        this.qteTimer = scene.time.delayedCall(this.qteTimerDuration, this.handleQTEFailure, [], this);
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

    iterateThroughDialogue(dialogueList, onComplete, scene) {
      console.log("scene in iterateThruDia: " + scene);
      this.textBox = scene.add.image(screen.center.x, screen.center.y + 300, 'textBox');
      const textBoxPaddingX = 100;
      const textBoxPaddingY = 100;
      const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
      const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
      const textX = textBoxX + textBoxPaddingX;
      const textY = textBoxY + textBoxPaddingY;
  
      this.textCrawl = scene.add.text(textX, textY, "", defaultTextCrawlStyle);
      this.textCrawl.setOrigin(0, 0);
      this.textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);
      this.textCrawl.setDepth(4);
  
      const shiftKeyDownHandler = () => {
        if (!this.textCrawlActive) {
          // LAST INDEX, EXIT DIALOGUE
          if (this.currentIndex === dialogueList.length - 1) {
            if (this.textCrawl && !this.textCrawl.destroyed) {
              this.textCrawl.destroy();
            }
            onComplete();
            if (this.textBox) { this.textBox.destroy(); }
            this.destroy();
          }
          // CONTINUE WITH NEW TEXT & RESET TEXT CRAWL
          else {
            if (this.textCrawl && !this.textCrawl.destroyed) {
              this.textCrawl.text = "";
              console.log("resetting text to be \"\"");
            }
            console.log("calling start next dialogue index: " + this.currentIndex);
            this.startNextDialogue(dialogueList, scene);
          }
        }
      };
  
      scene.input.keyboard.on("keydown-SHIFT", shiftKeyDownHandler);
  
      // Check if there is an ongoing dialogue and stop it
      if (this.textCrawlActive && this.textCrawl) {
        this.textCrawl.text = "";
        console.log("Setting textCrawlActive to false");
        this.textCrawlActive = false;
      }
  
      this.currentTextIndex = 0;
      console.log("setting textCrawlactive true");
      this.textCrawlActive = true;
      this.startNextDialogue(dialogueList, scene);
    }
  
    startNextDialogue(dialogueList, scene) {
      console.log("IN START NEXT DIALOGUE, current dialogue being fed: "+ dialogueList[this.currentIndex] );
      console.log("dialogue: " + dialogueList[this.currentIndex]);
      console.log("scene in startNextDia: " + scene);
      this.textCrawl.text = "";
      this.currentTextIndex = 0;
      console.log("setting textCrawlactive true");
      this.textCrawlActive = true;
  
      this.addCharacter(dialogueList[this.currentIndex], scene);
      this.currentIndex++;
    }
  
    addCharacter(dialogue, scene) {
      this.currentTextIndex++;
      this.textCrawl.text = dialogue.substring(0, this.currentTextIndex);
  
      if (this.currentTextIndex < dialogue.length) {
        const delay = this.textCrawlSpeed;
        scene.time.delayedCall(
          delay,
          () => this.addCharacter(dialogue, scene), [],
        );
      } else {
        this.textCrawlActive = false;
        console.log("setting textCrawlactive false");
  
        // Debug logs
        console.log("Dialogue finished: " + dialogue);
      }
    }
    
    
    
    
    
    
    //#endregion

    createBlinkingText(textString, duration, scene, x = screen.center.x, y = screen.center.y, style =defaultHeaderStyle ) {
      console.log("Scene:", scene);
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


    destroy() {
      // Clean up any resources specific to the CutsceneHelper instance
      //if (this.textCrawl) {
        //this.textCrawl.destroy();
      //}
      if (this.qteText) {
        this.qteText.destroy();
      }
      //if (this.textBox) {
        //this.textBox.destroy();
      //}
  
      // Reset all properties to their initial values
      this.qteInProgress = false;
      this.dialogueList = [];
      this.currentTextIndex = 0;
      this.fastForward = false;
      this.currentIndex = 0;
      this.textCrawlActive = false;
      this.currentQTEInputOption = null;
      this.completedQTEs = 0;
      this.qteTimer = null;
      this.qteTimerDuration = 1000;
      this.textCrawlSpeed = 20;
      this.textCrawl = null;
      this.animCreate = null;
      this.scene = null;
    }


  }
  