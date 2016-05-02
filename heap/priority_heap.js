var Node = function(key, value) {
	this.key = key;
	this.value = value;
};

Node.prototype.compare = function(node) {
	if (this.key === node.key) {
		return 0;
	} else if (this.key > node.key) {
		return 1;
	} else {
		return -1;
	}
};

var BaseHeap = function() {};
BaseHeap.prototype.insert = function() {
	throw new Error("Not implemented");
};
BaseHeap.prototype.dequeueMin = function() {
	throw new Error("Not implemented");
};
BaseHeap.prototype.dequeueMax = function() {
	throw new Error("Not implemented");
};

(function(window) {
	var Utils = function() {};

	var shiftUp = function(node, elements, currentIndex) {
		var parentIndex = Utils.prototype.getParentIndex(currentIndex);
		if (parentIndex !== undefined && node.compare(elements[parentIndex]) < 0) {
			var parentItem = elements[parentIndex];
			elements[parentIndex] = node;
			elements[currentIndex] = parentItem;
			shiftUp(node, elements, parentIndex);
		}
	};

	var findMinIndex = function(elements, currentIndex) {
		var minIndex;
		var leftIndex = Utils.prototype.getLeftChildIndex(currentIndex);
		var rightIndex = Utils.prototype.getRightChildIndex(currentIndex);
		if (rightIndex >= elements.length) {
			if (leftIndex >= elements.length) {
				return;
			} else {
				minIndex = leftIndex;
			}
		} else {
			if (elements[leftIndex].compare(elements[rightIndex]) > 0) {
				minIndex = rightIndex;
			} else {
				minIndex = leftIndex;
			}
		}
		return minIndex;
	};

	var shiftDown = function(node, elements, currentIndex) {
		var minIndex = findMinIndex(elements, currentIndex);
		if (minIndex && elements[currentIndex].compare(elements[minIndex]) > 0) {
			var minElement = elements[minIndex];
			elements[minIndex] = node;
			elements[currentIndex] = minElement;
			shiftDown(node, elements, minIndex);
		}
	};

	Utils.prototype = Object.create(BaseHeap.prototype);
	Utils.prototype.constructor = Utils;
	/*
	 * Retrives index of parent node.
	 * Formula Parent(i) = (i - 1) / 2.
	 */
	Utils.prototype.getParentIndex = function(currentIndex) {
		// TODO: need to decide wich value should return when we try to get parent of root element
		if (currentIndex !== 0) {
			return Math.floor((currentIndex - 1) / 2);
		}
	};
	/*
	 * Retrives index of left child node.
	 * Formula Left(i) = 2 * i + 1.
	 */
	Utils.prototype.getLeftChildIndex = function(currentIndex) {
		return Math.floor(currentIndex * 2 + 1);
	};
	/*
	 * Retrives index of right child node.
	 * Formula Right(i) = 2 * i + 2.
	 */
	Utils.prototype.getRightChildIndex = function(currentIndex) {
		return Math.floor(currentIndex * 2 + 2);
	};
	/*
	 * Inserts new node into min-heap.
	 */
	Utils.prototype.insert = function(node, elements) {
		elements[elements.length] = node;
		shiftUp(node, elements, elements.length - 1);
	};

	/**
	 * Dequeue min element from heap.
	 * @param  {Array} elements Elements of heap.
	 * @return {Node} Min node from heap.
	 */
	Utils.prototype.dequeueMin = function(elements) {
		var min = elements[0];
		var lastIndex = elements.length - 1;
		elements[0] = elements[lastIndex];
		elements.splice(lastIndex, 1);
		shiftDown(elements[0], elements, 0);
		return min;
	};

	window.MinHeap = Utils;
})(window);

var Heap = function(root, utilsProvider) {
	this.elements = [root];
	switch(utilsProvider) {
		case "MinHeap":
			this.utilsProvider = new MinHeap();
			break;
	}
};

/**
 * Inserts new node into heap.
 * @param {Node} node New node, that will be inserted into heap.
 */
Heap.prototype.insert = function(node) {
	this.utilsProvider.insert(node, this.elements);
};

/**
 * Removes and returns min value from heap.
 * @return {Node} Min value from heap.
 */
Heap.prototype.dequeueMin = function() {
	return this.utilsProvider.dequeueMin(this.elements);
};

/**
 * Removes and returns max value from heap.
 * @return {Node} Max value from heap.
 */
Heap.prototype.dequeueMax = function() {
	return this.utilsProvider.dequeueMax(this.elements);
};
