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
      this.gameover1 = this.add.image(screen.center.x,screen.center.y, 'shining_atlas', 'gameover1').setVisible(false);
      this.gameover2 = this.add.image(screen.center.x,screen.center.y, 'shining_atlas', 'gameover2').setVisible(false);
      this.gameover3 = this.add.image(screen.center.x,screen.center.y, 'shining_atlas', 'gameover3').setVisible(false);
      this.gameover4 = this.add.image(screen.center.x,screen.center.y, 'shining_atlas', 'gameover4').setVisible(false);
      this.gameover5 = this.add.image(screen.center.x,screen.center.y, 'shining_atlas', 'gameover5').setVisible(false);
      //#endregion

        this.iterateThroughDialogue(this.dialogueList);
    }
  
    //#region <<QTE HANDLING>>
    startQTE(qteCount) {
        this.currentQTEInputOption = this.qteInputOptions[Phaser.Math.Between(0, this.qteInputOptions.length - 1)];
        this.qteText = this.add.text(screen.center.x, screen.center.y, "Press" + " " + this.currentQTEInputOption.toUpperCase() + "!", defaultQTEStyle).setOrigin(0.5, 0.5);
        this.qteInProgress = true;
        console.log("QTE started!");
        this.qteTimer = this.time.delayedCall(this.qteTimerDuration, this.handleQTEFailure, [], this);
        console.log("QTE timer started!");
      
        this.timeRunningOut();
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.on("keydown-" + this.currentQTEInputOption.toUpperCase(), this.handleQTEInput, [qteCount], this);
    }
    
    handleQTEInput(event, qteCount) {
        this.destroyQTEAnim();
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

    //#region << ANIMATION HANDLING >>
    // creates a bunch of fucking timers at specific points and sets the game over screen relevent to visible
    timeRunningOut(){
        this.time1 = this.time.delayedCall(this.qteTimerDuration*0.4, ()=>{
            this.gameover1.setVisible(true);
        },[], this)
        this.time2 = this.time.delayedCall(this.qteTimerDuration*0.6, ()=>{
            this.gameover2.setVisible(true);
        },[], this)
        this.time3 = this.time.delayedCall(this.qteTimerDuration*0.75, ()=>{
            this.gameover3.setVisible(true);
        },[], this)
        this.time4 = this.time.delayedCall(this.qteTimerDuration*0.9, ()=>{
            this.gameover4.setVisible(true);
        },[], this)
        this.time5 = this.time.delayedCall(this.qteTimerDuration, ()=>{
            this.gameover5.setVisible(true);
        },[], this)
        }
    destroyQTEAnim(){
        // destroys future timers upon a successful QTE and also sets the game over textures to invisible
        this.gameover1.setVisible(false);
        this.gameover2.setVisible(false);
        this.gameover3.setVisible(false);
        this.gameover4.setVisible(false);
        this.gameover5.setVisible(false);
        this.time1.destroy();
        this.time2.destroy();
        this.time3.destroy();
        this.time4.destroy();
        this.time5.destroy();
    }

    //#endregion

    //#region << TEXT HANDLING >>    
    iterateThroughDialogue(dialogueList) {
        let currentIndex = 0;

        const shiftKeyDownHandler = () => {
          if (!this.textCrawlActive) {
            if (currentIndex === dialogueList.length - 1) {
              this.textCrawl.destroy();
              this.startQTE();
            } else {
              currentIndex++;
              this.textCrawl.destroy();
              this.startNextDialogue(dialogueList[currentIndex]);
              console.log("Proceeding to next dialogue");
            }
          }
        };
      
        const shiftKeyUpHandler = () => {
          this.fastForward = false;
        };
      
        this.input.keyboard.on("keydown-SHIFT", shiftKeyDownHandler);
        this.input.keyboard.on("keyup-SHIFT", shiftKeyUpHandler);
    }
      
      startNextDialogue(dialogue) {
        const textBoxPaddingX = 50;
        const textBoxPaddingY = 50;
        const textBoxX = this.textBox.x - this.textBox.width * this.textBox.originX;
        const textBoxY = this.textBox.y - this.textBox.height * this.textBox.originY;
        const textX = textBoxX + textBoxPaddingX;
        const textY = textBoxY + textBoxPaddingY;
      
        const textCrawl = this.add.text(textX, textY, "", defaultTextCrawlStyle);
        textCrawl.setOrigin(0, 0);
        textCrawl.setWordWrapWidth(this.textBox.width - textBoxPaddingX * 2);
      
        this.currentTextIndex = 0;
        this.textCrawlActive = true;
        this.addCharacter(dialogue, textCrawl);
    }
      
      
      addCharacter(dialogue, textCrawl) {
        this.currentTextIndex++;
        textCrawl.text = dialogue.substring(0, this.currentTextIndex);
      
        if (this.currentTextIndex < dialogue.length && !this.fastForward) {
          const delay = this.textCrawlSpeed;
          this.time.delayedCall(delay, () => this.addCharacter(dialogue, textCrawl));
        } else {
          this.textCrawlActive = false;
          textCrawl.text = dialogue; // Set the full dialogue text
          console.log("Setting textCrawlActive to false");
        }
      }
    //#endregion
  }
  