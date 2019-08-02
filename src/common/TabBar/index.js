import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.css';

const propTypes = {
	tabs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		elem: PropTypes.element.isRequired
	})),
	selectedTab: PropTypes.string.isRequired
};

class TabBar extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			activeTab: props.selectedTab
		};
	}
	
	render() {
		const { tabs } = this.props;
		
		const activeTab = tabs.find((tab) => {
			return tab.id === this.state.activeTab;
		});
		const activeElement = activeTab ? activeTab.elem : null;

		return <div>
			<div className={styles.tabInner}>
				{ tabs.map(({ name, id }) => {
					const tabClasses = classNames({
						[styles.tab]: true,
						[styles.selected]: activeTab && activeTab.id === id
					});
					return <div
						className={tabClasses}
						key={id}
						onClick={() => {
							this.setState({
								activeTab: id
							});
						}}
					>
						{ name }
					</div>;
				})}
			</div>
			<div>
				{ activeElement }
			</div>
		</div>;
	}
};

TabBar.propTypes = propTypes;

export default TabBar;
