class CutsceneHelper {
    constructor(deathAnim, scene) {
      //#region QTE properties
      this.qteInProgress = false;
      this.currDialogueList = []; // Array of dialogue lines
      this.currentIndex = 0;
      this.currentTextIndex = 0; // Index of the current character being displayed in the dialogue
      this.fastForward = false; // Flag to enable fast forward
      this.currentIndex = 0; // Index of the current dialogue in the dialogue list
      this.textCrawlActive = false; // Flag to indicate if text crawl is active
      this.qteInputOptions = ['a', 'g', 'i', 'k', 'm', 'b', 'r', 'p']; // Array of QTE input options
      this.currentQTEInputOption = null; // Current QTE input option
      this.completedQTEs = 0; // Number of completed QTEs
      this.qteTimer = null; // Timer for QTE duration
      this.qteTimerDuration = 3000; // Duration of QTE timer = 5 seconds
      this.textCrawlSpeed = 20; // Speed of text crawl in milliseconds
      this.textCrawl = "";
      this.animCreate = deathAnim;
      this.scene = scene;
      console.log(this.scene);
      //#endregion

    }  
    

    //#region <<QTE HANDLING>>
    startQTE(qteCount = 1, onSuccess, scene) {
      this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
      console.log(scene.key);
      this.qteText = scene.add.text(screen.center.x, screen.center.y+200, "Press" + " " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
      this.qteText.setDepth(depth.deathAnims);
      this.qteInProgress = true;
      //this.scene=scene;
      console.log("QTE started!");
      this.qteTimer = this.scene.time.delayedCall(this.qteTimerDuration, this.handleQTEFailure, [scene], this);
      console.log("QTE timer started!");
      this.animation = scene.add.sprite(screen.center.x,screen.center.y).play({key:'qte', frameRate: 8*1000/this.qteTimerDuration}).setDepth(7);
      this.scene.input.keyboard.removeAllListeners();
      this.scene.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), (event) => this.handleQTEInput(event, qteCount, onSuccess, scene), this);
    }
    
    handleQTEInput(event, qteCount, onSuccess, scene) {
      if (this.animation) {
        this.animation.destroy();
      }
      if (this.qteInProgress && event.key === this.currentQTEInputOption) {
        console.log("QTE input handled!");
        this.qteInProgress = false;
        this.qteTimer.remove();
        this.qteText.destroy();
        qteCount--;
    
        if (qteCount !== 0) {
          this.startQTE(qteCount, onSuccess, scene);
        } else {
          console.log("All QTEs completed");
          this.handleQTESuccess(onSuccess);
        }
      }
    }
    
    handleQTESuccess(onSucess) {
      console.log("All QTEs completed");
      //this.scene.add.text(screen.center.x, screen.center.y, "All QTEs complete!", defaultQTEStyle).setOrigin(0.5, 0.5);
      this.qteText.destroy();
      onSucess();
    }

    handleQTEFailure(scene) {
      console.log("QTE failure!");
      this.qteInProgress = false;
      this.qteText.destroy();
      
      this.createBlinkingText("IT'S OVER, TRY AGAIN", 2000, scene);
      this.scene.time.delayedCall(5000, () => {
        this.scene.scene.restart;
      });
    }
    //#endregion

    //#region << DIALOGUE ITERATOR >> 
    iterateThroughDialogue(dialogueList, onComplete, scene) {
      //console.log("scene in iterateThruDia: " + scene);
      this.scene = scene;

      //#region >>>>> Create New Text Box Background
      this.textBox = scene.add.image(screen.center.x, screen.center.y + 600, 'textBox');
      const textBoxPaddingX = 100;
      const textBoxPaddingY = 100;
      const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
      const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
      const textX = textBoxX + textBoxPaddingX;
      const textY = textBoxY + textBoxPaddingY;
      //#endregion
  
      console.log("creating textCrawl object")
      this.textCrawl = scene.add.text(textX, textY, "", defaultTextCrawlStyle);
      this.textCrawl.setOrigin(0, 0);
      this.textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);
      this.textCrawl.setDepth(4);

      const shiftKeyDownHandler = () => {
        if (!this.textCrawlActive && this.currentIndex < this.currDialogueList.length) 
        {
          if(!(this.currentIndex == 0)){ this.startNextDialogue(this.currDialogueList[this.currentIndex], this.scene); }
          //this.currentIndex++;
        }
        else if (!this.textCrawlActive && this.currentIndex >= this.currDialogueList.length)
        {
          this.scene.input.keyboard.off("keydown-SHIFT", this.shiftKeyDownHandler);
          this.currentIndex = 0;
          this.textCrawl.destroy();
          onComplete();
        }
      };
    
      this.scene.input.keyboard.on("keydown-SHIFT", shiftKeyDownHandler);

      // Check if there is an ongoing dialogue and stop it
      if (this.textCrawlActive && this.textCrawl) 
      {
        this.textCrawl.text = "";
        //console.log("Setting textCrawlActive to false");
        this.textCrawlActive = false;
      }
      this.currentTextIndex = 0;
      //console.log("setting textCrawlactive true");

      this.textCrawlActive = true;
      this.currDialogueList = dialogueList;
      if(this.currentIndex == 0){ this.startNextDialogue(this.currDialogueList[0], scene);}
    }

    startNextDialogue(currDialogueLine) 
    {
      console.log("IN START NEXT DIALOGUE, current dialogue being fed: "+ this.currDialogueList[this.currentIndex] );
      console.log("dialogue: " + currDialogueLine);
      this.textCrawl.text = "";
      this.currentTextIndex = 0; // CHARACTER INDEX
      this.textCrawlActive = true; //TEXT CRAWL IS HAPPENING
  
      this.addCharacter(currDialogueLine, this.scene); //TEXT CRAWL CODE
      this.currentIndex++;
    }
    
    addCharacter(currDialogueLine, scene) {
      this.currentTextIndex++;
      this.textCrawl.text = currDialogueLine.substring(0, this.currentTextIndex);
  
      if (this.currentTextIndex < currDialogueLine.length) 
      {
        const delay = this.textCrawlSpeed;
        this.scene.time.delayedCall(
          delay,
          () => this.addCharacter(currDialogueLine, scene), [],
        );
      } 
      else 
      {
        this.textCrawlActive = false;
        console.log("setting textCrawlactive false");
  
        // Debug logs
        console.log("Dialogue finished: " + currDialogueLine);
      }
    }
    //#endregion

    createBlinkingText(textString, duration, scene, x = screen.center.x, y = screen.center.y, style = defaultHeaderStyle ) {
      console.log("Scene:", this.scene);
      this.scene = scene;
      let text = scene.add.text(x, y, textString, style); 
      text.setOrigin(0.5);
      text.setDepth(depth.deathAnims+1);
    
      const blinkDuration = 500; // Duration of each blink in milliseconds
      const visiblePauseDuration = 200; // Duration to keep the text visible between blinks
      const repeatCount = Math.floor(duration / (blinkDuration + visiblePauseDuration)); // Calculate the number of repeats
    
      let currentRepeat = 0; // Counter for the current repeat
      
      const blinkAnimation = () => {
        currentRepeat++;
        
        // Set the alpha to 0 after the visible pause duration
        this.scene.time.delayedCall(visiblePauseDuration, () => {
          text.alpha = 0;
        });
    
        // Set the alpha to 1 after the blink duration
        this.scene.time.delayedCall(visiblePauseDuration + blinkDuration, () => {
          text.alpha = 1;
        });
    
        // Repeat the blink animation until the desired number of repeats is reached
        if (currentRepeat < repeatCount) {
          this.scene.time.delayedCall(visiblePauseDuration + blinkDuration * 2, blinkAnimation);
        } else {
          // Destroy the text object when the blinking is complete
          this.scene.time.delayedCall(visiblePauseDuration + blinkDuration * 2, () => {
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
      this.currDialogueList = [];
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
  