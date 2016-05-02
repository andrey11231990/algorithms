/**
 * We will use adjacency list for storing graph.
 * For simplicity vertex will be just number and will be match to index in array.
 */
var emptyFn = function() {};

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
 * Enumeration of posible vertex colors in bipartile graph.
 * @type {Object}
 */
var VERTEX_COLOR = {
	UNCOLORED: 0,
	WHITE: 1,
	BLACK: 2
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
	this._vertexColors = [];
};

/**
 * Adds new edge between two vertexes. If graph is undirected, then edges will be added for both vertexes.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @param {Number} weight Weight of edge.
 */
Graph.prototype.addEdge = function(x, y, weight) {
	var edge = new Edge(y, weight);
	this._initEdgeList(x);
	this._insertEdgeToEdgeList(this.edges[x], edge);
	if (!this.isDirect && !arguments[3]) {
		this.addEdge(y, x, weight, true);
	}
};

/**
 * Initializes list of edges for vertex, if it did not initialized before.
 * @param  {Number} x Index of vertex.
 */
Graph.prototype._initEdgeList = function(x) {
	if (!this.edges[x]) {
		this.edges[x] = [];
	}
};

/**
 * Inserts new edge for target vertex.
 * @param  {Array} edges Edge list of target vertex.
 * @param  {Edge} edge  New edge.
 */
Graph.prototype._insertEdgeToEdgeList = function(edges, edge) {
	edges[edges.length] = edge;
	this.numberOfEdges++;
};

/**
 * Removes edge between two vertexes. If graph is undirected, then edges will be removed for both vertexes.
 * @param  {Number} x Index of first vertex.
 * @param  {Number} y Index of second vertex.
 * @param  {Boolean} doNotRemoveBackEdge If false than we will call removeEdge with parameters (y,x).
 */
Graph.prototype.removeEdge = function(x, y, doNotRemoveBackEdge) {
	var edges = this.edges[x];
	var removeAt = this._getEdgeIndex(edges, y);
	var isSuccess = this._tryRemoveEdgeByIndex(edges, removeAt);
	if (isSuccess && !this.isDirect && !doNotRemoveBackEdge) {
		this.removeEdge(y, x, true);
	}
};

/**
 * Returns index of edge to target vertex.
 * @param  {Array} edges Edge list of current vertex.
 * @param  {Number} y Index of target vertex.
 * @return {Number} Index of edge.
 */
Graph.prototype._getEdgeIndex = function(edges, y) {
	if (edges) {
		for (var i = 0; i < edges.length; i++) {
			if (edges[i].y === y) {
				return i;
			}
		}
	}
};

/**
 * Tries to remove edge at target index.
 * @param  {Array} edges Edge list of current vertex.
 * @param  {Number} removeAt Index of target edge.
 * @return {Boolean} Returns true, if edge was removed from list.
 */
Graph.prototype._tryRemoveEdgeByIndex = function(edges, removeAt) {
	var result = false;
	if (edges && removeAt !== undefined) {
		edges.splice(removeAt, 1);
		this.numberOfEdges--;
		result = true;
	}
	return result;
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
	if (this.isVertexExist(x)) {
		this.vertexWeight[x] = undefined;
		this._vertexStates[x] = undefined;
		this.numberOfVertexes--;
		this._removeEdgesConnectedToVertex(x);
	}
};

/**
 * Removes adjacent edges to target vertex.
 * @param  {Number} x Index of vertex.
 */
Graph.prototype._removeEdgesConnectedToVertex = function(x) {
	var edges = this.edges;
	for (var i = 0; i < edges.length; i++) {
		this.removeEdge(i, x, true);
	}
	this.numberOfEdges -= edges[x].length;
	edges[x] = undefined;
};

/**
 * Checks if target vertex was added to graph.
 * @param  {Number}  x Index of vertex.
 * @return {Boolean}   Returns true if vertex added to graph.
 */
Graph.prototype.isVertexExist = function(x) {
	return this._vertexStates[x] !== undefined;
};

/**
 * Changes weight for target vertex.
 * @param {Number} x Index of vertex in array.
 * @param {Number} weight New weight of vertex.
 */
Graph.prototype.changeVertexWeight = function(x, weight) {
	if (this.isVertexExist(x)) {
		this.vertexWeight[x] = weight;
	}
};

/**
 * Changes weight of target edge.
 * @param {Number} x Index of first vertex.
 * @param {Number} y Index of second vertex.
 * @param {Number} weight New weight of edge.
 */
