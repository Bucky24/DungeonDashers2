import React, { useState, useRef } from 'react';

import Coms from '../utils/coms';

const AssetContext = React.createContext({});
export default AssetContext;

export function AssetProvider({ children }) {
    const [images, setImages] = useState({});
    const assetIdRef = useRef(0);
    const loadingAssetsRef = useRef(0);
    const [loaded, setLoaded] = useState(false);
    const [fullImages, setFullImages] = useState({});
    const [sounds, setSounds] = useState({});

    const value = {
        loadImage: (data) => {
            const id = assetIdRef.current;
            const fullId = `image_${id}`;
            assetIdRef.current ++;

            setLoaded(false);
            loadingAssetsRef.current += 1;

            Coms.send('getImage', { slug: data }).then((result) => {
                loadingAssetsRef.current -= 1;
                if (loadingAssetsRef.current === 0) {
                    setLoaded(true);
                }

                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                setImages((images) => {
                    return {
                        ...images,
                        [fullId]: result.image,
                    };
                });

                setFullImages((images) => {
                    return {
                        ...images,
                        [fullId]: {
                            url: result.url,
                        },
                    };
                });
            });

            return fullId;
        },
        loaded,
        images,
        fullImages,
        sounds,
        getImage: (id) => {
            return images[id];
        },
        loadSound: (data) => {
            const id = assetIdRef.current;
            const fullId = `image_${id}`;
            assetIdRef.current ++;

            setLoaded(false);
            loadingAssetsRef.current += 1;

            Coms.send('getSound', { slug: data }).then((result) => {
                loadingAssetsRef.current -= 1;
                if (loadingAssetsRef.current === 0) {
                    setLoaded(true);
                }

                setSounds((sounds) => {
                    return {
                        ...sounds,
                        [fullId]: result.sound,
                    };
                });
            });

            return fullId;
        },
    };

    return (
        <AssetContext.Provider value={value}>
            {children}
        </AssetContext.Provider>
    );
}