import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScenarioEditor from '../ScenarioEditor';
import CampaignEditor from '../CampaignEditor';

import MainMenu from '../MainMenu/MainMenu';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			tool: null,
		}
	}

	render() {
		const { width, height } = this.props;

		return <div className="App">
			{ !this.state.tool && <MainMenu
				width={width}
				height={height}
				setTool={(tool) => {
					this.setState({
						tool,
					});
				}}
			/> }
			{ this.state.tool === "scenario" && <ScenarioEditor 
				width={width}
				height={height}
				setTool={(tool) => {
					this.setState({
						tool,
					});
				}}
			/>}
			{ this.state.tool === "campaign" && <CampaignEditor
				width={width}
				height={height}
				setTool={(tool) => {
					this.setState({
						tool,
					});
				}}
			/>}
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
