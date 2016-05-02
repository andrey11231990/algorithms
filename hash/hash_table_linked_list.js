/**
 * Hash table with chaining.
 * In hashing with chaining, a collision is resolved by allowing more than one element to live at each position in the
 * table. Each entry in the array A is a pointer to the head of a linked list. To insert the value x, we simply append
 * it to the list A[x0]. To search for the element x, we perform a linear search in the list A[x0]. To delete the
 * element x, we search for x in the list A[x0] and splice it out.
 * From start size of bucket array is 101. When we add more than 10 items at one index of bucket array, then we will
 * resize it.
 */
var HashTable = function() {
	this._defaultArraySize = 101;
	this._items = new Array(this._defaultArraySize);
	this.count = 0;
};

/**
 * Returns array of added keys to hash table.
 * @return {Array} Array of keys.
 */
HashTable.prototype.getKeys = function() {
	var result = [];
	this._iterateOverBucketArray(function(node) {
		result.push(node.key);
	});
	return result;
};

/**
 * Returns array of added values to hash table.
 * @return {Array} Array of values.
 */
HashTable.prototype.getValues = function() {
	var result = [];
	this._iterateOverBucketArray(function(node) {
		result.push(node.value);
	});
	return result;
};

/**
 * Get value from item with target key.
 * @param  {String} key Key of item.
 * @return {Object} Value associated with key.
 */
HashTable.prototype.getValueByKey = function(key) {
	var result;
	var hash = this.getHash(key);
	var list = this._items[hash];
	if (list) {
		list.each(function(value) {
			if (value.key === key) {
				result = value.value;
			}
		});
	}
	return result;
};

/**
 * Goes over all elements in hash table.
 * @param  {Function} callback Callback in which will be sended value of node of linked list from bucket array.
 * @param  {Array} array Optional parameter. If we want iterate over bucket array, which diff from 'this._items', then
 * we can pass it as parameter.
 */
HashTable.prototype._iterateOverBucketArray = function(callback, array) {
	var items = array || this._items;
	for (var i = 0; i < items.length; i++) {
		var list = items[i];
		if (list) {
			list.each(function(value) {
				callback(value);
			});
		}
	}
};

/**
 * Adds new item with target key to HashTable.
 * @param {String} key Key for value.
 * @param {Object} value Value for hash table.
 */
HashTable.prototype.add = function(key, value) {
	var hash = this.getHash(key);
	var item = this._generateItem(key, value);
	this._insertInBucket(hash, item);
	this.count++;
	this._resize(this._items[hash].count);
};

/**
 * Inserts new item into bucket at target hash. If linked list for target bucket was not created, then we create it.
 * @param  {Number} hash Index of bucket in bucket array.
 * @param  {Object} item Value for bucket.
 */
HashTable.prototype._insertInBucket = function(hash, item) {
	var listAtIndex = this._items[hash];
	if (listAtIndex) {
		listAtIndex.add(item);
	} else {
		var list = new LinkedList();
		list.add(item);
		this._items[hash] = list;
	}
};

/**
 * Generates item which will be stored in list inside of bucket array.
 * @param {String} key Key for value.
 * @param {Object} value Value for hash table.
 * @return {Object} Item for list.
 */
HashTable.prototype._generateItem = function(key, value) {
	return {
		key: key,
		value: value
	};
};

/**
 * Resizes bucket array of our hast table if linked list contains 10 or more items.
 * @param  {Number} count Length of linked list, in which we added new item.
 */
HashTable.prototype._resize = function(count) {
	if (count >= 10) {
		var currentArray = this._items;
		var newLength = this._generateNextPrimeNumber(currentArray.length * 2);
		this.clear(newLength);
		this._iterateOverBucketArray(function(node) {
			this.add(node.key, node.value);
		}.bind(this), currentArray);
	}
};

/**
 * Clears hast table.
 * @param  {Number} arraySize Optional parameter. Set length of bucket array.
 */
