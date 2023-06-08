﻿// Define the configuration object
const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 2048,
    height: 2048,
    scene: [Menu, QTE, Cutscene, Play]
  };
  
  // Create a new Phaser game
const game = new Phaser.Game(config);

let keyW, keyA, keyS, keyD, keyM, keyE, keyF, keyZ, keyX, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keyENTER, keySPACE;

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
}

//#endregion

let color_pal = {
  red: "#eb2646",
  orange: "#d45404",
  yellow: "#f9c22b",
  green: "#62C25B",
  teal: "#0eaf9b",
  blue: "#4C86A8", 
  purple: "#a884f3",
  pink: "#F6518A",
  white: "#FFFFFF",
  grey: "#3e3546",
  black: "#101119",
  toInt: function(colorName) {
    return parseInt(this[colorName].replace("#", "0x"));
  }
};


//#region [[ TEXT STYLES ]] =============================================================
// header config
let headerConfig = {
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
  fontFamily: 'Helvetica',
  fontSize: '70px',
  color: color_pal.white,
  align: 'left',
  padding: 20,
  fixedWidth: 0,
}

let defaultQTEStyle = {
  fontFamily: 'Helvetica',
  fontSize: screen.width/25,
  color: color_pal.white,
  align: 'center',
  padding: 5,
  fixedWidth: 0,
}
//#endregion

