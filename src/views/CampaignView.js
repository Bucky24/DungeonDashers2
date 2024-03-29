import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import CampaignContext from '../contexts/CampaignContext';
import useLoaded from '../hooks/useLoaded';
import ImageContext from '../contexts/ImageContext';

export default function CampaignView() {
    const { campaign } = useParams();
    const { loadCampaign, campaignData } = useContext(CampaignContext);
    const { campaignLoaded } = useLoaded();
    const { getImage } = useContext(ImageContext);
    const [size, setSize] = useState({ width: 1, height: 1 });
    const [activeMap, setActiveMap] = useState(0);
    const enterHandlerRef = useRef(() => {});
    const navigate = useNavigate();

    enterHandlerRef.current = () => {
        const map = campaignData.maps[activeMap].map;

        navigate(`/game/new/${campaign}/${map}`);
    }

    useEffect(() => {
        const listener = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        const keyListener = (e) => {
            const { code } = e;

            if (code === "Enter") {
                enterHandlerRef.current();
            }
        }

        window.addEventListener("resize", listener);
        window.addEventListener("keyup", keyListener);
        listener();

        return () => {
            window.removeEventListener("resize", listener);
            window.removeEventListener("keyup", keyListener);
        };
    }, []);

    useEffect(() => {
        loadCampaign(campaign);
    }, [campaign]);

    if (!campaignLoaded) {
        return <div>Loading</div>;
    }

    if (!campaignData) {
        return <div>Can't find campaign data</div>;
    }

    const widthRatio = size.width / campaignData.width;
    const heightRatio = size.height / campaignData.height;

    return <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <img style={{ width: '100%', height: '100%' }} src={getImage(campaignData.background.image)} />
        {campaignData.maps.map((mapData, index) => {
            const selected = index === activeMap;
            const { x, y, map } = mapData;
            return <div key={map} style={{
                width: 25,
                height: 25,
                position: 'absolute',
                top: y * heightRatio,
                left: x * widthRatio,
                backgroundColor: selected ? '#f00' : '#000',
                borderRadius: 99,
            }}>
                <div style={{ marginTop: -22 }}>{map}</div>
            </div>
        })}
    </div>;
}