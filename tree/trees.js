var Node = function(key, value) {
	if (key) {
		this.key = key;
		this.value = value;
		this.parent = {};
		this.left = new Node();
		this.right = new Node();
	}
};

/*
 * Removes all links on other objects.
 */
Node.prototype.destroy = function() {
	this.key = null;
	this.value = null;
	this.parent = null;
	this.left = null;
	this.right = null;
};

/**
 * Clones values from target node to current node.
 * @param  {Node} node Node with properties, which we should copy to current node.
 */
Node.prototype.clone = function(node) {
	this.parent = node.parent;
	this.key = node.key;
	this.value = node.value;
	this.left = node.left;
	this.right = node.right;
};

(function() {

	var Utils = function() {};

	/*
	 * Replaces key and value from 'node' on values from 'newNode'.
	 */
	var _replaceNodeValue = function(node, newNode) {
		node.key = newNode.key;
		node.value = newNode.value;
	};

	/*
	 * Returns true if 'node' is direct root of left subtree of 'parent'.
	 */
	var _isLeftBrunch = function(parent, node) {
		return parent.left.key === node.key;
	};

	/*
	 * Removes link to target node from parent node.
	 */
	var _cleanLinkToNode = function(parent, node) {
		if (_isLeftBrunch(parent, node)) {
			parent.left = new Node();
		} else {
			parent.right = new Node();
		}
	};

	/*
	 * Finds min node of right subtree and move it to place of target node. Then remove dublicate from subtree.
	 */
	var _removeNodeWithTwoSubtrees = function(parent, node) {
		var minFromRight = Utils.prototype.min(node.right);
		_replaceNodeValue(node, minFromRight);
		_cleanLinkToNode(minFromRight.parent, minFromRight);
		minFromRight.destroy();
	};

	/*
	 * Changes link from parent to subtree of node.
	 */
	var _removeNodeWithOneSubtree = function(parent, node) {
		var child = node.left.key ? node.left : node.right;
		_replaceNodeValue(node, child);
		node.left = child.left;
		node.right = child.right;
		child.destroy();
	};

	/**
	 * Removes node from tree. It checks current node and choose appropriate way for deleting node.
	 * @param  {Node} node Node, which we will remove.
	 * @param  {Node} parent Parent node for removing node.
	 */
	var _removeNode = function(node, parent) {
		if (node.left.key === undefined && node.right.key === undefined) {
			_cleanLinkToNode(parent, node);
			node.destroy();
		} else if (node.left.key === undefined || node.right.key === undefined) {
			_removeNodeWithOneSubtree(parent, node);
		} else {
			_removeNodeWithTwoSubtrees(parent, node);
		}
	};

	/*
	 * Adds new node inside of binary search tree.
	 */
	Utils.prototype.insert = function(node, parent, newNode) {
		if (node.key) {
			if (node.key > newNode.key) {
				this.insert(node.left, node, newNode);
			} else {
				this.insert(node.right, node, newNode);
			}
		} else {
			node.clone(newNode);
			node.parent = parent;
		}
	};
	/*
	 * Removes node from binary search tree.
	 */
	Utils.prototype.delete = function(node, parent, key) {
		if (node.key === key) {
			_removeNode(node, parent);
		} else if (node.key > key) {
			this.delete(node.left, node, key);
		} else {
			this.delete(node.right, node, key);
		}
	};
	/*
	 * Execute search for min value in binary search tree.
	 */
	Utils.prototype.min = function(node) {
		var result = node;
		var branch = node.left;
		if (branch && branch.key) {
			result = this.min(branch);
		}
		return result;
	};
	/*
	 * Execute search for max value in binary search tree.
	 */
	Utils.prototype.max = function(node) {
		var result = node;
		var branch = node.right;
		if (branch && branch.key) {
			result = this.max(branch);
		}
		return result;
	};
	/*
	 * Execute traversal in binary search tree.
	 */
	Utils.prototype.iterate = function(node, callback) {
		if (node.key) {
			this.iterate(node.left, callback);
			callback(node);
			this.iterate(node.right, callback);
		}
	};
	/*
	 * Execute search inside of binary search tree.
	 */
	Utils.prototype.find = function(key, node) {
		var result;
		if (node.key) {
			if (node.key === key) {
				result = node.value;
			} else if (node.key < key) {
				result = this.find(key, node.right);
			} else {
				result = this.find(key, node.left);
			}
		}
		return result;
	};

	window.BinarySearchTreeUtils = Utils;
})(window);

var Tree = function(root, treeType) {
	this.root = root;
	var utilsProvider;
	switch (treeType) {
		case "BinarySearch":
			utilsProvider = new BinarySearchTreeUtils();
			break;
	}
	this.utilsProvider = utilsProvider;
};

/*
 * Adds new node into the tree.
 */
Tree.prototype.insert = function(node) {
	this.utilsProvider.insert(this.root, this.root, node);
};
/*
 * Removes target node from the tree.
 */
Tree.prototype.delete = function(key) {
	this.utilsProvider.delete(this.root, this.root, key);
};
/*
 * Finds min value in the tree.
 */
Tree.prototype.min = function() {
	return this.utilsProvider.min(this.root);
};
/*
 * Finds max value in the tree.
 */
Tree.prototype.max = function() {
	return this.utilsProvider.max(this.root);
};
/*
 * Calls 'callback' on each node of the tree in sorted order.
 */
Tree.prototype.iterate = function(callback) {
	this.utilsProvider.iterate(this.root, callback);
};
/*
 * Finds value of node with target key inside of the tree.
 */
Tree.prototype.find = function(key) {
	return this.utilsProvider.find(key, this.root);
};
