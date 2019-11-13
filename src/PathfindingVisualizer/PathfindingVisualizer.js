import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from './../algorithms/dijkstra';
import { astar } from './../algorithms/astar';
import { recursiveDivision } from './../algorithms/recursivedivision';
import { recursiveBacktracking } from './../algorithms/recursivebacktracking';
import { breadthfirstsearch } from '../algorithms/breadthfirstsearch';
import './PathfindingVisualizer.css';
import { depthfirstsearch } from '../algorithms/depthfirstsearch';
import { simpleWall } from '../algorithms/simplewall';
import { greedy } from '../algorithms/greedy';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
let gridWidth, gridHeight;

export default class PathfindingVisualizer extends Component {
	constructor() {
		super();
		this.state = {
			grid: [],
			algorithm: "A*"
		};
		this.tempGrid = [];
		this.mouseIsPressed = false;
		this.toggleMode = true;
		this.dragData = {
			walls: true,
			mousePressed: false,
			tempGrid: [],
			startNode: null
		}
		this.lastSortType = null;
	}

	componentDidMount() {
		this.resetGrid();
	}

	generateMaze(algorithm) {

		this.resetGrid(() => {
			let result;
			let newGrid = this.state.grid;

			switch (algorithm) {
				case "Simple Wall":
					result = simpleWall(newGrid, gridWidth, gridHeight);
					break;
				case "Recursive Division":
					result = recursiveDivision(newGrid, gridWidth, gridHeight, newGrid[START_NODE_ROW][START_NODE_COL], newGrid[FINISH_NODE_ROW][FINISH_NODE_COL]);
					break;
				case "Recursive Backtracking":
					result = recursiveBacktracking(newGrid, gridWidth, gridHeight);
					break;
				default:
					alert("No maze generation algorithm selected");
					break;
			}

			let { wallsInOrder, wallsToRemove } = result;

			if (wallsToRemove) {
				for (let i = 0; i < wallsInOrder.length; i++) {
					setTimeout(() => {
						let node = wallsInOrder[i];
						node.isWall = node.isStart || node.isFinish ? false : true;
						this.updateNodeClassNames(node);
					}, i * 2.5);
					newGrid[wallsInOrder[i].row][wallsInOrder[i].col] = wallsInOrder[i];
				}
				setTimeout(() => {
					for (let i = 0; i < wallsToRemove.length; i++) {
						setTimeout(() => {
							let node = wallsToRemove[i];
							node.isWall = false;
							this.updateNodeClassNames(node);
						}, i * 25);
						newGrid[wallsToRemove[i].row][wallsToRemove[i].col] = wallsToRemove[i];
					}
				}, wallsInOrder.length * 2.5);
			} else {
				for (let i = 0; i < wallsInOrder.length; i++) {
					setTimeout(() => {
						let node = wallsInOrder[i];
						node.isWall = node.isStart || node.isFinish ? false : true;
						this.updateNodeClassNames(node);
					}, i * 10);
					newGrid[wallsInOrder[i].row][wallsInOrder[i].col] = wallsInOrder[i];
				}
			}

			this.setState({ grid: newGrid });
		});
	}

	resetGridData(callback) {
		let grid = this.state.grid;
		for (let row of grid) {
			for (let node of row) {
				node.distance = Infinity;
				node.previousNode = null;
				node.isVisited = false;
				node.isMazeVisited = false;
				node.isMazeVisitedVisited = false;

				if (document.getElementById(`node-${node.row}-${node.col}`)) {
					document.getElementById(`node-${node.row}-${node.col}`).className =
						'node ' + this.getNodeClassNames(node);
				}
			}
		}
		this.setState({ grid: grid }, () => {
			if (callback)
				callback();
		});
	}

	resetGrid(callback) {
		let newGrid = this.getInitialGrid();
		this.setState({ grid: newGrid }, () => {
			this.resetGridData(() => {
				if (callback)
					callback();
			});
		});
	}

	handleMouseDown(row, col, isWall) {
		this.dragData.walls = !isWall;
		const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
		this.dragData = {
			walls: !isWall,
			mousePressed: true,
			tempGrid: newGrid,
			lastNode: this.state.grid[row][col]
		};
	}

	handleMouseEnter(row, col) {
		if (!this.dragData.mousePressed) {
			return;
		} else if (this.dragData.lastNode.isStart) {
			this.updateStartAndFinishPositions(row, col, FINISH_NODE_ROW, FINISH_NODE_COL);
			if (this.lastSortType)
				this.visualizeSorting(true);
		}
		else if (this.dragData.lastNode.isFinish) {
			this.updateStartAndFinishPositions(START_NODE_ROW, START_NODE_COL, row, col);
			if (this.lastSortType)
				this.visualizeSorting(true);
		} else {
			const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
			this.dragData.tempGrid = newGrid;
		}
		this.dragData.lastNode = this.dragData.tempGrid[row][col];
	}

