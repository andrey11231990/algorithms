/**
 * We will use adjacency list for storing graph.
 * For simplicity vertex will be just number and will be match to index in array.
 */


/**
 * Enumeration of posible vertex states.
 * UNDISCOVERED - vertex is in initial state.
 * DISCOVERED - vertex has been found, but not all edges was processed.
 * PROCESSED - all edges from this vertex was processed.
 * @type {Object}
 */
var VERTEX_STATE = {
UNDISCOVERED: 0,
DISCOVERED: 1,
PROCESSED: 2
};
/**
 * This is edge between x (which is represented by index in edges array) and y.
 * @param {Number} y Index of point, that have edge with current point.
 * @param {Number} weight Weight of current edge.
 */
var Edge = function(y, weight) {
	this.y = y;
	this.weight = weight;
};
/**
 * Constructor for Graph.
 * @param {Boolean} isDirect true if current graph is direct.
 */
var Graph = function(isDirect) {
	this.edges = [];
	this.vertexWeight = [];
	this.numberOfVertexes = 0;
	this.numberOfEdges = 0;
	this.isDirect = isDirect;
	this._vertexStates = [];
};

/**
 * Adds new edge between two vertexes. If graph is undirected, then edges will be added for both vertexes.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @param {Number} weight Weight of edge.
 */
Graph.prototype.addEdge = function(x, y, weight) {
	var edge = new Edge(y, weight);
	var listOfEdges = this.edges[x];
	if (!this.edges[x]) {
		this.edges[x] = [];
		listOfEdges = this.edges[x];
	}
	listOfEdges[listOfEdges.length] = edge;
	this.numberOfEdges++;
	if (!this.isDirect && !arguments[3]) {
		this.addEdge(y, x, weight, true);
	}
};

/**
 * Removes edge between two vertexes. If graph is undirected, then edges will be removed for both vertexes.
 * @param  {Number} x Index of first vertex.
 * @param  {Number} y Index of second vertex.
 * @param  {Boolean} doNotRemoveBackEdge If false than we will call removeEdge with parameters (y,x).
 */
Graph.prototype.removeEdge = function(x, y, doNotRemoveBackEdge) {
	var listOfEdges = this.edges[x];
	var removeAt;
	for (var i = 0; i < listOfEdges.length; i++) {
		if (listOfEdges[i].y === y) {
			removeAt = i; break;
		}
	}
	listOfEdges.splice(removeAt, 1);
	this.numberOfEdges--;
	if (!this.isDirect && !doNotRemoveBackEdge) {
		this.removeEdge(y, x, true);
	}
};

/**
 * Sets weight of vertex.
 * @param {Number} x Index of vertex.
 * @param {Number} weight Weight of target vertex.
 */
Graph.prototype.addVertex = function(x, weight) {
	this.vertexWeight[x] = weight;
	this.numberOfVertexes++;
	this._vertexStates[x] = VERTEX_STATE.UNDISCOVERED;
};

/**
 * Removes vertex and all adjacent edges.
 * @param {Number} x Index of vertex in array.
 */
Graph.prototype.removeVertex = function(x) {
	this.vertexWeight.splice(x, 1);
	this.numberOfVertexes--;
	for (var i = 0; i < this.numberOfVertexes; i++) {
		// for (var j = 0; i < this.edges[i].length; j++) {
		// 	if (this.edges[i][j].y === x) {
				this.removeEdge(i, x, true);
		// 	}
		// }
	}
};

/**
 * Changes weight for target vertex.
 * @param {Number} x Index of vertex in array.
 * @param {Number} weight New weight of vertex.
 */
Graph.prototype.changeVertexWeight = function(x, weight) {
	this.vertexWeight[x] = weight;
};

/**
 * Changes weight of target edge.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @param {Number} weight New weight of edge.
 */
Graph.prototype.changeEdgeWeight = function(x, y, weight) {
	var edges = this.edges[x];
	for (var i = 0; i < edges.length; i++) {
		if (edges[i].y === y) {
			edges[i].weight = weight;
			break;
		}
	}
};

