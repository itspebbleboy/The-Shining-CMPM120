﻿/* CMPM 120 The Greatest Game of All Time: Athena Patronas and Tatiana Lucero

  Debug Menu How-To:
    Our game is composed of several scenes, and to make it easier for the grader to 
    go back and check scenes without playing through the game again we have made a 
    seperate menu in order to start the game at different points. All ya gotta do is 
    press up on the main menu.

  5 Major Phaser Components we used:

    1. Animation Manager: 
          Created animations in the axe cutscene to display the axe cutting through the door, 
          to make the eye blink when moving forward thorugh the hotel/maze, and to create game over visual. 
    2. Tween Manager: 
          Used to move the hotel/hedge maze eye UI to the left and right of the screen based 
          based off prior location.
    3. Timers:
          We wanted to alert the player that the enemy AI was nearby, so if a player lurked around the same 
          nodes for a certain duration of time the animation would start playing, and they would have to enter a new 
          node not in their queue in order to lose the enemy and call off the timers. 
    4. Text Objects: 
          Tatiana created a dialouge system that [ tati exaplain ur dialouge system]
    5. Particle Effects:
          We made it snow in the outside hedge portion of the game :)) 

    Other Cool Features:
    - hedge/hotel configs
    - graph class
    - qte implementation
    - 


*/
//game config
const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 2048,
    height: 2048,
    scene: [Menu, DebugMenu, Play, IntroScene, BathroomScene, EndScene]
  };
  
  // Create a new Phaser game
const game = new Phaser.Game(config);

//#region << KEY DEFINITIONS >>
let keyW, keyA, keyS, keyD, keyM, keyE, keyF, keyZ, keyX, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keyENTER, keySPACE;
//#endregion

//#region << LEVEL CONFIG >>

