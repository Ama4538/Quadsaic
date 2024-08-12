import { useEffect, useState } from "react";

const useOverlayManagement = () => {
    // Overlay Management
    const [overlayStatus, setOverlayStatus] = useState(true);
    const [welcomePage, setWelcomePage] = useState(true);
    const [settingPage, setSettingPage] = useState(false);
    const [tutorialPage, setTutorialPage] = useState(false);
    const [endPage, setEndPage] = useState(false);
    const [stagePage, setStagePage] = useState(false)

    // Page Manager
    useEffect(() => {
        setOverlayStatus(welcomePage || tutorialPage || settingPage || endPage || stagePage);
    }, [welcomePage, tutorialPage, settingPage, endPage, stagePage])

    return {
        overlayStatus,
        welcomePage,
        settingPage,
        tutorialPage,
        endPage,
        stagePage,
        setWelcomePage,
        setSettingPage,
        setTutorialPage,
        setEndPage,
        setStagePage,
    }
}

export default useOverlayManagement