import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { saveFile, Types, loadFile } from 'system';

import { getFile, getMap } from '../store/getters/game';
import { setFile, setMap } from '../store/ducks/game';

const propTypes = {
	fileName: PropTypes.string.isRequired,
	setFile: PropTypes.func.isRequired
};

class MainTab extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const { fileName, setFile } = this.props;

		return <div>
			<div>
				<input type='text' value={fileName} onClick={(evt) => {
				}} onChange={(event) => {
					setFile(event.target.value);
				}}/>
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
					   	saveFile(Types.MAP_CUSTOM, fullName, mapData).then((data) => {
					   		alert(`File saved to ${data}`);
					   	});
					}}
				/>
				<input
					type="button"
					value="Load"
					onClick={() => {
						const file = this.props.fileName
						if (!file || file === '') {
							alert('Unable to load file, no filename given');
							return;
						}
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