HashTable.prototype.clear = function(arraySize) {
	this.count = 0;
	this._clearBucketArray();
	this._items = new Array(arraySize || this._items.length);
};

/**
 * Iterates over bucket array and call 'clear' for each linked list in it.
 */
HashTable.prototype._clearBucketArray = function() {
	var items = this._items;
	for (var i = 0; i < items.length; i++) {
		var list = items[i];
		if (list) {
			list.clear();
		}
	}
};

/**
 * Checks if hast table contains element with target key.
 * @param  {String} key Key to search.
 * @return {Boolean} True if hash table contains element with target key.
 */
HashTable.prototype.contains = function(key) {
	var result = false;
	var hash = this.getHash(key);
	var list = this._items[hash];
	if (list) {
		list.each(function(node) {
			if (node.key === key) {
				result = true;
			}
		});
	}
	return result;
};

/**
 * Removes element with target key from hash table.
 * @param  {String} key Key for removing.
 */
HashTable.prototype.remove = function(key) {
	var hash = this.getHash(key);
	var list = this._items[hash];
	if (list) {
		var prevLength = list.count;
		this._removeFromList(list, key);
		var diff = prevLength - list.count;
		this.count -= diff;
	}
};

/**
 * Removes item by key from linked list.
 * @param  {LinkedList} list List, where we should remove item.
 * @param  {String} key  Target key.
 */
HashTable.prototype._removeFromList = function(list, key) {
	list.remove(function(node) {
		return key === node.value.key;
	});
};

/**
 * Computes hash for target key.
 * @param  {String} key String for which we should compute hash.
 * @return {Number} Hash value.
 */
HashTable.prototype.getHash = function(key) {
	var hash = this._computeHash(key);
	return this._compressHash(hash, this._items.length);
};

/**
 * Hash function.
 * @param  {String} key String for which we should compute hash.
 * @return {Number} Uncompressed hash.
 */
HashTable.prototype._computeHash = function(key) {
	var hash = 0;
	var shift = 5;
	for (var i = 0; i < key.length; i++) {
		hash = hash << shift;
		hash += key.charCodeAt(i);
	}
	return hash;
};

/**
 * Compression function.
 * For simpicity here used 'division method' for compression.
 * @param  {Number} hash Uncompressed hash.
 * @param  {Number} arraySize Length of bucket array.
 * @return {Number} Compressed hash.
 */
HashTable.prototype._compressHash = function(hash, arraySize) {
	hash = Math.abs(hash);
	return hash % arraySize;
};

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

/**
 * Generates next prime number for numbers more than 23. This function will be used for hash tables to resize bucket
 * array and there min size of that array is 101, so for simplicity this function expects 'number' > 23. If you send
 * prime number as parameter, then function will return it.
 * For improved algorithm look at 'implementation 7' by link 
 * http://stackoverflow.com/questions/4475996/given-prime-number-n-compute-the-next-prime
 * @param  {Number} number New prime number must be more then value from this parameter.
 * @return {Number} Prime number.
 */
HashTable.prototype._generateNextPrimeNumber = function(number) {
	var shouldContinue = true;
	while (shouldContinue) {
		if (this._isPrime(number)) {
			shouldContinue = false;
		} else {
			number++;
		}
	}
	return number;
};

/**
 * Checks is target number is prime.
 * @param  {Number}  number Number for cheking.
 * @return {Boolean} Returns true, if target number is prime.
 */
HashTable.prototype._isPrime = function(number) {
	if (number <= 23) {
		throw new Error("Number must be more then 23");
	}
	for (var i = 0; i < SMALL_PRIME_NUMBERS.length; i++) {
		if (number % SMALL_PRIME_NUMBERS[i] === 0) {
			return false;
		}
	}
	// 29 - next prime after 23, which is the largest prime number in 'SMALL_PRIME_NUMBERS' array.
	for (var i = 29; i < number; i++) {
		if (number % i === 0) {
			return false;
		}
	}
	return true;
};

/**
 * Array of small prime numbers, which we will use to check first.
 * @type {Array}
 */
var SMALL_PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23];