	handleMouseUp() {
		if (this.dragData.lastNode.isStart || this.dragData.lastNode.isFinish) {
			if (this.lastSortType)
				this.visualizeSorting(true);
		}

		this.dragData.mousePressed = false;
		this.setState({ grid: this.dragData.tempGrid });
	}

	setAlgorithm(algorithm) {
		this.setState({ algorithm: algorithm });
	}

	visualizeSorting(instant) {
		this.resetGridData();

		const { grid } = this.state;
		this.lastSortType = this.state.algorithm;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

		let visitedNodesInOrder = [];
		switch (this.state.algorithm) {
			case "A*":
				visitedNodesInOrder = astar(grid, startNode, finishNode);
				break;
			case "Breadth First Search":
				visitedNodesInOrder = breadthfirstsearch(grid, startNode, finishNode);
				break;
			case "Depth First Search":
				visitedNodesInOrder = depthfirstsearch(grid, startNode, finishNode);
				break;
			case "Dijkstra's":
				visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
				break;
			case "Greedy's":
				visitedNodesInOrder = greedy(grid, startNode, finishNode);
				break;
			default:
				alert("No sorting algorithm selected");
				break;
		}

		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateSorting(visitedNodesInOrder, nodesInShortestPathOrder, instant);
	}

	animateSorting(visitedNodesInOrder, nodesInShortestPathOrder, instant) {
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (instant) {
				if (i === visitedNodesInOrder.length) {
					this.animateShortestPath(nodesInShortestPathOrder, instant);
					return;
				}
				const node = visitedNodesInOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className = this.getNodeClassNames(node) + (instant ? " node-instant-animation" : "");
			} else {
				if (i === visitedNodesInOrder.length) {
					setTimeout(() => {
						this.animateShortestPath(nodesInShortestPathOrder, instant);
					}, 5 * i);
					return;
				}
				setTimeout(() => {
					const node = visitedNodesInOrder[i];
					document.getElementById(`node-${node.row}-${node.col}`).className = this.getNodeClassNames(node) + (instant ? " node-instant-animation" : "");
				}, 5 * i);
			}
		}
	}

	animateShortestPath(nodesInShortestPathOrder, instant) {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			if (instant) {
				const node = nodesInShortestPathOrder[i];

				document.getElementById(`node-${node.row}-${node.col}`).className =
					'node-shortest-path ' + this.getNodeClassNames(node).replace(/node-visited/, "") + (instant ? " node-instant-animation" : "");
			} else {
				setTimeout(() => {
					const node = nodesInShortestPathOrder[i];

					document.getElementById(`node-${node.row}-${node.col}`).className =
						'node-shortest-path ' + this.getNodeClassNames(node).replace(/node-visited/, "") + (instant ? " node-instant-animation" : "");
				}, instant ? 0 : 25 * i);
			}
		}
	}

	generateNavbar() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<a className="navbar-brand" href="/">Pathfinding Visualizer</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">

						<li className="nav-item dropdown">
							<span className="nav-link dropdown-toggle" id="algorithmDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select Algorithm</span>
							<div className="dropdown-menu" aria-labelledby="algorithmDropdown">
								<span className="dropdown-item" onClick={() => this.setAlgorithm("A*")}>A*</span>
								<span className="dropdown-item" onClick={() => this.setAlgorithm("Breadth First Search")}>Breadth First Search</span>
								<span className="dropdown-item" onClick={() => this.setAlgorithm("Depth First Search")}>Depth First Search</span>
								<span className="dropdown-item" onClick={() => this.setAlgorithm("Dijkstra's")}>Dijkstra's</span>
								<span className="dropdown-item" onClick={() => this.setAlgorithm("Greedy's")}>Greedy's</span>
							</div>
						</li>

						<li className="nav-item">
							<span className="nav-link" onClick={() => this.visualizeSorting()}>Visualize {this.state.algorithm}</span>
						</li>

						<li className="nav-item dropdown">
							<span className="nav-link dropdown-toggle" id="mazeDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Generate Maze</span>
							<div className="dropdown-menu" aria-labelledby="mazeDropdown">
								<span className="dropdown-item" onClick={() => this.generateMaze("Simple Wall")}>Simple Wall</span>
								<span className="dropdown-item" onClick={() => this.generateMaze("Recursive Backtracking")}>Recursive Backtracking</span>
								<span className="dropdown-item" onClick={() => this.generateMaze("Recursive Division")}>Recursive Division</span>
							</div>
						</li>

						<li className="nav-item">
							<span className="nav-link" onClick={() => this.resetGridData()}>Reset Path</span>
						</li>

						<li className="nav-item">
							<span className="nav-link" onClick={() => this.resetGrid()}>Reset Grid</span>
						</li>

					</ul>
				</div>
			</nav>
		);
	}

	render() {
		const { grid, mouseIsPressed } = this.state;

		return (
			<div className="pathfinding-container">

				{
					this.generateNavbar()
				}

				<div className="grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx} className="row">
								{row.map((node, nodeIdx) => {
									const { row, col, isFinish, isStart, isWall } = node;
									return (
										<Node
											key={nodeIdx}
											col={col}
											isFinish={isFinish}
											isStart={isStart}
											isWall={isWall}
											mouseIsPressed={mouseIsPressed}
											onMouseDown={(row, col, wall) => this.handleMouseDown(row, col, wall)}
											onMouseEnter={(row, col) =>
												this.handleMouseEnter(row, col)
											}
											onMouseUp={() => this.handleMouseUp()}
											row={row}></Node>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		);
	}


	getInitialGrid() {
		const grid = [];
		gridWidth = Math.floor(window.innerWidth / 25);
		gridHeight = Math.floor((window.innerHeight - 100) / 25);

		START_NODE_COL = gridWidth >= 30 ? 10 : 1;
		START_NODE_ROW = Math.floor(gridHeight / 2);
		FINISH_NODE_COL = gridWidth >= 30 ? gridWidth - 10 : gridWidth - 1;
		FINISH_NODE_ROW = Math.floor(gridHeight / 2);

		if (START_NODE_COL % 2 === 0) START_NODE_COL++;
		if (START_NODE_ROW % 2 === 0) START_NODE_ROW++;
		if (FINISH_NODE_COL % 2 === 0) FINISH_NODE_COL++;
		if (FINISH_NODE_ROW % 2 === 0) FINISH_NODE_ROW++;

		for (let row = 0; row < gridHeight; row++) {
			const currentRow = [];
			for (let col = 0; col < gridWidth; col++) {
				let node = this.createNode(col, row);
				currentRow.push(node);
			}
			grid.push(currentRow);
		}
		return grid;
	};

	createNode(col, row) {
		let n = {
			distance: Infinity,
			col: col,
			row: row,
			isStart: row === START_NODE_ROW && col === START_NODE_COL,
			isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
			isMazeVisited: false,
			isMazeVisitedVisited: false,
			isVisited: false,
			isWall: false,
			previousNode: null
		};
		return n;
	};

	getNewGridWithWallToggled(grid, row, col) {
		const newGrid = grid.slice();
		const node = newGrid[row][col];

		const isWall = node.isStart || node.isFinish ? false : this.dragData.walls;
		const newNode = {
			...node,
			isWall: isWall,
		};
		newGrid[row][col] = newNode;

		this.updateNodeClassNames(newNode);

		return newGrid;
	};

	updateStartAndFinishPositions(newStartNodeRow, newStartNodeCol, newFinishNodeRow, newFinishNodeCol) {
		START_NODE_COL = newStartNodeCol;
		START_NODE_ROW = newStartNodeRow;
		FINISH_NODE_COL = newFinishNodeCol;
		FINISH_NODE_ROW = newFinishNodeRow;

		let newGrid = this.state.grid;
		for (let row of newGrid) {
			for (let node of row) {
				node.isStart = false;
				node.isFinish = false;
				this.updateNodeClassNames(node, " node-instant-animation");
			}
		}
		newGrid[newStartNodeRow][newStartNodeCol].isStart = true;
		this.updateNodeClassNames(newGrid[newStartNodeRow][newStartNodeCol]);
		newGrid[newFinishNodeRow][newFinishNodeCol].isFinish = true;
		this.updateNodeClassNames(newGrid[newFinishNodeRow][newFinishNodeCol]);
	};

	getNodeClassNames(node) {
		let extraClassName = "node";
		extraClassName += node.isStart ? " node-start" : "";
		extraClassName += node.isFinish ? " node-finish" : "";
		extraClassName += node.isWall && !node.isStart && !node.isFinish ? " node-wall" : "";
		extraClassName += node.isVisited ? " node-visited" : "";
		return extraClassName;
	}

	updateNodeClassNames(node, extraClassName) {
		document.getElementById(`node-${node.row}-${node.col}`).className = this.getNodeClassNames(node) + (extraClassName ? extraClassName : "");
	}

}