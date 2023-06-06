const RoomType = {
    EMPTY: 0,
    INTER: 1,
    HALLWAY: 2,
    DEAD_END: 3,
};


class Graph {
    constructor(scene, map) {
        this.nodes = [];
        this.buildGraph(map);
        this.numRows = map.length; // Assign the correct value to numRows
        this.numCols = map[0].length; // Assign the correct value to numCols
    }

    addNode(rType, value){
        const node = new Node(rType, value);
        this.nodes.push(node);
        return node;
    }

    getNode(value) {
        return this.nodes.find(node => node.value === value);
    }

    addEdge(value1, direction1, value2, direction2) {
        const node1 = this.getNode(value1);
        const node2 = this.getNode(value2);

        if (node1 && node2) {
        node1.setNeighbor(direction1, node2);
        node2.setNeighbor(direction2, node1);
        }
    }

    buildGraph(map) {
        this.numRows = map.length; // Assign the correct value to numRows
        this.numCols = map[0].length; // Assign the correct value to numCols
        // Create nodes for each cell in the map
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                const rType = map[row][col];
                const node = this.addNode(rType, 10*col+row);
                map[row][col] = node;
            }
        }

        // Connect neighboring nodes based on the map
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                const currentNode = map[row][col];

                // Check north neighbor
                if (row > 0) {
                const neighbor = map[row - 1][col];
                currentNode.setNeighbor('north', neighbor);
                }

                // Check south neighbor
                if (row < this.numRows - 1) {
                const neighbor = map[row + 1][col];
                currentNode.setNeighbor('south', neighbor);
                }

                // Check east neighbor
                if (col < this.numCols - 1) {
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
    /*
    displayGraph(scene, startX, startY, tileSize) {
        // Iterate through the nodes

        for(let i = 0; i<this.numRows; i++){

        }
        this.nodes.forEach((node, index) => {
          // Calculate the position of the node on the screen
          const row = Math.floor(node.value / this.numCols);
          const col = node.value % this.numCols;
          const x = startX + tileSize * col;
          const y = startY + tileSize * row;
      
          // Create a Phaser text object to represent the node with index and room type
          this.currText=`${index}`+" "+ `${node.roomType}`;
          const text = scene.add.text(x, y, this.currText, {
            fontSize: "10px",
            color: "#ffffff",
            depth: "1",
          });
          text.depth =1;
          console.log("added text: " + `${index} ${node.roomType}`);
      
          // Adjust the anchor to align the text properly
          text.setOrigin(0.5);
      
          // Add the text object to the scene
          scene.add.existing(text);
        });
    }*/
    displayGraph(scene, startX, startY, tileSize) {
        // Iterate through the rows and columns
        for (let i = 0; i < this.numRows; i++) {
          for (let j = 0; j < this.numCols; j++) {
            // Calculate the index of the node
            const index = i * this.numCols + j;
      
            // Calculate the position of the node on the screzen
            const x = startX + tileSize * j;
            const y = startY + tileSize * i;
      
            // Create a Phaser text object to represent the node with index and room type
            const node = this.nodes[index];
            this.currText= ' [ '+ `${y/100}` + ','+ `${x/100}` + ' ' + ` ${node.roomType}` + ' ] ';
            const text = scene.add.text(x, y, this.currText, headerConfig);
      
            // Adjust the anchor to align the text properly
            text.setOrigin(0.5);
      
            // Add the text object to the scene
            scene.add.existing(text);
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