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
        this.numRows = 0;
        this.numCols = 0;
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
        this.numRows = map.length;
        this.numCols = map[0].length;

        // Create nodes for each cell in the map
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const rType = map[row][col];
                const node = this.addNode(rType, 10*col+row);
                map[row][col] = node;
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
        this.value
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