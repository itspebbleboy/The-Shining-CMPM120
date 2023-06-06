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
  
    addVertex(v) {
      if (!this.nodes.has(v)) {
        this.nodes.set(v, new Node());
      }
    }
  
    addEdge(v, w) {
      const nodeV = this.nodes.get(v);
      const nodeW = this.nodes.get(w);
  
      if (nodeV && nodeW) {
        nodeV.setNeighbor(w, nodeW);
        nodeW.setNeighbor(v, nodeV);
      }
    }
  
    printGraph() {
      for (let [value, node] of this.nodes) {
        let neighbors = "";
        for (let direction in node.neighbors) {
          if (node.neighbors[direction]) {
            neighbors += `${direction}: ${node.neighbors[direction].value}, `;
          }
        }
        console.log(`${value}: ${neighbors}`);
      }
    }
  
    buildGraph(map) {
        const numRows = map.length;
        const numCols = map[0].length;
      
        // Create nodes for each cell in the map
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const value = map[row][col];
            this.addVertex(value);
          }
        }
      
        // Connect neighboring nodes based on the map
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const currentNode = map[row][col];
      
            // Check north neighbor
            if (row > 0) {
              const neighbor = map[row - 1][col];
              currentNode.setNeighbor('north', neighbor);
            }
      
            // Check south neighbor
            if (row < numRows - 1) {
              const neighbor = map[row + 1][col];
              currentNode.setNeighbor('south', neighbor);
            }
      
            // Check east neighbor
            if (col < numCols - 1) {
              const neighbor = map[row][col + 1];
              currentNode.setNeighbor('east', neighbor);
            }
      
            // Check west neighbor
            if (col > 0) {
              const neighbor = map[row][col - 1];
              currentNode.setNeighbor('west', neighbor);
            }
          }
        }
    }  
  }
  

class Node {
    constructor(rType, value) {
        this.value = value;
        this.roomType = rType;
        this.neighbors = {
            north: null,    
            south: null,
            east: null,
            west: null
        };
    }

    setNeighbor(direction, node) {
        this.neighbors[direction] = node;
    }
}