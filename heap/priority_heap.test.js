describe("Priority min heap", function() {
	beforeEach(function() {
		var node1 = new Node(1, {value: 1});
		var node2 = new Node(2, {value: 2});
		var node3 = new Node(3, {value: 3});
		var node4 = new Node(4, {value: 4});
		var node5 = new Node(5, {value: 5});
		var node6 = new Node(6, {value: 6});
		var heap = new Heap(node2, "MinHeap");
		heap.insert(node1);
		heap.insert(node3);
		heap.insert(node5);
		heap.insert(node4);
		heap.insert(node6);
		this.heap = heap;
		this.nodeArray = [node1, node2, node3, node4, node5, node6];
	});

	describe(" - constructor", function() {
		var node = new Node(1, {value: 1});
		var heap = new Heap(node, "MinHeap");
		it(" - should insert root node", function() {
			expect(heap.elements.length).toEqual(1);
			expect(heap.elements[0]).toEqual(node);
		});
	});

	describe(" - insert", function() {
		it(" - should insert elements to heap", function() {
			var heap = this.heap;
			var expected = this.nodeArray;
			expect(heap.elements).toEqual(jasmine.arrayContaining(expected));
		});
	});

	describe(" - dequeueMin", function() {
		it(" - should dequeue min element from heap", function() {
			var heap = this.heap;
			var nodes = this.nodeArray;
			for (var i = 0; i < nodes.length; i++) {
				expect(heap.dequeueMin()).toEqual(nodes[i]);
			}
		});
	});

	describe(" - dequeueMax", function() {
		it(" - should throw exeption", function() {
			var heap = this.heap;
			expect(function() {
				heap.dequeueMax();
			}).toThrowError("Not implemented");
		});
	});
});