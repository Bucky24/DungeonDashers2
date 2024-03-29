import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLoaded from '../hooks/useLoaded';
import CampaignContext from '../contexts/CampaignContext';
import TextField from '../components/TextField';

export default function CampaignEditor() {
    const { campaign } = useParams();
    const { campaignLoaded } = useLoaded();
    const {
        loadCampaign,
        campaignData,
        updateActiveCampaign,
        saveCampaign,
    } = useContext(CampaignContext);

    useEffect(() => {
        loadCampaign(campaign);
    }, [campaign]);

    if (!campaignLoaded) {
        return <div>Loading...</div>;
    }

    return <div style={{ marginLeft: 10 }}>
        <h2>Campaign {campaign}</h2>
        <h3>General</h3>
        <table border={1}>
            <tbody>
                <tr>
                    <td>Width</td>
                    <td>
                        <TextField value={campaignData.width || '0'} onBlur={(value) => {
                            const intValue = parseInt(value);
                            updateActiveCampaign('width', intValue);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td>
                        <TextField value={campaignData.height || '0'} onBlur={(value) => {
                            const intValue = parseInt(value);
                            updateActiveCampaign('height', intValue);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>Background Image</td>
                    <td>
                        <TextField value={campaignData.background?.originalImage || ''} onBlur={(value) => {
                            updateActiveCampaign('background', {
                                ...campaignData.background || {},
                                originalImage: value,
                            });
                        }} />
                    </td>
                </tr>
            </tbody>
        </table>

        <button onClick={saveCampaign}>Save</button>
    </div>
}