/**
 * Returns weight of target edge.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @return {Number} Weight of edge. Returns undefined if target edge does not exist.
 */
Graph.prototype.getEdgeWeight = function(x, y) {
	var edges = this.edges[x];
	for (var i = 0; i < edges.length; i++) {
		if (edges[i].y === y) {
			return edges[i].weight;
		}
	}
};

/**
 * Returns weight of target vertex.
 * @param {Number} x Index of vertex.
 * @return {Number} Weight of vertex.
 */
Graph.prototype.getVertexWeight = function(x) {
	return this.vertexWeight[x];
};

/**
 * Returns array of adjacent vertexes.
 * @param {Number} x Index of vertex.
 * @return {Array} Array of adjacent vertexes to 'x'.
 */
Graph.prototype.getAdjacentVertexes = function(x) {
	var vertexes = [];
	var edges = this.edges[x];
	for (var i = 0; i < edges.length; i++) {
		vertexes[i] = edges[i].y;
	}
	return vertexes;
};

/**
 * Checks is exists edge between x and y.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @return {Boolean} Returns true if edge (x,y) exists.
 */
Graph.prototype.isAdjacentVertexes = function(x, y) {
	var result = false;
	var edges = this.edges[x];
	for (var i = 0; i < edges.length; i++) {
		if (edges[i].y === y) {
			result = true;
			break;
		}
	}
	return result;
};

/**
 * Sets default state for vertexes.
 */
Graph.prototype.refreshVertexStates = function() {
	for (var i = 0; i < this.numberOfVertexes; i++) {
		this._vertexStates[i] = VERTEX_STATE.UNDISCOVERED;
	}
};

/**
 * Does breadth first search.
 * @param {Number} x Index of start vertex.
 * @param {Function} discoveredCallback Function, which will be called when vertex is discovered.
 * @param {Function} processedCallback Function, which will be called when vertex is processed.
 */
Graph.prototype.BFS = function(x, discoveredCallback, processedCallback) {
	// var edges = this.edges[x];
	// this._vertexStates[x] = VERTEX_STATE.DISCOVERED;
	// discoveredCallback(x);
	// for (var i = 0; i < edges.length; i++) {
	// 	var y = edges[i].y;
	// 	if (this._vertexStates[y] === VERTEX_STATE.UNDISCOVERED) {
	// 	}
	// }
};

Graph.prototype.DFS = function(x, discoveredCallback, processedCallback) {
	var edges = this.edges[x];
	this._vertexStates[x] = VERTEX_STATE.DISCOVERED;
	discoveredCallback(x, this.vertexWeight[x]);
	for (var i = 0; i < edges.length; i++) {
		var y = edges[i].y;
		if (this._vertexStates[y] === VERTEX_STATE.UNDISCOVERED) {
			this.DFS(y, discoveredCallback, processedCallback);
		}
	}
	processedCallback(x, this.vertexWeight[x]);
	this._vertexStates[x] = VERTEX_STATE.PROCESSED;
};


var graph = new Graph(false);
graph.addVertex(0, 0);
graph.addVertex(1, 0);
graph.addVertex(2, 0);
graph.addVertex(3, 0);
graph.addVertex(4, 0);

graph.addEdge(0, 1, 0);
graph.addEdge(0, 2, 0);
graph.addEdge(0, 3, 0);
graph.addEdge(1, 3, 0);
graph.addEdge(2, 3, 0);
graph.addEdge(3, 4, 0);

var discoveredCallback = function(x) {
	console.log("vertex '" + x + "' is discovered");
};
var processedCallback = function(x) {
	console.log("vertex '" + x + "' is processed");
};
graph.DFS(0, discoveredCallback, processedCallback);
//vertex '0' is discovered
// vertex '1' is discovered
// vertex '3' is discovered
// vertex '2' is discovered
// vertex '2' is processed
// vertex '4' is discovered
// vertex '4' is processed
// vertex '3' is processed
// vertex '1' is processed
// vertex '0' is processed

graph.refreshVertexStates();

