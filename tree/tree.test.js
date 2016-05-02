describe("Binary search tree", function() {
	beforeEach(function() {
		var tree = new Tree(new Node(3, 3), "BinarySearch");
		tree.insert(new Node(2, 2));
		tree.insert(new Node(1, 1));
		tree.insert(new Node(5, 5));
		tree.insert(new Node(4, 4));
		tree.insert(new Node(6, 6));
		this.tree = tree;
	})

	describe(" - constructor", function() {
		var tree = new Tree(new Node(3, 3), "BinarySearch");
		var root = tree.root;

		it(" - should insert root node for tree", function() {
			expect(root.key).toEqual(3);
			expect(root.value).toEqual(3);
		});
	});

	describe(" - insert", function() {
		it(" - should insert nodes at first level", function() {
			var root = this.tree.root;
			var leftChild = root.left;
			var rightChild = root.right;
			expect(leftChild.key).toEqual(2);
			expect(rightChild.key).toEqual(5);
		});

		it(" - should insert nodes at second level", function() {
			var root = this.tree.root;
			var leftChild = root.left;
			var rightChild = root.right;
			var leftLeftChild = leftChild.left;
			expect(leftLeftChild.key).toEqual(1);
			var leftRightChild = rightChild.left;
			expect(leftRightChild.key).toEqual(4);
			var rightRightChild = rightChild.right;
			expect(rightRightChild.key).toEqual(6);
		});
	});

	describe(" - delete", function() {

		it(" - should delete root witout children", function() {
			var tree = new Tree(new Node(3, 3), "BinarySearch");
			tree.delete(3);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(0);
		});

		it(" - should delete root with one child", function() {
			var tree = new Tree(new Node(3, 3), "BinarySearch");
			tree.insert(new Node(5, 5));
			tree.insert(new Node(4, 4));
			tree.insert(new Node(6, 6));
			tree.delete(3);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(3);
		});

		it(" - should delete root with two children", function() {
			var tree = this.tree;
			tree.delete(3);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(5);
		});

		it(" - should delete internal node with one child", function() {
			var tree = this.tree;
			tree.delete(2);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(5);
		});

		it(" - should delete internal node with two children", function() {
			var tree = this.tree;
			tree.delete(5);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(5);
		});

		it(" - should delete leaf node", function() {
			var tree = this.tree;
			tree.delete(1);
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array.length).toEqual(5);
		});
	});

	describe(" - min", function() {
		it(" - should return min value", function() {
			var tree = this.tree;
			var node = tree.min();
			expect(node.key).toEqual(1);
		});
	});

	describe(" - max", function() {
		it(" - should return max value", function() {
			var tree = this.tree;
			var node = tree.max();
			expect(node.key).toEqual(6);
		});
	});

	describe(" - find", function() {

		it(" - should return value if we seek for root node", function() {
			var tree = this.tree;
			var node = tree.find(3);
			expect(node).toEqual(3);
		});

		it(" - should return value if we seek for leaf node", function() {
			var tree = this.tree;
			var node = tree.find(1);
			expect(node).toEqual(1);
			node = tree.find(4);
			expect(node).toEqual(4);
			node = tree.find(6);
			expect(node).toEqual(6);
		});

		it(" - should return value if we seek for internal node", function() {
			var tree = this.tree;
			var node = tree.find(5);
			expect(node).toEqual(5);
			node = tree.find(2);
			expect(node).toEqual(2);
		});

		it(" - should return 'undefined' for not existing element", function() {
			var tree = this.tree;
			var node = tree.find(8);
			expect(node).toEqual(undefined);
		});
	});

	describe(" - iterate", function() {
		it(" - should call callback for elements in sorted order", function() {
			var tree = this.tree;
			var expected = [1, 2, 3, 4, 5, 6];
			var array = [];
			tree.iterate(function(node) {
				array.push(node.key);
			});
			expect(array).toEqual(jasmine.arrayContaining(expected));
		});
	});
});