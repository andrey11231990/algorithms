/**
 * Linked list.
 */



/**
 * Node of linked list.
 * @param {Object} value Value of node.
 */
var Node = function(value) {
	this.value = value;
	this.next = null;
};

/**
 * Calls destroy for value of node, if this method is defined. Also clears properties of node.
 * @return {[type]} [description]
 */
Node.prototype.destroy = function() {
	if (this.value.destroy) {
		this.value.destroy();
	}
	this.value = null;
	this.next = null;
};

/**
 * Linked list.
 */
var LinkedList = function() {
	this.head = null;
	this.count = 0;
};

/**
 * REverses elements in linked list.
 */
LinkedList.prototype.reverse = function() {
	var current = this.head;
	while(current) {
		var prev = this.head;
		this.head = current;
		current = current.next;
		if (this.head !== prev) {
			this.head.next = prev;
		} else {
			this.head.next = null;
		}
	}
};

/**
 * Adds new node to list.
 * @param {Object} value New value.
 */
LinkedList.prototype.add = function(value) {
	var node = new Node(value);
	node.next = this.head;
	this.head = node;
	this.count++;
};

/**
 * Iterates over each value in linked list.
 * @param  {Function} callback Function in which we will send value of each node.
 */
LinkedList.prototype.each = function(callback) {
	var node = this.head;
	while (node) {
		callback(node.value);
		node = node.next;
	}
};

/**
 * Removes elements from list for which function 'compare' returns 'true'.
 * @param  {Function} compare Function, which should return 'true' for items, which we should remove from list.
 */
LinkedList.prototype.remove = function(compare) {
	var node = this.head;
	var prev = this.head;
	while(node) {
		var current = node;
		node = node.next;
		if (compare(current)) {
			this._replaceLinkFromPreviousNode(current, prev);
			current.destroy();
			this.count--;
		} else {
			prev = current;
		}
	}
};

/**
 * Replaced link from parent node to current node on next node in list.
 * @param  {Node} node Node for removing.
 * @param  {Node} prev Previous node.
 */
LinkedList.prototype._replaceLinkFromPreviousNode = function(node, prev) {
	var temp = node;
	if (this.head === temp) {
		this.head = node.next;
	} else {
		prev.next = node.next;
	}
};

/**
 * Clears linked list.
 */
LinkedList.prototype.clear = function() {
	var node = this.head;
	while (node) {
		var temp = node;
		node = temp.next;
		temp.destroy();
	}
	this.head = null;
	this.count = 0;
};
