import React from 'react';
import { Container, Text, Shape } from '@bucky24/react-canvas';
import Button from '../../common/Button';

const ToolBar = ({
	activeTool,
	width,
	height,
	tools,
	setActiveTool
}) => {
	return <div>
		{ tools.map(({ id, name }) => {
			return <input
				type="button"
				key={id}
				value={name}
				onClick={() => {
					setActiveTool(id);
				}}
			/>
		})}
	</div>;
};

export default ToolBar;
