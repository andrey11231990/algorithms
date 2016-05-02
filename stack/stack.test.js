describe("Stack", function() {
	var fillStack = function(stack, count) {
		for (var i = 1; i <= count; i++) {
			stack.push(i);
		}
	};

	describe(" - push", function() {
		it (" - should add new elements to stack", function() {
			var stack = new Stack();
			expect(stack.count).toEqual(stack._values.length);
			for (var i = 0; i < 5; i++) {
				stack.push(i);
				expect(stack.count).toEqual(stack._values.length);
				expect(stack.count).toEqual(i + 1);
			}
		});
	});

	describe(" - pop", function() {
		it(" - should retrive element from stack", function() {
			var stack = new Stack();
			var length = 5;
			fillStack(stack, length);
			for (var i = length; i > 0; i--) {
				expect(stack.count).toEqual(i);
				expect(stack.pop()).toEqual(i);
			}
		});

		it(" - should return undefined if stack is empty", function() {
			var stack = new Stack();
			var result = stack.pop();
			expect(result).toBeUndefined();
			expect(stack.count).toEqual(0);
		});
	});

	describe(" - peak", function() {
		it(" - should return undefined for empty stack", function() {
			var stack = new Stack();
			expect(stack.peak()).toBeUndefined();
			expect(stack.count).toEqual(0);
		});

		it(" - should return first candidate for retrieving but do not retrieve it from stack", function () {
			var stack = new Stack();
			fillStack(stack, 1);
			expect(stack.peak()).toEqual(1);
			expect(stack.count).toEqual(1);
		});
	});

	describe(" - clear", function() {
		it(" - should clear array", function() {
			var stack = new Stack();
			fillStack(stack, 5);
			stack.clear();
			expect(stack.count).toEqual(0);
			expect(stack._values.length).toEqual(0);
		});
	});

	describe(" - copy", function() {
		it(" - should create shallow copy of stack", function() {
			var stack = new Stack();
			var length = 5;
			fillStack(stack, length);
			var copy = stack.copy();
			expect(copy.count).toEqual(stack.count);
			for (var i = 0; i < length; i++) {
				expect(copy.pop()).toEqual(stack.pop());
				expect(copy.count).toEqual(stack.count);
			}
		});
	});
});