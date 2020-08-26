import React from 'react';

import Campaign from './Campaign';

class CampaignEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <a href="#" onClick={() => {
                this.props.setTool(null);
            }}>Go Back</a>
            <Campaign />
        </div>;
    }
}

export default CampaignEditor;
