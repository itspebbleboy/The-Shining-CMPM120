const RoomType = {
    EMPTY: 0,
    INTER: 1,
    DEAD_END: 2,
    DEAD_END0: 3,
    DEAD_END1: 4,
    DEAD_END2: 5,
    HALLWAY_0: 6,
    HALLWAY_1: 7,
    HALLWAY_2: 8,
    HALLWAY_3: 9,
    HALLWAY_4: 10,
    HALLWAY_5: 11,
    HALLWAY_6: 12,
    HALLWAY_7: 13,
    HALLWAY_8: 14,
    HALLWAY_9: 15,
    SPECIAL_HALLWAY: 16,
    SPECIAL_DOOR: 17,
    STARTING_HALLWAY:18,
};
  
class Graph {
    constructor() {
      this.nodes = new Map();
      this.numRows = 0;
      this.numCols = 0;
      this.visitedNodes = new Set();
      this.visitCounter = 0;
    }
    //#region << GRAPH CONSTRUCTION >>
    addVertex(row, col, rType) {
      const index = [row, col].toString();
      if (!this.nodes.has(index)) {
        this.nodes.set(index, new Node(row, col, rType));
      }
    }
  
    addEdge(row1, col1, row2, col2) {
      const node1 = this.getNode(row1, col1);
      const node2 = this.getNode(row2, col2);
  
      if (node1 && node2) {
        const direction = getDirection(row1, col1, row2, col2);
        node1.setNeighbor(direction, node2);
        node2.setNeighbor(oppositeDirection(direction), node1);
      }
    }
    buildGraph(map, level) {    
      this.numRows = map.length;
      this.numCols = map[0].length;
        //console.log("numRows: "+this.numRows +", numCols: " +this.numCols);
      if(!level){
        for (let i = 0; i < this.numRows; i++) {
          for (let j = 0; j < this.numCols; j++) {
            if (map[i][j] === 'I') {
              map[i][j] = 1;
            } else if (map[i][j] === 'D') {
              map[i][j] = Math.floor(Math.random() * 4) + 2;
            } else if (map[i][j] === 'H') {
              map[i][j] = Math.floor(Math.random() * 10) + 6;
            }
          }
        }
      }else{
        for (let i = 0; i < this.numRows; i++) {
          for (let j = 0; j < this.numCols; j++) {
            if (map[i][j] === 'I') {
              map[i][j] = 1;
            } else if (map[i][j] === 'D') {
              map[i][j] = Math.floor(Math.random() * 4) + 2;
            } else if (map[i][j] === 'H') {
              map[i][j] = Math.floor(Math.random() * 10) + 6;
            }
          }
        }
      }
        // Create nodes for each cell in the map
        for (let row = 0; row < this.numRows; row++) {
          for (let col = 0; col < this.numCols; col++) {
            const value = map[row][col];
            this.addVertex(row, col, value); // Pass the row, col, and room type as arguments
          }
        }
    
        // Connect neighboring nodes based on the map
        for (let row = 0; row < this.numRows; row++) {
          for (let col = 0; col < this.numCols; col++) {
            const currentNode = this.getNode(row, col);
    
            // Check north neighbor
            if (row > 0) {
              const neighbor = this.getNode(row - 1, col);
              this.addEdge(row, col, row - 1, col);
            }
    
            // Check south neighbor
            if (row < this.numRows - 1) {
              const neighbor = this.getNode(row + 1, col);
              this.addEdge(row, col, row + 1, col);
            }
    
            // Check east neighbor
            if (col < this.numCols - 1) {
              const neighbor = this.getNode(row, col + 1);
              this.addEdge(row, col, row, col + 1);
            }
    
            // Check west neighbor
            if (col > 0) {
              const neighbor = this.getNode(row, col - 1);
              this.addEdge(row, col, row, col - 1);
            }
          }
        }

      }


    //#endregion

