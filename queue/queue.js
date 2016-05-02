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