Graph.prototype.changeEdgeWeight = function(x, y, weight) {
	var edges = this.edges[x];
	var edgeIndex = this._getEdgeIndex(edges, y);
	if (edgeIndex !== undefined) {
		edges[edgeIndex].weight = weight;
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
	var edgeIndex = this._getEdgeIndex(edges, y);
	if (edgeIndex !== undefined) {
		return edges[edgeIndex].weight;
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
	var edges = this.edges[x];
	var edgeIndex = this._getEdgeIndex(edges, y);
	return edgeIndex !== undefined;
};

/**
 * Sets default state and color for vertexes.
 */
Graph.prototype.refreshVertexStates = function() {
	for (var i = 0; i < this.numberOfVertexes; i++) {
		this._vertexStates[i] = VERTEX_STATE.UNDISCOVERED;
		this._vertexColors[i] = VERTEX_COLOR.UNCOLORED;
	}
};

/**
 * Does breadth first search.
 * @param {Number} x Index of start vertex.
 * @param {Function} discoveredCallback Function, which will be called when vertex is discovered.
 * @param {Function} processedCallback Function, which will be called when vertex is processed.
 * @param {Function} terminateCallback This function will be called when we discovered vertex and should decide is we
 * need to continue search. To function will be sended index of vertex and its weight, and its edges.
 * @param {Function} onMeetDiscovered Function, which will be called when vertex was discovered before but we come to
 * it again.
 */
Graph.prototype.BFS = function(x, discoveredCallback, processedCallback, terminateCallback, onMeetDiscovered) {
	this._vertexStates[x] = VERTEX_STATE.DISCOVERED;
	discoveredCallback(x);
	var firstLevel = new Queue();
	firstLevel.enqueue(x);
	var allProcessed = false;
	var levelsOfTraversal = new Queue();
	levelsOfTraversal.enqueue(firstLevel);
	traversal:
	while (!allProcessed) {
		var nextLevel = new Queue();
		var currentLevel = levelsOfTraversal.dequeue();
		var vertexNumber = currentLevel.count;
		// go through current level
		for (var i = 0; i < vertexNumber; i++) {
			var vertex = currentLevel.dequeue();
			var edges = this.edges[vertex];
			// add elements of current vertex
			for (var j = 0; j < edges.length; j++) {
				if (terminateCallback(vertex, edges[j].y)) {
					break traversal;
				}
				if (this._vertexStates[edges[j].y] === VERTEX_STATE.UNDISCOVERED) {
					discoveredCallback(vertex, edges[j].y);
					nextLevel.enqueue(edges[j].y);
					this._vertexStates[edges[j].y] = VERTEX_STATE.DISCOVERED;
				} else {
					onMeetDiscovered(vertex, edges[j].y);
				}
			}
			processedCallback(vertex);
			this._vertexStates[vertex] = VERTEX_STATE.PROCESSED;
		}
		// check if we should to continue traversal
		if (!nextLevel.count) {
			allProcessed = true;
		} else {
			levelsOfTraversal.enqueue(nextLevel);
		}
	}
};

/**
 * Executes DFS from target vertex 'x'.
 * @param {Number} x Index of vertex.
 * @param {Function} discoveredCallback This function will be called when we discover vertex. To function will be
 * sended index of vertex and its weight.
 * @param {Function} processedCallback This function will be called when we processed vertex. To function will be
 * sended index of vertex and its weight.
 * @param {Function} terminateCallback This function will be called when we discovered vertex and should decide is we
 * need to continue search. To function will be sended index of vertex and its weight, and its edges.
 * @param {Function} onMeetDiscovered Function, which will be called when vertex was discovered before but we come to
 * it again.
 */
Graph.prototype.DFS = function(x, discoveredCallback, processedCallback, terminateCallback, onMeetDiscovered) {
	var edges = this.edges[x];
	this._vertexStates[x] = VERTEX_STATE.DISCOVERED;
	discoveredCallback(x, this.vertexWeight[x]);
	if (terminateCallback && terminateCallback(x, this.vertexWeight[x], edges)) {
		return;
	}
	if (edges) {
		for (var i = 0; i < edges.length; i++) {
			var y = edges[i].y;
			if (this._vertexStates[y] === VERTEX_STATE.UNDISCOVERED) {
				this.DFS(y, discoveredCallback, processedCallback, terminateCallback, onMeetDiscovered);
			} else if (onMeetDiscovered) {
				onMeetDiscovered(x, y);
			}
		}
	}
	processedCallback(x, this.vertexWeight[x]);
	this._vertexStates[x] = VERTEX_STATE.PROCESSED;
};

/**
 * Checks is all vertexes of graph is connected.
 * @return {Boolean} Returns true if all vertexes connected.
 */
Graph.prototype.isConnected = function() {
	this.DFS(0, emptyFn, emptyFn);
	var result = true;
	for (var i = 0; i < this.numberOfVertexes; i++) {
		if (this._vertexStates[i] === VERTEX_STATE.UNDISCOVERED) {
			result = false;
			break;
		}
	}
	this.refreshVertexStates();
	return result;
};

/**
 * Gets number of connected components.
 * @return {Number} Number of connected components.
 */
Graph.prototype.getNumberOfComponents = function() {
	this.DFS(0, emptyFn, emptyFn);
	var result = 1;
	for (var i = 0; i < this._vertexStates.length; i++) {
		if (this._vertexStates[i] === VERTEX_STATE.UNDISCOVERED) {
			this.DFS(i, emptyFn, emptyFn);
			result++;
		}
	}
	this.refreshVertexStates();
	return result;
};

/**
 * Computes path between two vertexes.
 * @param {Number} x Index of start vertex.
 * @param {Number} y Index of end vertex.
 * @return {Stack} Stack of vertexes, which we should visit to go from 'x' to 'y'.
 */
Graph.prototype.getPath = function(x, y) {
	var stack = new Stack();
	this.DFS(x, this._discoveredOnGetPath.bind(this, stack), this._processedOnGetPath.bind(this, stack, y),
		this._terminateOnGetPath.bind(this, y));
	this.refreshVertexStates();
	return stack.toArray();
};

/**
 * Adds new discovered vertex to stack.
 * @param {Stack} stack Stack of vertexes, that can be part of the path.
 * @param {Number} x Index of vertex.
 */
Graph.prototype._discoveredOnGetPath = function(stack, x) {
	stack.push(x);
};
/**
 * Removes discovered vertex, because it cannot be part of the path.
 * @param {Stack} stack Stack of vertexes, that can be part of the path.
 * @param {Number} to Index of target vertex.
 */
Graph.prototype._processedOnGetPath = function(stack, to) {
	if (stack.peak() !== to) {
		stack.pop();
	}
};
/**
 * Checks if current vertex is our target vertex, if so we should terminate our DFS.
 * @param {Number} to Index of target vertex.
 * @param {Number} x Index of current vertex.
 * @return {Boolean} Returns true if current vertex is our target vertex.
 */
Graph.prototype._terminateOnGetPath = function(to, x) {
	return x === to;
};

Graph.prototype.findCycle = function(x) {
	var path = new Stack();
	var counter = new Stack();
	var cycle = new Stack();
	var vertexCount = [];
	this.DFS(x, this._discoveredOnFindCycle.bind(this, path, counter, vertexCount),
		this._processedOnFindCycle.bind(this, path),
		this._terminateOnFindCycle.bind(this, cycle),
		this._onMeetDiscoveredOnFindCycle.bind(this, path, vertexCount, cycle));
	this.refreshVertexStates();
	return cycle.toArray();
};
/**
 * Adds new discovered vertex to stacks.
 * @param {Stack} path Stack of vertexes, that can be part of the path.
 * @param {Stack} counter Stack of serial numbers of vertexes, that can be part of the path.
 * @param {Stack} vertexCount Array of serial numbers of vertexes.
 * @param {Number} x Index of vertex.
 */
Graph.prototype._discoveredOnFindCycle = function(path, counter, vertexCount, x) {
	path.push(x);
	if (path.count > 1) {
		var currentNumberOfVertex = counter.peak();
		counter.push(++currentNumberOfVertex);
		vertexCount[x] = currentNumberOfVertex;
	} else {
		counter.push(0);
		vertexCount[x] = 0;
	}
};
/**
 * Removes discovered vertex, because it cannot be part of the path.
 * @param {Stack} path Stack of vertexes, that can be part of the path.
 */
Graph.prototype._processedOnFindCycle = function(path) {
	path.pop();
};
/**
 * Stops DFS if we already found a cycle.
 * @param {Stack} cycle Stack which contains vertexes from cycle.
 * @return {Boolean} Returns true if stack already have vertexes in it.
 */
Graph.prototype._terminateOnFindCycle = function(cycle) {
	return cycle.count > 0;
};
/**
 * Checks if current vertex is already discovered, if so then we check did this vertex added to 'cycle'if so, then we
 * find cycle and should terminate DFS.
 * @param {Stack} path Stack of vertexes, that can be part of the path.
 * @param {Stack} vertexCount Array of serial numbers of vertexes, that can be part of the path.
 * @param {Stack} cycle Stack which contains vertexes from cycle.
 * @param {Number} x Index of current vertex.
 * @return {Boolean} Returns true if current vertex is our target vertex.
 */
Graph.prototype._onMeetDiscoveredOnFindCycle = function(path, vertexCount, cycle, x, y) {
	if (vertexCount[x] > vertexCount[y]) {
		cycle.push(y);
		var minCountValue = vertexCount[y];
		while (path.count > 0) {
			var vertex = path.pop();
			var count = vertexCount[vertex];
			if (count > minCountValue) {
				cycle.push(vertex);
			} else {
				break;
			}
		}
	}
};

/**
 * Checks is current component of graph bipartile.
 * @param {Number} x Vertex from which we will start our traversal.
 * @return {Boolean} True if current component we can coloring with only two colors.
 */
Graph.prototype.isBipartile = function(x) {
	this._vertexColors[x] = VERTEX_COLOR.WHITE;
	this._isBipartile = true;
	this.BFS(x, this._dicoveredCallbackOnIsBipartile.bind(this), emptyFn,
		this._terminateCallbackOnIsBipartile.bind(this), this._onMeetDiscoveredOnIsBipartile.bind(this));
	this.refreshVertexStates();
	return this._isBipartile;
};

/**
 * Sets color for new discovered vertex.
 * @param {Number} x Parent vertex.
 * @param {Number} y Discovered vertex.
 */
Graph.prototype._dicoveredCallbackOnIsBipartile = function(x, y) {
	if (!y) {
		return;
	}
	this._vertexColors[y] = this._getOppositeColor(this._vertexColors[x]);
};

/**
 * Returns opposite color based on incomming parameter.
 * @param {Number} color Current color.
 * @return {Number} Opposite color.
 */
Graph.prototype._getOppositeColor = function(color) {
	return color === VERTEX_COLOR.WHITE ? VERTEX_COLOR.BLACK : VERTEX_COLOR.WHITE;
}

/**
 * Checks if both vertexes have the same color, and if so then sets internal flag '_isBipartile' to 'false', because
 * current component not a bipartile.
 * @param {Number} x Vertex, which is start of the edge.
 * @param {Number} y Vertex, which is end of the edge.
 */
Graph.prototype._onMeetDiscoveredOnIsBipartile = function(x, y) {
	if (this._vertexColors[x] === this._vertexColors[y]) {
		this._isBipartile = false;
	}
};

/**
 * If we already found that component is not bipartile, then we should stop execution.
 * @return {Boolean} Returns true if '_isBipartile' equals to 'false'.
 */
Graph.prototype._terminateCallbackOnIsBipartile = function() {
	return !this._isBipartile;
};

var Stack = function() {
	this._values = [];
	this.count = 0;
};

/**
 * Returns top element of the stack and removes it from collection.
 */
Stack.prototype.pop = function() {
	if (this.count > 0) {
		this.count--;
		var splicedArray = this._values.splice(this.count, 1);
		return splicedArray[0];
	}
};

/**
 * Returns element from top of the stack, but do not removes it.
 */
Stack.prototype.peak = function() {
	return this._values[this.count - 1];
};

/**
 * Pushes new value into stack.
 * @param {Object} value Any values, that should be added to stack.
 */
Stack.prototype.push = function(value) {
	this._values[this.count] = value;
	this.count++;
};

/**
 * Clears stack.
 */
Stack.prototype.clear = function() {
	this._values = [];
	this.count = 0;
};

/**
 * Creates shallow copy of the stack.
 */
Stack.prototype.copy = function() {
	var newStack = new Stack();
	newStack._values = this._values.slice();
	newStack.count = this.count;
	return newStack;
};

/**
 * Returns array of values in stack.
 */
Stack.prototype.toArray = function() {
	return this._values;
};

var Queue = function() {
	this._values = [];
	this.count = 0;
};

/**
 * Inserts element to queue.
 * @param  {Object} value New element.
 */
Queue.prototype.enqueue = function(value) {
	this._values[this.count] = value;
	this.count++;
};

/**
 * Retrives element from queue (fifo).
 * @return {Object} Element from queue.
 */
Queue.prototype.dequeue = function() {
	if (this.count > 0) {
		this.count--;
		var splicedArray = this._values.splice(0, 1);
		return splicedArray[0];
	}
};

/**
 * Clears queue.
 */
Queue.prototype.clear = function() {
	this._values = [];
	this.count = 0;
};

/**
 * Rerturns first element of the queue but do not retrives it.
 * @return {Object} Element of queue.
 */
Queue.prototype.peak = function() {
	return this._values[0];
};
