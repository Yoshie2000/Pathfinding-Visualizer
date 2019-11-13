import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
	render() {
		const {
			col,
			isFinish,
			isStart,
			isWall,
			onMouseDown,
			onMouseEnter,
			onMouseUp,
			row,
		} = this.props;

		let extraClassName = '';
		extraClassName += isFinish ? ' node-finish' : '';
		extraClassName += isStart ? ' node-start' : '';
		extraClassName += isWall ? ' node-wall' : '';

		return (
			<div
				id={`node-${row}-${col}`}
				className={`node${extraClassName}`}
				onMouseDown={(e) => { onMouseDown(row, col, isWall); e.preventDefault(); e.stopPropagation(); }}
				onMouseEnter={(e) => {
					onMouseEnter(row, col); e.preventDefault(); e.stopPropagation();
				}}
				onMouseUp={(e) => { onMouseUp(); e.preventDefault(); e.stopPropagation(); }}></div>
		);
	}
}