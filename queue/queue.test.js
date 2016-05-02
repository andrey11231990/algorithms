describe("Queue", function() {
	var fillQueue = function(queue, count) {
		for (var i = 1; i <= count; i++) {
			queue.enqueue(i);
		}
	}

	describe(" - enqueue", function() {
		it(" - should insert element to queue", function() {
			var queue = new Queue();
			for (var i = 1; i < 5; i++) {
				queue.enqueue(i);
				expect(queue.count).toEqual(i);
			}
			expect(queue._values).toEqual(jasmine.arrayContaining([1, 2, 3, 4]));
		});
	});

	describe(" - dequeue", function() {
		it(" - should retrive first element from queue (fifo)", function() {
			var queue = new Queue();
			var length = 5;
			fillQueue(queue, length);
			for (var i = 1; i <= length; i++) {
				expect(queue.dequeue()).toEqual(i);
				expect(queue.count).toEqual(length - i);
			}
		});

		it(" - should return undefined for empty queue", function() {
			var queue = new Queue();
			expect(queue.dequeue()).toBeUndefined();
		});
	});

	describe(" - peak", function() {
		it(" - should return undefined for empty queue", function() {
			var queue = new Queue();
			expect(queue.peak()).toBeUndefined();
			expect(queue.count).toEqual(0);
		});

		it(" - should return first element for queue but do not retrive it", function() {
			var queue = new Queue();
			var length = 5;
			fillQueue(queue, length);
			expect(queue.peak()).toEqual(1);
			expect(queue.count).toEqual(length);
		});
	});

	describe(" - clear", function() {
		it(" - should clear queue", function() {
			var queue = new Queue();
			fillQueue(queue, 5);
			queue.clear();
			expect(queue.count).toEqual(0);
			expect(queue._values.length).toEqual(0);
		})
	});
});
