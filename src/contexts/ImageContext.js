import React, { useState, useRef } from 'react';

import Coms from '../utils/coms';

const ImageContext = React.createContext({});
export default ImageContext;

export function ImageProvider({ children }) {
    const [images, setImages] = useState({});
    const imageIdRef = useRef(0);
    const loadingImagesRef = useRef(0);
    const [loaded, setLoaded] = useState(false);

    const value = {
        loadImage: (data) => {
            const id = imageIdRef.current;
            const fullId = `image_${id}`;
            imageIdRef.current ++;

            setLoaded(false);
            loadingImagesRef.current += 1;

            Coms.send('getImage', { slug: data }).then((result) => {
                loadingImagesRef.current -= 1;
                if (loadingImagesRef.current === 0) {
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
            });

            return fullId;
        },
        loaded,
        images,
    };

    return (
        <ImageContext.Provider value={value}>
            {children}
        </ImageContext.Provider>
    );
}