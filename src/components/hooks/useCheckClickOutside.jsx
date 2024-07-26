import { useEffect } from "react";

const useCheckClickOutside = (ref, changeStatus) => {
    // Function to handle clicks outside the referenced element
    const handleClickOutside = (event) => {
        //drowDownRef.current to check if value is defined and not null/undefine
        if (ref.current && !ref.current.contains(event.target)) {
            changeStatus();
        }
    };

    // Added a mouse listener to document to check if outside has been clicked
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);



    return;
}

export default useCheckClickOutside