import React from 'react';
import classnames from 'classnames';

import styles from './styles.css';

const BottomBar = ({
	activeTool,
	enemyData,
	terrainList,
	activeID,
	setActiveID,
	objectData,
	characterData,
	height,
}) => {
	let dataList = {};
	
	switch (activeTool) {
		case 'terrain':
			dataList = terrainList || {};
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
	
	return <div
		className={styles.bottomOuter}
		style={{
			height,
		}}
	>
		Active Tool: { activeTool}<br />
		<div className={styles.itemHolderOuter}>
			<div className={styles.itemHolderInner}>
				{ dataList && Object.keys(dataList).map((key) => {
					const data = dataList[key];
					const { imageData } = data;
					const { image } = imageData;

					const clsName = classnames({
						[styles.itemImage]: true,
						[styles.selected]: activeID === key,
					});

					return <img
						key={key}
						className={clsName}
						src={image}
						onClick={() => {
							setActiveID(key);
						}}
					/>;
				})}
			</div>
		</div>
	</div>;
};

export default BottomBar;
