import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import CampaignContext from '../contexts/CampaignContext';
import useLoaded from '../hooks/useLoaded';
import AssetContext from '../contexts/AssetContext';

export default function CampaignView() {
    const { campaign } = useParams();
    const { loadCampaign, campaignData, campaignDataRef, campaignSaveData } = useContext(CampaignContext);
    const { campaignLoaded } = useLoaded();
    const { getImage } = useContext(AssetContext);
    const [size, setSize] = useState({ width: 1, height: 1 });
    const [activeMap, setActiveMap] = useState(0);
    const enterHandlerRef = useRef(() => {});
    const navigate = useNavigate();

    const mapsAlreadyWon = campaignSaveData?.maps.map((data) => data.map) ?? [];

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
            } else if (code === "ArrowUp") {
                setActiveMap((active) => {
                    let next = active-1;
                    if (next < 0) {
                        next = campaignDataRef.current.maps.length-1;
                    }
                    return next;
                });
            } else if (code === "ArrowDown") {
                setActiveMap((active) => {
                    let next = active + 1;
                    if (next > campaignDataRef.current.maps.length-1) {
                        next = 0;
                    }

                    return next;
                });
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

    useEffect(() => {
        if (campaignLoaded) {
            const allMaps = campaignData.maps.map(data => data.map);
            const remainingMaps = [...allMaps];
            // basically figure out what maps are left by removing
            // all the ones we have already won
            for (const map of mapsAlreadyWon) {
                const index = remainingMaps.indexOf(map);
                if (index >= 0) {
                    remainingMaps.splice(index, 1);
                }
            }

            // if there are any left, select the first one
            // otherwise select the last map possible
            if (remainingMaps.length > 0) {
                const finalIndex = allMaps.indexOf(remainingMaps[0]);
                setActiveMap(finalIndex);
            } else {
                setActiveMap(allMaps.length-1);
            }
        }
    }, [campaignData, campaignLoaded]);

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
            const won = mapsAlreadyWon.includes(map);

            let backgroundColor = "#000";
            if (won) {
                backgroundColor = "#0f0";
            }
            if (selected) {
                backgroundColor = "#f00";
            }

            return <div key={map} style={{
                width: 25,
                height: 25,
                position: 'absolute',
                top: y * heightRatio,
                left: x * widthRatio,
                backgroundColor,
                borderRadius: 99,
            }}>
                <div style={{ marginTop: -22 }}>{map}</div>
            </div>
        })}
    </div>;
}