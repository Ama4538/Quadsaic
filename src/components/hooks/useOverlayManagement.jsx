import { useEffect, useState } from "react";

const useOverlayManagement = () => {
    // Overlay Management
    const [overlayStatus, setOverlayStatus] = useState(true);
    const [welcomePage, setWelcomePage] = useState(true);
    const [settingPage, setSettingPage] = useState(false);
    const [tutorialPage, setTutorialPage] = useState(false);

    // Page Manager
    useEffect(() => {
        setOverlayStatus(welcomePage || tutorialPage || settingPage);
    }, [welcomePage, tutorialPage, settingPage])

    return {
        overlayStatus,
        welcomePage,
        settingPage,
        tutorialPage,
        setWelcomePage,
        setSettingPage,
        setTutorialPage,
    }
}

export default useOverlayManagement