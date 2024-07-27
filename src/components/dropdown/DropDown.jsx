import { useState, useRef } from "react"
import useCheckClickOutside from "../hooks/useCheckClickOutside";

function DropDown({ 
    content, 
    name = "", 
    startingValue, 
    setSelected, 
    updateChangesMade,
    sort = true,
}) {
    // State to manage visibility 
    const [visible, setVisible] = useState(false)
    const [displayName, setDisplayName] = useState(startingValue)

    // ref to the drop down menu
    const drowDownRef = useRef(null);
    
    // Filter the content to show all but the currrent selected
    let dropDownMenu = content.filter((choice) => choice !== displayName)
    if (sort) {
        dropDownMenu.sort();
    }


    const updateStatus = () => {
        setVisible(false);
    }

    useCheckClickOutside(drowDownRef, updateStatus)

    return (
        <div
            className="dropdown"
            ref={drowDownRef}
            onClick={() => {
                setVisible(prev => !prev)
            }}
            data-visible={(visible) ? "visible" : "hidden"}
            data-large = {startingValue.length > 1 ? true : false}
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