import { useState, useEffect } from 'react';

function getWindowLocation() {
    const isBrowser = () => typeof window !== "undefined"
    const { pathname: path } = (isBrowser() && window.location);
    return {
        path
    };
}

export default function useWindowLocation() {
    const [windowLocation, setWindowLocation] = useState(getWindowLocation());

    useEffect(() => {
        function handlePathChange() {
            setWindowLocation(getWindowLocation());
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {

            })
        })
        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowLocation;
}