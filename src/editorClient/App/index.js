import React, { Component } from 'react';
import { connect } from 'react-redux';
import MobileDetect from 'mobile-detect';

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
			{ !this.state.tool && <MobileDetect>
				<MainMenu
					width={width}
					height={height}
					setTool={(tool) => {
						this.setState({
							tool,
						});
					}}
				/>
			</MobileDetect> }
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