    //#region << PRINT METHODS >>
    printGraph() {
      for (let [index, node] of this.nodes) {
        let neighbors = "";
        for (let direction in node.neighbors) {
          if (node.neighbors[direction]) {
            neighbors += `${direction}: ${node.neighbors[direction].getIndex()}, `;
          }
        }
        //console.log(`${index}: ${neighbors}`);
      }
    }
    printGraphAsMatrix(node) {
      let matrix = "";
  
      for (let row = 0; row < this.numRows; row++) {
        let rowValues = "";
  
        for (let col = 0; col < this.numCols; col++) {
          const index = [row, col].toString();
          const currentNode = this.nodes.get(index);
  
          if (currentNode === node) {
            rowValues += "[0] ";
          } else {
            const roomType = currentNode.roomType;
            let nodeRepresentation = "";
  
            if (roomType === RoomType.EMPTY) {
              nodeRepresentation = "[ ]";
            } else if (roomType === RoomType.INTER) {
              nodeRepresentation = "[I]";
            } else if (
              roomType >= RoomType.HALLWAY_0 &&
              roomType <= RoomType.HALLWAY_9
            ) {
              nodeRepresentation = "[H]";
            } else if (roomType === RoomType.DEAD_END) {
              nodeRepresentation = "[D]";
            } else if (roomType === RoomType.SPECIAL_HALLWAY) {
              nodeRepresentation = "[S]";
            } else if (roomType === RoomType.SPECIAL_DOOR) {
              nodeRepresentation = "[D]";
            }
  
            rowValues += nodeRepresentation + " ";
          }
        }
  
        matrix += rowValues.trim() + "\n";
      }
  
      //console.log(matrix);
    }
    
      
    //#endregion

    //#region << GET METHODS >>
    getNode(row, col) {
        const index = [row, col].toString();
        return this.nodes.get(index) || null;
    }

    getNeighborRoomType(node, direction) {
      const neighbor = node.neighbors[direction];
      if (neighbor) {
        return neighbor.roomType;
      }
      return null;
    }
    getNeighborInDirection(node, direction){
        const neighbor = node.neighbors[direction];
        return neighbor;
    }
    
    //#endregion
    
    //#region << AI SHIT >>
    calculateDistance(startNode, endNode) {
        const visited = new Set();
        const queue = [];
        const distances = new Map();
    
        queue.push(startNode);
        distances.set(startNode, 0);
    
        while (queue.length > 0) {
          const currentNode = queue.shift();
          const currentDistance = distances.get(currentNode);
    
          if (currentNode === endNode) {
            return currentDistance;
          }
    
          visited.add(currentNode);
    
          for (let direction in currentNode.neighbors) {
            const neighbor = currentNode.neighbors[direction];
    
            if (neighbor && !visited.has(neighbor) && neighbor.roomType !== RoomType.EMPTY) {
              queue.push(neighbor);
              distances.set(neighbor, currentDistance + 1);
            }
          }
        }
    
        return -1; // Indicates that there is no path between the start and end nodes
    }
    //#endregion

}
  
class Node {
  constructor(row, col, rType) {
    this.index = [row, col];
    this.value = this.index.toString();
    this.roomType = rType;
    this.neighbors = {
      north: null,
      south: null,
      east: null,
      west: null,
    };
  }
  
  setNeighbor(direction, node) {
    this.neighbors[direction] = node;
  }
  
  getIndex() {
    return this.index.toString();
  }
  availableDirections() {
    const directions = [];

    if (this.neighbors.north && this.neighbors.north.roomType !== RoomType.EMPTY) {
      directions.push('north');
    }
    if (this.neighbors.south && this.neighbors.south.roomType !== RoomType.EMPTY) {
      directions.push('south');
    }
    if (this.neighbors.east && this.neighbors.east.roomType !== RoomType.EMPTY) {
      directions.push('east');
    }
    if (this.neighbors.west && this.neighbors.west.roomType !== RoomType.EMPTY) {
      directions.push('west');
    }

    return directions;
  }

  isVal() {
    return this.roomType !== RoomType.EMPTY;
  }
}
  
function getDirection(row1, col1, row2, col2) {
    if (row2 < row1) {
      return "north";
    } else if (row2 > row1) {
      return "south";
    } else if (col2 < col1) {
      return "west";
    } else {
      return "east";
    }
  }
  
function oppositeDirection(direction) {
    switch (direction) {
      case "north":
        return "south";
      case "south":
        return "north";
      case "east":
        return "west";
      case "west":
        return "east";
      default:
        return "";
    }
}
  