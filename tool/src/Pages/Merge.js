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
    },

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
    }

]

function Merge() {
    const [array, setArray] = useState([]);
    const [visibleDivs, setVisibleDivs] = useState([1]);
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
        let parent = [];
        if (div == 1) {
            return elementList;
        }
        else if (div == 2) {
            return elementList.filter(element => element.id <= (Math.ceil(elementCount / 2)));
        }
        else if (div == 3) {
            return elementList.filter(element => element.id > (Math.ceil(elementCount / 2)));
        }
        else if (div == 4) {
            parentLen = Math.ceil(elementCount / 2);
            upperBound = Math.ceil(parentLen / 2);
            return elementList.filter(element => element.id <= upperBound);
        }
        else if (div == 5) {
            parentLen = Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(parentLen / 2);
            upperBound = Math.ceil(elementCount / 2);
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (div == 6) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2);
            upperBound = lowerBound + Math.ceil(parentLen / 2);
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (div == 7) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2) + Math.ceil(parentLen / 2);
            upperBound = lowerBound + (parentLen - Math.ceil(parentLen / 2));
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (7 < div < 32) {
            let divHalved = div / 2;
            parent = getElementsByDiv(Math.floor(divHalved));
            if (divHalved - Math.floor(divHalved) == 0) {
                return getChildLeft(parent);
            }
            else if (divHalved - Math.floor(divHalved) == 0.5) {
                return getChildRight(parent);
            }
            else {
                console.log("Something went wrong at div = " + div);
                return [];
            }
        }
        else {
            console.log("Invalid value for 'div': " + div);
            return [];
        }
    }

    function getChildLeft(parent) {
        if (parent.length == 1) {
            return [];
        }
        else if (parent.length == 2) {
            return [parent[0]];
        }
        else if (parent.length == 3 || parent.length==4) {
            return [parent[0], parent[1]];
        }
        else {
            return ['Sub array length unexpected'];
        }
    }

    function getChildRight(parent) {
        if (parent.length == 1) {
            return [];
        }
        else if (parent.length == 2) {
            return [parent[1]];
        }
        else if (parent.length == 3) {
            return [parent[2]];
        }
        else if (parent.length == 4) {
            return [parent[2], parent[3]];
        }
        else {
            return ['Sub array length unexpected'];
        }
        deafult:
        return ['Invalid array length']
    }

    //change to make new layer visible? page should have all divs and all arrays drawn but hide irrelevent sections till its their time to shine
    const onSplitClick = (div) => {
        //children are div*2 and div*2+1
        console.log("hi " + div);
        div = 1;
        setVisibleDivs((visibleDivs) => [...visibleDivs, div * 2, (div * 2) + 1]);
        console.log(visibleDivs);

    }

    const row1 = () => {
        const result = [];
        for (let i = 2; i < 4; i++) {
            let elements = getElementsByDiv(i);
            let visibility = visibleDivs.includes(i) ? "visible" : "hidden";
            const div = i;
            console.log(visibility);
            //visibility prooving difficult!
            //want to pass div to onclikc and then display that arrays children
            result.push(
                <div className="array-and-div" id="array-and-div-">
                    {console.log("array-and-div-{i}")}
                <div className="array-split-once">
                    {
                        elements?.map((element) => {
                            return <Element contents={element.contents} id={element.id} />
                        })}
                    </div>
                    <button className="split" onClick={(div) => onSplitClick(div)} >split</button>
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
            let visibility = visibleDivs.includes(i) ? "visible" : "hidden";
            result.push(
                <div className="array-and-div" hidden>//temp
                <div className="array-split-twice">
                    {
                        elements?.map((element) => {
                        return <Element contents={element.contents} id={element.id} />
                    })}
                    </div>
                    <button className="split" onClick={() => { onSplitClick() }} >split</button>
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
            let visibility = visibleDivs.includes(i) ? "visible" : "hidden";
            let addSplit = "";
            if (elements.length > 1) {
                addSplit = <button className="split" onClick={() => { onSplitClick() }} >split</button>;
            }
            result.push(
                <div className="array-and-div" hidden>
                <div className="array-split-thrice">
                    {
                        elements?.map((element) => {
                            return <Element contents={element.contents} id={element.id} />
                        })}
                </div>
                {addSplit}
                </div>
            );
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    const row4 = () => {//Note: didn't add split buttons beacuse length should be max 1 so don't need to split furthur
        const result = [];
        for (let i = 16; i < 32; i++) {
            let elements = getElementsByDiv(i);
            let visibility = visibleDivs.includes(i) ? "visible" : "hidden";
            result.push(
                <div className="array-and-div" hidden>
                <div className="array-split-thrice">
                    {
                        elements?.map((element) => {
                            return <Element contents={element.contents} id={element.id} />
                        })}
                </div>
                </div >
            );
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    //ToDo: not sure top array is properly central
    return (
        <>
            <h1>hi</h1>
            <div className="stage">
                <div className="array">{ elementList.map((element) => {
                return <Element contents={element.contents} id={ element.id }/>
                })}
                </div>
                <button className="split" onClick={() => { onSplitClick() }} >split</button>
                {row1()}
                {row2()}
                {row3()}
                {row4()}
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
