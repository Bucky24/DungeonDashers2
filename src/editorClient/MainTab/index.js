import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { saveFile, Types, loadFile, getFileList } from 'system';

import { getFile, getMap } from '../store/getters/game';
import { setFile, setMap } from '../store/ducks/game';

const propTypes = {
	fileName: PropTypes.string.isRequired,
	setFile: PropTypes.func.isRequired
};

class MainTab extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			maps: [],
		};
	}
	
	componentDidMount() {
		getFileList(Types.MAP_CUSTOM).then((maps) => {
			this.setState({
				maps,
			});
		});
	}
	
	render() {
		const { fileName, setFile } = this.props;

		return <div>
			<div>
				{ fileName && <>
					<div>Current map: {fileName}</div>
					<div>
						<input
							type='button'
							value="Save"
							onClick={() => {
								const file = fileName
								if (!file || file === '') {
									alert('Unable to save file, no filename given');
							   	 	return;
							   	}
							   	const fullName = `${file}.map`;
							   	const mapData = this.props.map;
								const existingTriggers = mapData.triggers || [];
								mapData.triggers = [
									...existingTriggers,
									{
										id: existingTriggers.length+1,
										"conditions": [
											{
												"type": "variableCheck",
												"data": {
													"variable": "totalCharactersAlive",
													"operator": "==",
													"comparisonVariable": "charactersOnPortal"
												}
											}
										],
										"effects": [
											{
												"type": "winGame",
												"data": {}
											}
										]
									}
								]
							   	saveFile(Types.MAP_CUSTOM, fullName, mapData).then((data) => {
							   		alert(`File saved to ${data}`);
							   	});
							}}
						/>
					</div>
				</>}
				{ !fileName && <>
					<div>No map loaded</div>
					<input type='text' onChange={(e) => {
						this.setState({
							selectedMap: e.target.value,
						});
					}}/>
					<input type='button' value='New Map' onClick={() => {
						setFile(this.state.selectedMap);
					}}/>
				</>}
				<div>
					<select 
						onChange={(e) => {
							this.setState({
								selectedMap: e.target.value,
							});
						}}
						defaultValue={fileName}
					>
						<option value=''>None</option>
						{ this.state.maps.map((map) => {
							return <option 
								key={map}
								value={map}
							>{map}</option>
						})}
					</select>
					<input
						type="button"
						value="Load"
						onClick={() => {
							const file = this.state.selectedMap;
							if (!file || file == '') {
								setFile(null);
								return;
							}
							setFile(file);
							loadFile(Types.MAP_CUSTOM, file).then((data) => {
								this.props.setMap({
									tiles: data.tiles || [],
									enemies: data.enemies || [],
									objects: data.objects || [],
									characters: data.characters || [],
									width: data.width,
									height: data.height
								});
								alert('Map Loaded');
							}).catch((error) => {
								alert(error);
							})
						}}
					/>
				</div>
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		fileName: getFile(state),
		map: getMap(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setFile: (file) => {
			dispatch(setFile(file));
		},
		setMap: (map) => {
			dispatch(setMap(map));
		}
	};
};

MainTab.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(MainTab);
