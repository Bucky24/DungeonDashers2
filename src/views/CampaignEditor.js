import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useLoaded from '../hooks/useLoaded';
import CampaignContext from '../contexts/CampaignContext';
import TextField from '../components/TextField';
import Coms from '../utils/coms';

export default function CampaignEditor() {
    const { campaign } = useParams();
    const { campaignLoaded } = useLoaded();
    const {
        loadCampaign,
        campaignData,
        updateActiveCampaign,
        saveCampaign,
    } = useContext(CampaignContext);
    const [mapNames, setMapNames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        Coms.send("getMapNames").then((data) => {
            setMapNames(data.maps);
        });
    }, []);

    useEffect(() => {
        loadCampaign(campaign);
    }, [campaign]);

    if (!campaignLoaded) {
        return <div>Loading...</div>;
    }

    return <div style={{ marginLeft: 10 }}>
        <button onClick={() => navigate("/editor")}>Back</button>
        <h2>Campaign {campaign}</h2>
        <h3>General</h3>
        <table border={1}>
            <tbody>
                <tr>
                    <td>Width</td>
                    <td>
                        <TextField value={campaignData?.width || '0'} onBlur={(value) => {
                            const intValue = parseInt(value);
                            updateActiveCampaign('width', intValue);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td>
                        <TextField value={campaignData?.height || '0'} onBlur={(value) => {
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
        <h3>Maps</h3>
        <table border={1}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {campaignData.maps.map((mapData, index) => {
                    const { map, x, y } = mapData;

                    return <tr key={`map_${index}`}>
                        <td>
                            <select value={map} onChange={(event) => {
                                const maps = [...campaignData.maps];
                                maps[index].map = event.target.value;
                                updateActiveCampaign('maps', maps);
                            }}>
                                <option value=''>None</option>
                                {mapNames.map((mapName) => {
                                    return <option key={mapName} value={mapName}>{mapName}</option>
                                })}
                            </select>
                        </td>
                        <td>
                            <TextField value={x} onBlur={(newValue) => {
                                const maps = [...campaignData.maps];
                                maps[index].x = parseInt(newValue);
                                updateActiveCampaign('maps', maps);
                            }} />
                        </td>
                        <td>
                            <TextField value={y} onBlur={(newValue) => {
                                const maps = [...campaignData.maps];
                                maps[index].y = parseInt(newValue);
                                updateActiveCampaign('maps', maps);
                            }} />
                        </td>
                        <td>
                            <button onClick={() => {
                                if (confirm("Are you sure?")) {
                                    const maps = [...campaignData.maps];
                                    maps.splice(index, 1);
                                    updateActiveCampaign('maps', maps);
                                }
                            }}>Remove</button>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
        <button onClick={() => {
            const maps = [...campaignData.maps];
            maps.push({
                map: '',
                x: 0,
                y: 0,
            });
            updateActiveCampaign('maps', maps);
        }}>Add Map</button>
        <br/><br/>
        <button onClick={saveCampaign}>Save</button>
    </div>
}