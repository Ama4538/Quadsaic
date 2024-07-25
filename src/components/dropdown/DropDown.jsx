import { useState, useEffect, useRef } from "react"

function DropDown({ content, name = "", startingValue, setSelected, updateChangesMade}) {
    // State to manage visibility 
    const [visible, setVisible] = useState(false)
    const [displayName, setDisplayName] = useState(startingValue)

    // ref to the drop down menu
    const drowDownRef = useRef(null);

    // Filter the content to show all but the currrent selected
    let dropDownMenu = (content.filter((choice) => choice !== displayName)).sort();

    // Added a mouse listener to document to check if outside has been clicked
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if the click happen outside the dropdown menu
    function handleClickOutside (event) {
        //drowDownRef.current to check if value is defined and not null/undefine
        if (drowDownRef.current && !drowDownRef.current.contains(event.target)) {
            setVisible(false);
        }
    };

    return (
        <div
            className="dropdown"
            ref={drowDownRef}
            onClick={() => {
                setVisible(prev => !prev)
            }}
            data-visible={(visible) ? "visible" : "hidden"}
        >
            {displayName}
            <ul className="dropdown__menu">
                {/* Print out the content of the dropdown menu */}
                {dropDownMenu.map((element, index) => {
                    return (
                        <li
                            className="dropdown__option"
                            key={"dropdown__Menu-name-" + index}
                            onClick={() => {
                                setDisplayName(element);
                                setSelected(name, element);
                                updateChangesMade(true)
                            }}
                        >{element}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DropDown