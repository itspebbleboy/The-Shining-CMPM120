const RoomType = {
    EMPTY: 0,
    INTER: 1,
    HALLWAY: 2,
    DEAD_END: 3,
  };
  
  class Graph {
    constructor() {
      this.nodes = new Map();
    }
  
    addVertex(row, col, rType) {
      const index = [row, col].toString();
      if (!this.nodes.has(index)) {
        this.nodes.set(index, new Node(row, col, rType));
      }
    }
  
    getNode(row, col) {
      const index = [row, col].toString();
      return this.nodes.get(index) || null;
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
  
    printGraph() {
      for (let [index, node] of this.nodes) {
        let neighbors = "";
        for (let direction in node.neighbors) {
          if (node.neighbors[direction]) {
            neighbors += `${direction}: ${node.neighbors[direction].getIndex()}, `;
          }
        }
        console.log(`${index}: ${neighbors}`);
      }
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
    buildGraph(map) {
      this.numRows = map.length;
      this.numCols = map[0].length;
  
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
  