describe("Graph", function() {
	describe("addEdge", function() {
		describe("in directed graph", function() {
			var graph = new Graph(true);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addEdge(0, 1, 0);

			it(" - should add edge only in target direction", function() {
				expect(graph.edges[0].length).toEqual(1);
				expect(graph.edges[1]).toBeUndefined();
			});

			it(" - should change 'numberOfEdges' property", function() {
				expect(graph.numberOfEdges).toEqual(1);
			});
		});

		describe("in undirected graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addEdge(0, 1, 0);

			it(" - should add edge in both directions", function() {
				expect(graph.edges[0].length).toEqual(1);
				expect(graph.edges[1].length).toEqual(1);
			});

			it(" - should change 'numberOfEdges' property", function() {
				expect(graph.numberOfEdges).toEqual(2);
			});
		});
	});

	describe("removeEdge", function() {
		describe("in directed graph", function() {
			describe("for existing edge", function() {
				var graph = new Graph(true);
				graph.addVertex(0, 0);
				graph.addVertex(1, 0);
				graph.addEdge(0, 1, 0);
				graph.removeEdge(0, 1);

				it(" - should remove target edge", function() {
					expect(graph.edges[0].length).toEqual(0);
				});

				it(" - should change 'numberOfEdges' property", function() {
					expect(graph.numberOfEdges).toEqual(0);
				});
			});

			describe("for not existing edge", function() {
				var graph = new Graph(true);
				graph.addVertex(0, 0);
				graph.addVertex(1, 0);
				graph.addEdge(0, 1, 0);
				graph.removeEdge(1, 0);

				it(" - should not remove edges", function() {
					expect(graph.edges[0].length).toEqual(1);
				});

				it(" - should not change 'numberOfEdges' property", function() {
					expect(graph.numberOfEdges).toEqual(1);
				});
			});
		});

		describe("in undirected graph", function() {
			describe("for existing edge", function() {
				var graph = new Graph(false);
				graph.addVertex(0, 0);
				graph.addVertex(1, 0);
				graph.addEdge(0, 1, 0);
				graph.removeEdge(1, 0);

				it(" - should remove edge in both directions", function() {
					expect(graph.edges[0].length).toEqual(0);
					expect(graph.edges[1].length).toEqual(0);
				});

				it(" - should change 'numberOfEdges' property", function() {
					expect(graph.numberOfEdges).toEqual(0);
				});
			});

			describe("for not existing edge", function() {
				var graph = new Graph(false);
				graph.addVertex(0, 0);
				graph.addVertex(1, 0);
				graph.addEdge(0, 1, 0);
				graph.removeEdge(2, 0);

				it(" - should not remove edges", function() {
					expect(graph.edges[0].length).toEqual(1);
					expect(graph.edges[1].length).toEqual(1);
				});

				it(" - should not change 'numberOfEdges' property", function() {
					expect(graph.numberOfEdges).toEqual(2);
				});
			});
		});
	});

	describe("addVertex", function() {
		var graph = new Graph(true);
		var vertexWeight = 5;
		var vertex = 0;
		graph.addVertex(vertex, vertexWeight);

		it(" - should change 'numberOfVertexes' property", function() {
			expect(graph.numberOfVertexes).toEqual(1);
		});

		it(" - should set weight for vertex", function() {
			expect(graph.vertexWeight[vertex]).toEqual(vertexWeight);
		});

		it(" - should mark vertex as 'UNDISCOVERED'", function() {
			expect(graph._vertexStates[vertex]).toEqual(VERTEX_STATE.UNDISCOVERED);
		});
	});

	describe("removeVertex", function() {
		describe("for existing vertex", function() {
			var graph = new Graph(true);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(2, 0, 0);
			graph.removeVertex(0);

			it(" - should change 'numberOfVertexes' property", function() {
				expect(graph.numberOfVertexes).toEqual(2);
			});

			it(" - should remove weight for vertex", function() {
				expect(graph.vertexWeight[0]).toBeUndefined();
			});

			it(" - should remove edges started from this vertex", function() {
				expect(graph.edges[0]).toBeUndefined();
			});

			it(" - should remove edges connected to this vertex", function() {
				expect(graph.edges[2].length).toEqual(0);
			});

			it(" - should change 'numberOfEdges' property", function() {
				expect(graph.numberOfEdges).toEqual(0);
			});
		});

		describe("for not existing vertex", function() {
			var graph = new Graph(true);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(2, 0, 0);
			graph.removeVertex(3);

			it(" - should not change 'numberOfVertexes' property", function() {
				expect(graph.numberOfVertexes).toEqual(3);
			});

			it(" - should not change 'numberOfEdges' property", function() {
				expect(graph.numberOfEdges).toEqual(2);
			});
		});
	});

	describe("isVertexExist", function() {
		var graph = new Graph(true);
		graph.addVertex(0, 0);

		it(" - should return true for added vertex", function() {
			expect(graph.isVertexExist(0)).toEqual(true);
		});

		it(" - should return false for not added vertex", function() {
			expect(graph.isVertexExist(1)).toEqual(false);
		});
	});

	describe("changeVertexWeight", function() {
		var graph = new Graph(true);
		graph.addVertex(0, 0);
		var newWeight = 8;
		graph.changeVertexWeight(0, newWeight);

		it(" - should set new weight for vertex", function() {
			expect(graph.vertexWeight[0]).toEqual(newWeight);
		});

		it(" - should change nothing for not existing vertex", function() {
			graph.changeVertexWeight(1, 9);
			expect(graph.vertexWeight.length).toEqual(1);
		});
	});

	describe("changeEdgeWeight", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addEdge(0, 1, 0);
		var newWeight = 8;
		graph.changeEdgeWeight(0, 1, newWeight);

		it(" - should change weight for edge", function() {
			var xEdges = graph.edges[0];
			var targetEdge = xEdges[0];
			expect(targetEdge.weight).toEqual(newWeight);
		});

		it(" - should change nothing for not existing edge", function() {
			graph.changeEdgeWeight(0, 2, 9);
			var xEdges = graph.edges[0];
			expect(xEdges.length).toEqual(1);
			expect(xEdges[0].weight).toEqual(newWeight);
		});
	});

	describe("getEdgeWeight", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		var edgeWeight = 7;
		graph.addEdge(0, 1, edgeWeight);

		it(" - should return weight for existing edge", function() {
			expect(graph.getEdgeWeight(0, 1)).toEqual(edgeWeight);
		});

		it(" - should return 'undefined' for not existing edge", function() {
			expect(graph.getEdgeWeight(0, 2)).toBeUndefined();
		});
	});

	describe("getVertexWeight", function() {
		var graph = new Graph(false);
		var vertexWeight = 3;
		graph.addVertex(0, vertexWeight);

		it(" - should return weight for existing vertex", function() {
			expect(graph.getVertexWeight(0)).toEqual(vertexWeight);
		});

		it(" - should return 'undefined' for not existing vertex", function() {
			expect(graph.getVertexWeight(3)).toBeUndefined();
		});
	});

	describe("getAdjacentVertexes", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(0, 2, 0);

		it(" - should return all vertexes to which exists edges from target vertex", function() {
			var expected = [1, 2];
			var result = graph.getAdjacentVertexes(0);
			expect(result).toEqual(jasmine.arrayContaining(expected));
		});
	});

	describe("isAdjacentVertexes", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(0, 2, 0);

		it(" - should return 'true' if between vertexes exists edge", function() {
			expect(graph.isAdjacentVertexes(0, 1)).toEqual(true);
		});

		it(" - should return 'false' if between vertexes does not exist edge", function() {
			expect(graph.isAdjacentVertexes(1, 2)).toEqual(false);
		});
	});

	describe("refreshVertexStates", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph._vertexStates[0] = VERTEX_STATE.DISCOVERED;
		graph._vertexColors[0] = VERTEX_COLOR.WHITE;
		graph.refreshVertexStates();

		it(" - should reset '_vertexStates' property", function() {
			expect(graph._vertexStates[0]).toEqual(VERTEX_STATE.UNDISCOVERED);
		});

		it(" - should reset '_vertexColors' property", function() {
			expect(graph._vertexColors[0]).toEqual(VERTEX_COLOR.UNCOLORED);
		});
	});

	describe("isConnected", function() {
		describe("for connected graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(0, 2, 0);

			it(" - should return true", function() {
				expect(graph.isConnected()).toEqual(true);
			});
		});

		describe("for not connected graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addVertex(3, 0);
			graph.addVertex(4, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(0, 2, 0);
			graph.addEdge(3, 4, 0);

			it(" - should return false", function() {
				expect(graph.isConnected()).toEqual(false);
			});
		});
	});

	describe("getNumberOfComponents", function() {
		describe("for connected graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(0, 2, 0);

			it(" - should return 1", function() {
				expect(graph.getNumberOfComponents()).toEqual(1);
			});
		});

		describe("for graph with two components", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addVertex(3, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(0, 2, 0);

			it(" - should return 2", function() {
				expect(graph.getNumberOfComponents()).toEqual(2);
			});
		});

		describe("for graph with three components", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addVertex(3, 0);
			graph.addVertex(4, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(0, 2, 0);

			it(" - should return 3", function() {
				expect(graph.getNumberOfComponents()).toEqual(3);
			});
		});
	});

	describe("getPath", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(1, 2, 0);

		it(" - should return path between target vertexes", function() {
			var expected = [0, 1, 2];
			expect(graph.getPath(0, 2)).toEqual(jasmine.arrayContaining(expected));
		});

		it(" - should return empty array if path between vertexes does not exist", function() {
			var path = graph.getPath(0, 3);
			expect(path.length).toEqual(0);
		});
	});

	describe("findCycle", function() {
		var graph = new Graph(true);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addVertex(4, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(1, 2, 0);
		graph.addEdge(2, 0, 0);
		graph.addEdge(3, 4, 0);

		it(" - should return path of cycle", function() {
			var result = graph.findCycle(0);
			var expected = [0, 1, 2];
			expect(result).toEqual(jasmine.arrayContaining(expected));
		});

		it(" - should return empty array if cycle does not exist", function() {
			var result = graph.findCycle(3);
			expect(result.length).toEqual(0);
		});

		it(" - should return empty array for not existing vertex", function() {
			var result = graph.findCycle(8);
			expect(result.length).toEqual(0);
		});
	});

	describe("isBipartile", function() {
		describe("for bipartile graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(1, 2, 0);

			it(" - should return true", function() {
				expect(graph.isBipartile(0)).toEqual(true);
			});
		});

		describe("for not bipartile graph", function() {
			var graph = new Graph(false);
			graph.addVertex(0, 0);
			graph.addVertex(1, 0);
			graph.addVertex(2, 0);
			graph.addEdge(0, 1, 0);
			graph.addEdge(1, 2, 0);
			graph.addEdge(0, 2, 0);

			it(" - should return false", function() {
				expect(graph.isBipartile(0)).toEqual(false);
			});
		});
	});

	describe("BFS", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addVertex(4, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(0, 2, 0);
		graph.addEdge(2, 3, 0);
		graph.addEdge(3, 0, 0);
		graph.addEdge(3, 4, 0);
		var callbacks = {
			discoveredCallback: function() {},
			processedCallback: function() {},
			terminateCallback: function() {},
			onMeetDiscovered: function() {}
		};

		describe("discoveredCallback", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "discoveredCallback");
				graph.BFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for starting vertex", function() {
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0);
			});

			it(" - should be called for each tree edge", function() {
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0, 1);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0, 2);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0, 3);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(3, 4);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.discoveredCallback).toHaveBeenCalledTimes(5);
			});
		});

		describe("processedCallback", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "processedCallback");
				graph.BFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for each vertex", function() {
				expect(callbacks.processedCallback).toHaveBeenCalledWith(0);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(1);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(2);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(3);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(4);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.processedCallback).toHaveBeenCalledTimes(5);
			});
		});

		describe("terminateCallback", function() {
			describe("if does not stop execution", function() {
				beforeEach(function() {
					graph.refreshVertexStates();
					spyOn(callbacks, "terminateCallback");
					graph.BFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
				});

				it(" - should be called for each edge", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(0, 1);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(0, 2);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(0, 3);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(2, 3);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(1, 0);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(2, 0);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(3, 0);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(3, 2);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(3, 4);
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(4, 3);
				});

				it(" - should be called proper number of times", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledTimes(10);
				});
			});

			describe("if stops execution on first vertex", function() {
				beforeEach(function() {
					graph.refreshVertexStates();
					spyOn(callbacks, "discoveredCallback");
					spyOn(callbacks, "processedCallback");
					spyOn(callbacks, "terminateCallback").and.returnValue(true);
					graph.BFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
				});

				it(" - should call 'discoveredCallback' only for first vertex", function() {
					expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0);
					expect(callbacks.discoveredCallback).toHaveBeenCalledTimes(1);
				});

				it(" - should call 'terminateCallback' only one time", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledTimes(1);
				});

				it(" - should not call 'processedCallback'", function() {
					expect(callbacks.processedCallback).not.toHaveBeenCalled();
				});
			});
		});

		describe("onMeetDiscovered", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "onMeetDiscovered");
				graph.BFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for each back and cross edge", function() {
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(1, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(2, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(3, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(3, 2);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(2, 3);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(4, 3);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledTimes(6);
			});
		});
	});

	describe("DFS", function() {
		var graph = new Graph(false);
		graph.addVertex(0, 0);
		graph.addVertex(1, 0);
		graph.addVertex(2, 0);
		graph.addVertex(3, 0);
		graph.addVertex(4, 0);
		graph.addEdge(0, 1, 0);
		graph.addEdge(0, 2, 0);
		graph.addEdge(2, 3, 0);
		graph.addEdge(3, 0, 0);
		graph.addEdge(3, 4, 0);
		var callbacks = {
			discoveredCallback: function() {},
			processedCallback: function() {},
			terminateCallback: function() {},
			onMeetDiscovered: function() {}
		};

		describe("discoveredCallback", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "discoveredCallback");
				graph.DFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for each vertex", function() {
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0, 0);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(1, 0);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(2, 0);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(3, 0);
				expect(callbacks.discoveredCallback).toHaveBeenCalledWith(4, 0);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.discoveredCallback).toHaveBeenCalledTimes(5);
			});
		});

		describe("processedCallback", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "processedCallback");
				graph.DFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for each vertex", function() {
				expect(callbacks.processedCallback).toHaveBeenCalledWith(0, 0);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(1, 0);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(2, 0);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(3, 0);
				expect(callbacks.processedCallback).toHaveBeenCalledWith(4, 0);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.processedCallback).toHaveBeenCalledTimes(5);
			});
		});

		describe("terminateCallback", function() {
			describe("if does not stop execution", function() {
				beforeEach(function() {
					graph.refreshVertexStates();
					spyOn(callbacks, "terminateCallback");
					graph.DFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
				});

				it(" - should be called for each vertex", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(0, 0, jasmine.any(Array));
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(1, 0, jasmine.any(Array));
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(2, 0, jasmine.any(Array));
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(3, 0, jasmine.any(Array));
					expect(callbacks.terminateCallback).toHaveBeenCalledWith(4, 0, jasmine.any(Array));
				});

				it(" - should be called proper number of times", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledTimes(5);
				});
			});

			describe("if stops execution on first vertex", function() {
				beforeEach(function() {
					graph.refreshVertexStates();
					spyOn(callbacks, "discoveredCallback");
					spyOn(callbacks, "processedCallback");
					spyOn(callbacks, "terminateCallback").and.returnValue(true);
					graph.DFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
				});

				it(" - should call 'discoveredCallback' only for first vertex", function() {
					expect(callbacks.discoveredCallback).toHaveBeenCalledWith(0, 0);
					expect(callbacks.discoveredCallback).toHaveBeenCalledTimes(1);
				});

				it(" - should call 'terminateCallback' only one time", function() {
					expect(callbacks.terminateCallback).toHaveBeenCalledTimes(1);
				});

				it(" - should not call 'processedCallback'", function() {
					expect(callbacks.processedCallback).not.toHaveBeenCalled();
				});
			});
		});

		describe("onMeetDiscovered", function() {
			beforeEach(function() {
				graph.refreshVertexStates();
				spyOn(callbacks, "onMeetDiscovered");
				graph.DFS(0, callbacks.discoveredCallback, callbacks.processedCallback, callbacks.terminateCallback, callbacks.onMeetDiscovered);
			});

			it(" - should be called for each back or cross edge", function() {
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(1, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(2, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(3, 0);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(0, 3);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(3, 2);
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledWith(4, 3);
			});

			it(" - should be called proper number of times", function() {
				expect(callbacks.onMeetDiscovered).toHaveBeenCalledTimes(6);
			});
		});
	});
});
