import React, { useState } from "react";
import Element from "../Components/Element";
import { useDrop } from "react-dnd";

const elementList = [
    {
        id: 1,
        contents: 6
    },

    {
        id: 2,
        contents: 5
    },

    {
        id: 3,
        contents: 3
    },

    {
        id: 4,
        contents: 1
    },

    {
        id: 5,
        contents: 8
    },

    {
        id: 6,
        contents: 7
    },

    {
        id: 7,
        contents: 2
    },

    {
        id: 8,
        contents: 4
    }/*,

    {
        id: 9,
        contents: 3
    },

    {
        id: 10,
        contents: 1
    },

    {
        id: 11,
        contents: 10
    },

    {
        id: 12,
        contents: 7
    },

    {
        id: 13,
        contents: 3
    }*/

]

function Merge() {
    const [array, setArray] = useState([]);
    const [allArrays, setAllArrays] = useState([[]]);//should be list?
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (item) => addElementToArr(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))
    //use this for user swapping positions of elements in array
    const addElementToArr = (id) => {
        const latestElement = elementList.filter((element) => id == element.id);
        //setArray((array) => [...array, latestElement[0]]); //adds multiple elements into array
        setArray([latestElement[0]]); //only one element in array
    }

    const elementCount = elementList.length;

    function getElementsByDiv(div) {//need some error checking in this baby so don't go out of bounds
        let parentLen = 0;
        let lowerBound = 0;
        let upperBound = 0;
        switch (div) {
            case (1):
                return elementList;
            case (2):
                return elementList.filter(element => element.id <= (Math.ceil(elementCount / 2)));
            case (3):
                return elementList.filter(element => element.id > (Math.ceil(elementCount / 2)));
            case (4):
                parentLen = Math.ceil(elementCount / 2);
                upperBound = Math.ceil(parentLen / 2);
                return elementList.filter(element => element.id <= upperBound);
            case (5):
                parentLen = Math.ceil(elementCount / 2);
                lowerBound = Math.ceil(parentLen / 2);
                upperBound = Math.ceil(elementCount / 2);
                return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
            case (6):
                parentLen = elementCount - Math.ceil(elementCount / 2);
                lowerBound = Math.ceil(elementCount / 2);
                upperBound = lowerBound + Math.ceil(parentLen / 2);
                return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
            case (7):
                parentLen = elementCount - Math.ceil(elementCount / 2);
                lowerBound = Math.ceil(elementCount / 2) + Math.ceil(parentLen / 2);
                upperBound = lowerBound + (parentLen - Math.ceil(parentLen / 2));
                return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
            case (8):
                parentLen = Math.ceil(elementCount / 4);
                lowerBound = 0;
                upperBound = Math.ceil(parentLen / 2);
                return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
            case (9):
                parentLen = Math.ceil(elementCount / 4);
                lowerBound = Math.ceil(parentLen / 2);
                upperBound = parentLen;
                return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
            deafult:
                return [];
        }
    }

    //change to make new layer visible? page should have all divs and all arrays drawn but hide irrelevent sections till its their time to shine
    const onSplitClick = () => {
        /*const latestElement = elementList.filter((element) => 1 == element.id);
        setSplitArray((splitArray) => [...splitArray, latestElement[0]]);

        console.log(getElementsByDiv(7));*/
    }

    const row1 = () => {
        const result = [];
        for (let i = 2; i < 4; i++) {
            let elements = getElementsByDiv(i);
            result.push(
                <div className="array-split-once">
                    {
                        elements?.map((element) => {
                            return <Element contents={element.contents} id={element.id} />
                        })}
                </div>
            );
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    const row2 = () => {
        const result = [];
        for (let i = 4; i < 8; i++) {
            let elements = getElementsByDiv(i);
            result.push(
                <div className="array-split-twice">
                    {
                        elements?.map((element) => {
                        return <Element contents={element.contents} id={element.id} />
                    })}
                </div>
            );
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    const row3 = () => {
        const result = [];
        for (let i = 8; i < 16; i++) {
            let elements = getElementsByDiv(i);
            result.push(
                <div className="array-split-thrice">
                    {
                        elements?.map((element) => {
                            return <Element contents={element.contents} id={element.id} />
                        })}
                </div>
            );
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    return (
        <>
            <h1>hi</h1>
            <div className="stage">
                <div className="array">{ elementList.map((element) => {
                return <Element contents={element.contents} id={ element.id }/>
                })}
                </div>
                <button className="split" onClick={() => { onSplitClick() }} >split</button>
                { row1() }
                { row2() }
                { row3() }
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
