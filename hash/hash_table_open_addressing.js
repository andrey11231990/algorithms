/**
 * Hash table with open addressing.
 * Hashing with open addressing differs from hashing with chaining in that each table position A[i] is allowed to store
 * only one value. When a collision occurs at table position i, one of the two elements involved in the collision must
 * move on to the next element in its probe sequence.
 * To search for an element x in the hash table we look for x at positions A[x0], A[x1], A[x2], and so on until we
 * either (1) find x, in which case we are done or (2) find an empty table position A[xi] that is not marked as deleted,
 * in which case we can be sure that x is not stored in the table (otherwise it would be stored at position xi). To
 * delete an element x from the hash table we first search for x. If we find x at table location A[xi] we then simply
 * mark A[xi] as deleted. To insert a value x into the hash table we examine table positions A[x0], A[x1], A[x2], and
 * so on until we find a table position A[xi] that is either empty or marked as deleted and we store the value x in
 * A[xi].
 * From start size of bucket array is 101. When we add more than 80% of bucket array length (deleted but not replaced
 * also counts), then we will resize it.
 */
var HashTable = function() {
	this._defaultArraySize = 101;
	this._items = new Array(this._defaultArraySize);
	this.count = 0;
	this._total = 0;
};

/**
 * Returns array of added keys to hash table.
 * @return {Array} Array of keys.
 */
HashTable.prototype.getKeys = function() {
	var result = [];
	this._iterateOverNotRemovedItems(function(item) {
		result.push(item.key);
	});
	return result;
};

/**
 * Returns array of added values to hash table.
 * @return {Array} Array of values.
 */
HashTable.prototype.getValues = function() {
	var result = [];
	this._iterateOverNotRemovedItems(function(item) {
		result.push(item.value);
	});
	return result;
};

/**
 * Iterates over all not removed elements in bucket array and calls callback with sending each item to it.
 * @param  {Function} callback Function for handling items from bucket array.
 */
HashTable.prototype._iterateOverNotRemovedItems = function(callback) {
	var items = this._items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item && !item.deleted) {
			callback(item);
		}
	}
};

/**
 * Get value from item with target key.
 * @param  {String} key Key of item.
 * @return {Object} Value associated with key.
 */
HashTable.prototype.getValueByKey = function(key) {
	var result;
	this._iterateOverItemsAtKey(key, function(item) {
		if (!item) {
			return true;
		} else if (!item.deleted && item.key === key) {
			result = item.value;
			return true;
		}
	});
	return result;
};

/**
 * Adds new item with target key to HashTable.
 * @param {String} key Key for value.
 * @param {Object} value Value for hash table.
 */
HashTable.prototype.add = function(key, value) {
	var items = this._items;
	var index;
	this._iterateOverItemsAtKey(key, function(item, itemIndex) {
		if (!item || item.deleted) {
			index = itemIndex;
			return true;
		}
	});
	if (!index) {
		this._resize(true);
		this.add(key, value);
	} else {
		if (!items[index]) {
			this._total++;
		}
		items[index] = this._generateItem(key, value);
		this.count++;
	}
	this._resize();
};

/**
 * Iterates over bucket array from index which we get by computing hash for target key.
 * @param  {String}   key      Target key.
 * @param  {Function} callback Function which we will call for each element from index of hash code. If callback
 * returns true, then we will break iteration.
 */
HashTable.prototype._iterateOverItemsAtKey = function(key, callback) {
	var hash = this.getHash(key);
	var items = this._items;
	for (var i = hash; i < items.length; i++) {
		if (callback(items[i], i)) {
			break;
		}
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
		value: value,
		deleted: false
	};
};

/**
 * Resizes bucket array of our hast table if load factor is more then 80% or 'shouldResizeNow' is 'true'.
 * @param  {Boolean} shouldResizeNow Optional parameter. If we should resize bucket array in any way, then it should be
 * true.
 */
HashTable.prototype._resize = function(shouldResizeNow) {
	var loadFactor = (this._total / this._items.length) * 100;
	if (shouldResizeNow || loadFactor >= 80) {
		var currentArray = this._items;
		var newLength = this._generateNextPrimeNumber(currentArray.length * 2);
		this.clear(newLength);
		for (var i = 0; i < currentArray.length; i++) {
			var item = currentArray[i];
			if (item && !item.deleted) {
				this.add(item.key, item.value);
			}
		}
	}
};

/**
 * Clears hast table.
 * @param  {Number} arraySize Optional parameter. Set length of bucket array.
 */
HashTable.prototype.clear = function(arraySize) {
	this.count = 0;
	this._total = 0;
	this._items = new Array(arraySize || this._items.length);
};

/**
 * Checks if hast table contains element with target key.
 * @param  {String} key Key to search.
 * @return {Boolean} True if hash table contains element with target key.
 */
HashTable.prototype.contains = function(key) {
	var result = false;
	this._iterateOverItemsAtKey(key, function(item) {
		if (!item) {
			return true;
		} else if (!item.deleted && item.key === key) {
			result = true;
			return true;
		}
	});
	return result;
};

/**
 * Removes element with target key from hash table.
 * @param  {String} key Key for removing.
 */
HashTable.prototype.remove = function(key) {
	var callback = function(item, itemIndex) {
		if (!item) {
			return true;
		} else if (item.key === key) {
			item.deleted = true;
			this.count--;
			return true;
		}
	}.bind(this);
	this._iterateOverItemsAtKey(key, callback);
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