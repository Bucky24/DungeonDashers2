import React from 'react';
import { connect } from 'react-redux';
import { getFileList, Types, loadFile, saveFile } from 'system';

import styles from './styles.css';

class Campaign extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			campaigns: [],
			setCampaign: null,
			maps: []
		};
	}

	render() {
		const mapsNotInCampaign = [
			...this.state.maps
		];
		if (this.state.campaign) {
			this.state.campaign.maps.forEach((map) => {
				const index = mapsNotInCampaign.indexOf(map);
				if (index >= 0) {
					mapsNotInCampaign.splice(index, 1);
				}
			});
		}
		
		return <div>
			Campaign list:<br/>
			<select
				value={this.state.setCampaign}
				onChange={(evt) => {
					let campaignName = evt.target.value;
					if (campaignName === '') {
						campaignName = null;
						this.setState({
							setCampaign: campaignName
						});
					}
					if (campaignName) {
						loadFile(Types.CAMPAIGN_CUSTOM, campaignName).then((campaign) => {
							this.setState({
								setCampaign: campaignName,
								campaign
							});
						});
					}
				}}
			>
				<option value=''>None</option>
				{ this.state.campaigns.map((campaign) => {
					return <option value={campaign} key={campaign}>{campaign}</option>
				}) }
			</select>
			{ !this.state.setCampaign && <div>
				<input type='text' ref={(c) => { this.campaignName = c; }} />
				<input type='button' value='New Campaign' onClick={() => {
					const name = this.campaignName.value;
					if (name === '') return;
					this.setState({
						setCampaign: name,
						campaign: {
							maps: []
						}
					});
				}}/>
			</div> }
			{ this.state.setCampaign && <div>
				<div>Campaign: { this.state.setCampaign }</div>
				<div>
					<textarea
						onChange={(evt) => {
							this.setState({
								campaign: {
									...this.state.campaign,
									description: evt.target.value
								}
							});
						}}
					>
						{ this.state.campaign.description }
					</textarea>
				</div>
				<table border="0">
					<tbody>
						<tr>
							<td>
								<div>In campaign</div>
								<select
									className={styles.mapSelect}
									multiple="multiple"
									ref={(c) => {
										this.campaignMapSelect = c;
									}}
								>
									{ this.state.campaign.maps.map((map) => {
										return <option value={map} key={map}>{map}</option>;
									}) }
								</select>
							</td>
							<td>
								<input
									type='button'
									value='<'
									onClick={() => {
										const options = this.notCampaignMapSelect.options;
										const selectedMaps = [];
										for (let i=0;i<options.length;i++) {
											if (options[i].selected) {
												selectedMaps.push(options[i].value);
											}
										}
										
										this.setState({
											campaign: {
												...this.state.campaign,
												maps: [
													...this.state.campaign.maps || [],
													...selectedMaps
												]
											}
										});
									}}
								/><br/>
								<input
									type='button'
									value='>'
									onClick={() => {
										const options = this.campaignMapSelect.options;
										const selectedMaps = [];
										for (let i=0;i<options.length;i++) {
											if (options[i].selected) {
												selectedMaps.push(options[i].value);
											}
										}
										const newMaps = [
											...this.state.campaign.maps || []
										];
										selectedMaps.forEach((map) => {
											const index = newMaps.indexOf(map);
											newMaps.splice(index, 1);
										});
										this.setState({
											campaign: {
												...this.state.campaign,
												maps: newMaps
											}
										});
									}}
								/>
							</td>
							<td>
								<div>Not in campaign</div>
								<select
									className={styles.mapSelect}
									multiple="multiple"
									ref={(c) => {
										this.notCampaignMapSelect = c;
									}}
								>
									{ mapsNotInCampaign.map((map) => {
										return <option value={map} key={map}>{map}</option>;
									}) }
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<input type='button' value='Save' onClick={() => {
					saveFile(Types.CAMPAIGN_CUSTOM, `${this.state.setCampaign}.camp`, this.state.campaign)
					.then(() => {
						alert(`Saved campaign ${this.state.setCampaign}`);
						// refresh campaigns in case we just created a new one
						getFileList(Types.CAMPAIGN_CUSTOM).then((campaigns) => {
							this.setState({
								campaigns
							});
						});
					})
				}} />
			</div> }
		</div>;
	}
	
	componentDidMount() {
		getFileList(Types.CAMPAIGN_CUSTOM).then((campaigns) => {
			this.setState({
				campaigns
			});
		});
		getFileList(Types.MAP).then((maps) => {
			this.setState({
				maps: [
					...this.state.maps || [],
					...maps
				]
			});
		});
		getFileList(Types.MAP_CUSTOM).then((maps) => {
			this.setState({
				maps: [
					...this.state.maps || [],
					...maps
				]
			});
		});
	}
};

const mapStateToProps = (state) => {
	return {

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);