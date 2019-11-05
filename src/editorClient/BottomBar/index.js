import React, { Component } from 'react';
import { Container, Text, Shape } from '@bucky24/react-canvas';
import Button from '../../common/Button';

import styles from './styles.css';

const BottomBar = ({
	activeTool,
	enemyData,
	terrainList,
	activeID,
	setActiveID,
	objectData,
	characterData
}) => {
	let dataList = {};
	
	let needsReduction = true;
	
	switch (activeTool) {
		case 'terrain':
			dataList = terrainList || {};
			needsReduction = false;
			break;
		case 'enemy':
			dataList = enemyData || {};
			break;
		case 'object':
			dataList = objectData || {};
			break;
		case 'character':
			dataList = characterData || {};
			break;
	}
	
	if (needsReduction) {
		dataList = Object.keys(dataList).reduce((obj, key) => {
			return {
				...obj,
				[key]: key
			}
		}, {});
	}
	
	return <div className={styles.bottomOuter}>
		Active Tool: { activeTool}<br />
		{ dataList && <div>
			Placing: <select
				value={activeID || ''}
				onChange={(evt) => {
					let value = evt.target.value;
					if (value === '') {
						value = null;
					}
					setActiveID(value);
				}}
			>
				<option value=''>None</option>
				{ Object.keys(dataList).map((key) => {
					const name = dataList[key];
			
					return <option value={key} key={key}>
						{ name }
					</option>;
				}) }
			</select>
		</div> }
	</div>;
};

export default BottomBar;
