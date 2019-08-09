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
	objectData
}) => {
	let dataList;
	
	switch (activeTool) {
		case 'terrain':
			dataList = terrainList || {};
			break;
		case 'enemy':
			dataList = enemyData || {};
			dataList = Object.keys(dataList).reduce((obj, key) => {
				return {
					...obj,
					[key]: key
				}
			}, {});
			break;
		case 'object':
			dataList = objectData || {};
			dataList = Object.keys(dataList).reduce((obj, key) => {
				return {
					...obj,
					[key]: key
				}
			}, {});
			break;
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