let levelHotel = {
  num: 0,
  jackAnimTimerDuration: 20*1000,
  jackAnimDifference: 5*1000,
  deathDifferenceDuration: 5*1000,
  map : [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'D',0,0,0,0,0,0,0,'D',0,0,0], //0
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,'D',0,0,'H',0,0,0], //1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'D',0,0,0,'H',0,0,0,0,'H',0,0,'H',0,0,0], //2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'H',0,0,0,'H',0,0,0,0,'H',0,0,'H',0,0,0], //3
    [0,0,0,0,0,0,'D',0,0,0,0,0,0,'D','H','H','I','H','H','H','I','H','H','H','H','I','H','H','I','H','D',0], //4
    [0,0,0,0,0,0,'H',0,0,0,0,'D',0,0,0,0,'H',0,0,0,'H',0,0,0,0,'H',0,0,'H',0,0,0], //5
    [0,0,0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,0,'D',0,0,0,0,'H',0,0,'H',0,0,0], //6
    [0,0,0,0,'D','H','I','H','H','H','H','I','H','D',0,0,'H',0,0,0,0,0,'D',0,0,'H',0,0,'H',0,0,0], //7
    [0,0,0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,0,'H',0,0,'H',0,0,'H',0,0,0], //8
    [0,0,0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H','I','H','H','I','H','H','I','H','D',0], //9
    [0,0,0,0,0,0,'H',0,0,'D','H','I','H','H','H','H','I','H','D',0,0,0,'H',0,0,'H',0,0,'H',0,0,0], //10
    [0,0,0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,0,'H',0,0,'D',0,0,'D',0,0,0], //11
    [0,0,0,0,0,0,'H',0,0,0,0,'D',0,0,0,0,'H',0,0,0,0,0,'H',0,0,0,'D',0,0,0,0,0], //12
    [0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0,'H',0,0,0,'H',0,0,0,0,0], //13
    [0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0,'H',0,0,0,'D','H','I','H','H','H','I','H','H','D',0,0], //14
    [0,0,'D','H','H','H','I','H','D',0,0,'D',0,0,0,0,'H',0,0,'D',0,0,'H',0,0,0,'H',0,0,0,0,0], //15
    [0,0,0,0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,'H',0,0,'D',0,0,0,'H',0,0,0,0,0], //16
    [0,0,0,0,0,0,'H',0,0,'D','H','I','H','H','H','H','I','H','H','I','D',0,0,0,'D','H','I','H','D',0,0,0], //17
    [0,0,'D',0,0,0,'H',0,0,0,0,'H',0,0,0,0,'H',0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //18
    [0,0,'H',0,0,0,'H',0,0,0,0,'D',0,0,0,0,'D',0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //19
    ['D','H','I','H','H','H','I','H','H','D',0,0,0,0,0,0,0,0,0,'D',0,0,'D','H','H','H','I','H','D',0,0,0], //20
    [0,0,'H',0,0,0,'H',0,0,0,0,0,0,0,0,0,0,'D',0,0,0,0,0,0,0,0,'H',0,0,0,0,0], //21
    [0,0,'H',0,0,0,'H',0,0,0,0,'D',0,0,0,0,0,'H',0,0,'D',0,0,0,0,0,'H',0,0,0,0,0], //22
    [0,0,'H',0,0,0,'H',0,0,0,0,'H',0,0,0,0,0,'H',0,0,'H',0,0,0,0,0,'SH','SD',0,0,0,0], //23
    ['D','H','I','H','H','H','I','H','H','H','H','I','H','H','H','H','H','I','H','H','I','D',0,0,0,0,'D',0,0,0,0,0], //24
    [0,0,'H',0,0,0,'H',0,0,0,0,'H',0,0,0,0,0,'H',0,0,'H',0,0,0,0,0,0,0,0,0,0,0], //25
    [0,0,'H',0,0,0,'D',0,0,0,0,'D',0,0,0,0,0,'H',0,0,'D',0,0,0,0,0,0,0,0,0,0,0], //26
    [0,0,'H',0,0,0,0,0,0,'D',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'D',0,0,0,0,0,0,0], //27
    [0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0], //28
    ['D','H','I','H','H','H','H','H','H','I','H','H','H','H','H','H','H','I','H','H','H','H','H','H','I','H','D',0,0,0,0,0], //29
    [0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0], //30
    [0,0,'D',0,0,0,0,0,0,'D',0,0,0,0,0,0,0,'D',0,0,0,0,0,0,'D',0,0,0,0,0,0,0], //31
  ],
  starting: { // remember 31 ,24
    x: 31,
    y: 24
  },
  dialogueList : [
    "you can look using the left and right arrow keys",
    "to go towards the direction you're looking in, press space",
    "The hallways in this hotel seem to change all the time but your memory of where you've been might serve you correctly if you press the up arrow key.",
    "now press it twice to remember the layout of the floor,",
    "time isn't paused when you're recalling the layout of the hotel, so be cautious,",
    "when it's a matter of life and death, there is no time to stall.",
    "he might have already found a way to escape so make sure you don't frequent around an area for too long.",
    "enough with the tutorial.",
  ],
  levelStartText : [
    'FIND YOUR SON'
  ],
  levelEndText: [
    'OPEN THE DOOR'
  ],
  playerQueueLength: 10,
}
let levelHedge = {
  num: 1,
  jackAnimTimerDuration: 10*1000,
  jackAnimDifference: 5*1000,
  deathDifferenceDuration: 5*1000,
  map : [
    [0,0,0,0,0,0,0,0,'D',0,0,0,0,0,0,0,0,0,0,0,0,0,'D',0,0,0,0,0,0,0,0,0], //0
    [0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'SH',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0], //1
    [0,0,0,0,0,'D','H','H','I','H','H','H','H','H','H','I','H','H','H','H','H','H','I','H','H','D',0,0,0,0,0,0], //2
    [0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0], //3
    [0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'D',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0], //4
    [0,0,0,0,'D',0,0,0,'H',0,0,'D',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0], //5
    [0,0,0,0,'H',0,0,0,'H',0,0,'H',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0], //6
    [0,0,'D','H','I','H','H','H','I','H','H','I','H','H','H','H','H','H','H','I','H','H','I','H','H','H','I','H','D',0,0,0], //7
    [0,0,0,0,'H',0,0,0,'H',0,0,'H',0,0,0,0,0,0,0,'H',0,0,'H',0,0,0,'H',0,0,0,0,0], //8
    [0,0,0,0,'H',0,0,0,'D',0,0,'H',0,0,0,0,0,0,0,'H',0,0,'D',0,0,0,'H',0,0,0,0,0], //9
    [0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //10
    [0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //11
    [0,0,'D','H','I','H','H','H','H','H','H','I','H','H','H','I','H','H','H','I','H','H','H','H','H','H','I','H','D',0,0,0], //12
    [0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,'H',0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //13
    [0,0,0,0,'H',0,0,0,0,0,0,'D',0,0,0,'H',0,0,0,'D',0,0,0,0,0,0,'H',0,0,0,0,0], //14
    [0,0,0,0,'H',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0], //15
    [0,0,0,0,'H',0,0,0,0,0,0,0,'D','H','H','I','H','H','D',0,0,0,0,0,0,0,'H',0,0,0,0,0], //16
    [0,0,0,0,'H',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,0,0,0,'H',0,0,0,0,0], //17
    [0,0,0,0,'H',0,0,0,0,0,0,'D',0,0,0,'D',0,0,0,'D',0,0,0,0,0,0,'H',0,0,0,0,0], //19
    [0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //18
    [0,0,'D','H','I','H','H','H','H','H','H','I','H','D',0,0,0,'D','H','I','H','H','H','H','H','H','I','H','D',0,0,0], //20
    [0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'H',0,0,0,0,0], //21
    [0,0,0,0,'D',0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,'D',0,0,0,0,0], //22
    [0,0,0,'D',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'D',0,0,0,0], //23
    [0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0], //24
    [0,'D','H','I','H','H','H','I','H','H','H','I','H','D',0,0,0,'D','H','I','H','H','H','I','H','H','H','I','H','D',0,0], //25
    [0,0,0,'H',0,0,0,'H',0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,'H',0,0,0,'H',0,0,0,0], //26
    [0,0,0,'H',0,0,0,'H',0,0,0,'D',0,0,0,'D',0,0,0,'D',0,0,0,'H',0,0,0,'H',0,0,0,0], //27
    [0,0,0,'H',0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,'H',0,0,0,0], //28
    [0,'D','H','I','H','H','H','I','H','H','H','H','H','H','H','I','H','H','H','H','H','H','H','I','H','H','H','I','H','D',0,0], //29
    [0,0,0,'H',0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,0,0,0,0,'H',0,0,0,'H',0,0,0,0], //30
    [0,0,0,'D',0,0,0,'D',0,0,0,0,0,0,0,'D',0,0,0,0,0,0,0,'D',0,0,0,'D',0,0,0,0], //31
  ],
  starting: {
    x: 31,
    y: 15
  },
  dialogueList : [
  ],
  levelStartText : [
    'FIND THE EXIT'
  ],
  levelEndText: [
    'RUN TO THE SNOWCAT'
  ],
  playerQueueLength: 60
}
//#endregion

//#region << SCREEN >>
let screen = {
  center: { 
    x: game.config.width/2, 
    y: game.config.height/2 
  },
  width: game.config.width,
  height: game.config.height,

  topLeft: {
    x: 0,
    y: 0
  },
  topMid: {
    x: game.config.width / 2,
    y: 0
  },
  topRight: {
    x: game.config.width,
    y: 0
  },
  rightMid: {
    x: game.config.width,
    y: game.config.height/2
  },
  botRight: { 
    x: game.config.width, 
    y: game.config.height 
  },
  botMid: {
    x: game.config.width/2,
    y: game.config.height
  },
  botLeft: { 
    x: 0, 
    y: game.config.height 
  },
  leftMid: {
    x: 0,
    y: game.config.height/2
  },
}
//#endregion

//#region << DEPTH >>
let depth = {
  rooms: 0,
  eye: 2,
  redEye: 3,
  miniMapBackground: 4,
  miniMapSquares: 5,
  mapBackground: 6,
  mapSquares: 7,
  deathAnims: 8,
  textBox: 9,
}
//#endregion

//#region << COLOR CODES >>
let color_pal = {
  red: "#b04640",
  brown: "#211309",
  tan: "#d9b691",
  green: "#667556",
  uiBlue: "#0b9efa",
  lightBlue: "#4e7d9a", 
  white: "#FFFFFF",
  black: "#101119",
  toInt: function(colorName) {
    return parseInt(this[colorName].replace("#", "0x"));
  }
};
//#endregion

//#region [[ TEXT STYLES ]] =============================================================
// header config
let headerConfig = {
  fontFamily: 'Gill Sans',
  fontSize: screen.width/16,
  //backgroundColor: color_pal.black,
  color: color_pal.white,
  align: 'center',
  padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
  },
  fixedWidth: 0
}

let subHeaderConfig = {
  fontFamily: 'Gill Sans',
  fontSize: screen.width/25,
  //backgroundColor: color_pal.black,
  color: color_pal.white,
  align: 'center',
  padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
  },
  fixedWidth: 0
}

// menu text configuration
let defaultTextCrawlStyle = {
  fontFamily: 'Tremendous',
  fontSize: '80px',
  color: color_pal.white,
  align: 'left',
  padding: 20,
  fixedWidth: 0,
}

let defaultHeaderStyle = {
  fontFamily: 'Tremendous',
  fontSize: screen.width/17,
  color: color_pal.white,
  align: 'center',
  padding: 5,
  fixedWidth: 0,
  depth: depth.deathAnims,
  backgroundColor: color_pal.red,
  fontStyle: 'bold',
}


let defaultQTEStyle = {
  fontFamily: 'Tremendous',
  fontSize: screen.width/15,
  color: color_pal.white,
  align: 'center',
  padding: 5,
  fixedWidth: 0,
  backgroundColor: color_pal.red,
}
//#endregion

