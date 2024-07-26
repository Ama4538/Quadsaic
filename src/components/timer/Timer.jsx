import { useEffect } from "react";

const Timer = ({
    overlayStatus,
    enableTimer,
    currentTime,
    updateCurrentTime,
    updatePage,
    updateMessage
}) => {
    // Timer
    useEffect(() => {
        let timeInterval = null;
        if (!overlayStatus) {
            if (enableTimer && currentTime > 0) {
                timeInterval = setInterval(() => {
                    updateCurrentTime(currentTime - 1)
                }, 1000)
            } else if (currentTime <= 0) {
                clearInterval(timeInterval)
                updateMessage("Out of Time!")
                setTimeout(() => {
                    updatePage("end", true)
                }, 1000)
            }
        }

        return () => clearInterval(timeInterval)
    }, [enableTimer, currentTime, overlayStatus])

    //format the time
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    return (
        <p>{formatTime(currentTime)}</p>
    )
}
export default Timer