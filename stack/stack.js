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
