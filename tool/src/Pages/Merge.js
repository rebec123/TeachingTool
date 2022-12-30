import React, { useState } from "react";
import Element from "../Components/Element";
import { useDrop } from "react-dnd";

const elementList = [
    {
        id: 1,
        contents: 5
    },

    {
        id: 2,
        contents: 10
    }
]
function Merge() {
    const [array, setArray] = useState([]);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (item) => addElementToArr(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))
    const addElementToArr = (id) => {
        const latestElement = elementList.filter((element) => id == element.id);
        //setArray((array) => [...array, latestElement[0]]); //adds multiple elements into array
        setArray([latestElement[0]]); //only one element in array
    }
    return (
        <>
            <div className="stage">
            <div className="array">{ elementList.map((element) => {
                return <Element contents={element.contents} id={ element.id }/>
            })}
                </div>
                <div className="element-target" ref={ drop }>
                    {array.map((element) => {
                        return <Element contents={element.contents} id={element.id} />
                    })}
                </div>
            </div>
        </>
    );
}

export default Merge;
