import { useEffect, useState } from "react";

const useOverlayManagement = () => {
    // Overlay Management
    const [overlayStatus, setOverlayStatus] = useState(true);
    const [welcomePage, setWelcomePage] = useState(true);
    const [settingPage, setSettingPage] = useState(false);
    const [tutorialPage, setTutorialPage] = useState(false);
    const [endPage, setEndPage] = useState(false);

    // Page Manager
    useEffect(() => {
        setOverlayStatus(welcomePage || tutorialPage || settingPage || endPage);
    }, [welcomePage, tutorialPage, settingPage, endPage])

    return {
        overlayStatus,
        welcomePage,
        settingPage,
        tutorialPage,
        endPage,
        setWelcomePage,
        setSettingPage,
        setTutorialPage,
        setEndPage,
    }
}

export default useOverlayManagement