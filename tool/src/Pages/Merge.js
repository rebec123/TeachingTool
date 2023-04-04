import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Navigate
} from "react-router-dom";
import { useDrop, useDrag } from "react-dnd";
import cloneDeep from 'lodash/cloneDeep';//Need deep clones to ensure each split array can be rearranged w/o effecting all arrays
import Confetti from 'react-confetti'
import SideMenu from '../Components/SideMenu';

const feedback = {
    merge_start: "Click 'split' to start splitting the arrays in half.",
    merge_drag: "Merge the two highlighted arrays into one. \nDrag the elements into the new array in order of lowest to highest.",
    merge_wrong_number: "That's not quite right.\nHave you included all the elements from the child arrays? \nAre you adding each element only once?",
    continue_split: "That's right! \nContinue splitting the arrays that have not yet been split.",
    wrong_order: "That's not quite right. \nDid you order the elements from lowest to highest?"
}
/*{
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
    }*/
const elementList = []
const _kMaxNumOfDivs = 31;

function Element({ id, contents, style }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",//ToDo: use enums instead of string eventually
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    if (style === "ar-el-grey") {
        return (<div className={style} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);//Not draggable
    }
    else {
        return (<div className={style} ref={drag} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);
    }
}
//--------------should we seperate these helpers/utility functions to own file? are they even utility functions?------------------------------------
//Given a div (a position in the graph formed by splitting an array in half recursively), this
//function returns the array elements that should be in that sub array
//Could implement memoization (saves result of calls incase called again, like cache)
const getElementsByDiv = (div) => {
    //Firstly, randomly generate an array
    let parentLen = 0;
    let lowerBound = 0;
    let upperBound = 0;
    let parent = [];
    let elementCount = elementList.length;
    if (div === 1) {
        return cloneDeep(elementList);
    }
    else if (div === 2) {
        return cloneDeep(elementList.filter(element => element.id <= (Math.ceil(elementCount / 2))));
    }
    else if (div === 3) {
        return cloneDeep(elementList.filter(element => element.id > (Math.ceil(elementCount / 2))));
    }
    else if (div === 4) {
        parentLen = Math.ceil(elementCount / 2);
        upperBound = Math.ceil(parentLen / 2);
        return cloneDeep(elementList.filter(element => element.id <= upperBound));
    }
    else if (div === 5) {
        parentLen = Math.ceil(elementCount / 2);
        lowerBound = Math.ceil(parentLen / 2);
        upperBound = Math.ceil(elementCount / 2);
        return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
    }
    else if (div === 6) {
        parentLen = elementCount - Math.ceil(elementCount / 2);
        lowerBound = Math.ceil(elementCount / 2);
        upperBound = lowerBound + Math.ceil(parentLen / 2);
        return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
    }
    else if (div === 7) {
        parentLen = elementCount - Math.ceil(elementCount / 2);
        lowerBound = Math.ceil(elementCount / 2) + Math.ceil(parentLen / 2);
        upperBound = lowerBound + (parentLen - Math.ceil(parentLen / 2));
        return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
    }
    else if (7 < div < 32) {
        let divHalved = div / 2;
        parent = getElementsByDiv(Math.floor(divHalved));
        if (divHalved - Math.floor(divHalved) === 0) {
            return cloneDeep(getChildLeft(parent));
        }
        else if (divHalved - Math.floor(divHalved) === 0.5) {
            return cloneDeep(getChildRight(parent));
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

//Given an array (the parent), this function returns the children that would appear
//To the left of the array (the left half of the array's elements)
const getChildLeft = (parent) => {
    if (parent.length === 1) {
        return [{contents: ""}];
    }
    else if (parent.length === 2) {
        return [parent[0]];
    }
    else if (parent.length === 3 || parent.length === 4) {
        return [parent[0], parent[1]];
    }
    else {
        return ['Sub array length unexpected'];
    }
}

//Given an array (the parent), this function returns the children that would appear
//To the right of the array (the right half of the array's elements)
const getChildRight = (parent) => {
    if (parent.length === 1) {
        return [{ contents: "" }];
    }
    else if (parent.length === 2) {
        return [parent[1]];
    }
    else if (parent.length === 3) {
        return [parent[2]];
    }
    else if (parent.length === 4) {
        return [parent[2], parent[3]];
    }
    else {
        return ['Sub array length unexpected'];
    }
}
//-----------------------------------------------------------------
//React loads twice, so need to make sure list is only created once
let arrayCreated = false;
function createArray() {
    if (arrayCreated === false) {
        arrayCreated = true
        let length = Math.floor((Math.random() * 10) + 6);// generates a number between 6 and 15 ((max-min +1) + min)
        for (let i = 0; i < length; i++) {
            elementList.push({
                id: i + 1,
                contents: Math.floor(Math.random() * 9) + 1
            });
        }
        console.log("length " + elementList.length);
        console.log(elementList);
        return elementList;
    }
}

const divContents = () => {
    createArray();
    let allNewArrays = [];
    allNewArrays.push({});
    for (let i = 1; i <= _kMaxNumOfDivs; i++) {
        let _merged = false;
        let _readyToMerge = false;
        let _contents = getElementsByDiv(i);
        if (_contents.length <= 1) {
            _merged = true;
        }
        let newArrayDetails = {
            index: i,
            contents: _contents,
            merged: _merged,
            readyToMerge: _readyToMerge,//TODO: IMPORTANT! ready to merge might be redundant?? have a close look and get rid if necessary
            //would there ever be a point where two divs are ready to be merged, so we'd need a status to keep track? I don't think so...
            style: "ar-el"
        }
        allNewArrays.push(newArrayDetails);
    }
    return allNewArrays;
}

//Remember: In middle of migrating to function component so things might start going wrong!

function Merge() {
    //GOOD TO KNOW: page is re-rendered everytime you set state
    //do not change state INSIDE render, because you will get stuck in endless loop and hang!
    //const [title, setTitle] = useState("Merge Sort");
    const [redirect, setRedirect] = useState(null);
    const [tipText, setTipText] = useState(feedback["merge_start"]);
    const [visibleDivs, setVisibleDivs] = useState([1]);
    const [arrays, setArrays] = useState(divContents());
    const [divToMerge, setDivToMerge] = useState(0);
    const [mergeArray, setMergeArray] = useState([]);
    const [done, setDone] = useState(false);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
        droppedItems:[],
    }))//remove dropped items?

    useEffect(
        () => {
        },
        [
            mergeArray, divToMerge
        ]
    )

    //Allows user to drop elements into the merge array
    const dropElement = (id) => {
        const latestElement = elementList.filter((element) => id === element.id);
        //KNOWN BUG- is possible for user to drag same element into merge array more than once (although program will reject answer and ask them to try again)
        setMergeArray(mergeArray => [...mergeArray, latestElement[0]]);
    }

    //code to start merge: change colours, add text telling them to drag, empty div, check if new contents of div are ordered.
    //once an array is merged, readToMerge set back to false, merged set to true
    const mergeMode = (parent, child1, child2) => {
        let oldArrays = arrays;
        //let newContents = arrays[parent].contents.map(el => Object.assign(el, { contents: "_" }));
        setDivToMerge(parent);
        setArrays(oldArrays.map(
            ar => ((ar.index !== parent && ar.index !== child1 && ar.index !== child2) ? Object.assign(ar, { style: "ar-el-grey" }) : ar)
        ));
        setTipText(feedback["merge_drag"]);
        /*setArrays(oldArrays.map(
            ar => ((ar.index === parent) ? Object.assign(ar, { contents: newContents }) : ar)
        ));*/
    }

    const isMergePossible = (i) => {//ToDo: if two children (or one child) merged, then parent is ready to merge
        //add error checking for if i or kids out of bounds
        let child1 = i * 2;
        let child2 = (i * 2) + 1;
        if (arrays[child1].merged && arrays[child2].merged) {
            //console.log(i + " is ready to merge");
            let oldArrays = arrays;
            //CHECK STILL WORKS
            setArrays(oldArrays.map(
                ar => (ar.index === i ? Object.assign(ar, { readyToMerge: true }) : ar)
            ));
            mergeMode(i, child1, child2);
        }
        else {//temp
            console.log(i + " is not ready to merge");
        }
    }

    //Given a parent div, this function adds the index of the two child divs to a state array "visibleDivs"
    //VisibleDivs are the divs that are visible to the user (e.g. after user has split div 1, they can see it's children: div 2 and 3)
    const onSplitClick = (div) => {
        //children are div*2 and div*2+1
        let newlyVisible = [];
        let canMerge = false;
        if (!visibleDivs.includes(div * 2)) {
            newlyVisible.push(div * 2);
        }
        if (!visibleDivs.includes((div * 2) + 1)) {
            newlyVisible.push((div * 2) + 1);
        }

        isMergePossible(div);

        setVisibleDivs([...visibleDivs, ...newlyVisible])

    }

    const onMergeClick = (div) => {
        let sorted = true;
        let allElements = true;
        //TODO might need to readjust the "allElements" checking (parts may be redundant) after we get one el at time working
        //if merge array contains each of the required elements and is the same length as two sub arrays added, we didnt miss any elements
        for (let i = 0; i < arrays[div * 2].contents.length; i++) {
            let index = mergeArray.findIndex(el => el.id === arrays[div * 2].contents[i].id);
            console.log(index);
            if (index === -1) {
                allElements = false;
            }
        }
        for (let i = 0; i < arrays[(div * 2) + 1].contents.length; i++) {
            let index = mergeArray.findIndex(el => el.id === arrays[(div * 2) + 1].contents[i].id);
            console.log(index);
            if (index === -1) {
                allElements = false;
            }
        }
        console.log("Got all elements: " + allElements);//Got here!
        if (mergeArray.length !== arrays[div * 2].contents.length + arrays[(div * 2) + 1].contents.length) {
            allElements = false;
        }
        if (!allElements) {
            setTipText(feedback["merge_wrong_number"]);
            setMergeArray([]);
            return;
        }
        console.log("Got no extra elements: " + allElements);//Got here!
        //Checking if the array is sorted
        for (let i = 0; i < mergeArray.length - 1; i++) {
            if (mergeArray[i].contents > mergeArray[i + 1].contents) { sorted = false; break; }
        }
        if (sorted) {
            let oldArrays = arrays;

            //Setting arrays back to black and updating variables of newly merged array
            setArrays(oldArrays.map(
                ar => (Object.assign(ar, { style: "ar-el" })
                )));
            setArrays(oldArrays.map(
                ar => (ar.index === div ? Object.assign(ar, { contents: mergeArray, merged: true, readyToMerge: false }) : ar)
            ));
            if (div === 1) {
                setDone(true);
            }
            else {
                setTipText(feedback["continue_split"]);//ToDo: change to helper text instead of title
            }
            //Resetting merge state values
            setDivToMerge(0);
            setMergeArray([]);

            //Removing the merged array's children from user's view
            let newVisDivs = visibleDivs.filter(d => d !== div * 2 && d !== (div * 2) + 1);
            console.log("newVisDivs: " + newVisDivs);
            setVisibleDivs(newVisDivs);

            //Checking if the div's parent is ready to be merged now
            console.log("Chekcing if " + Math.floor(div / 2) + " ready to be merged now...");
            isMergePossible(Math.floor(div / 2));
        }
        else {
            setTipText(feedback["wrong_order"]);//ToDo: change to helper text instead of title
            setMergeArray([]);
        }
    }

    //Pass the index of the div, determine appropriate button out of: split or placeholder
    const determineButton = (div) => {//not length! chekc if merged!!
        let addButton = <div className="size-of-button" />;
        //console.log("merged? " + arrays[div].merged);
        if (!visibleDivs.includes(div * 2) && !arrays[div].merged) {
            if (divToMerge !== 0) {
                addButton = <button className="btn-split-disabled" onClick={() => onSplitClick(div)} disabled>split</button>;
            }
            else {
                addButton = <button className="btn-split" onClick={() => onSplitClick(div)} >split</button>;
            }
        }
        return addButton;
    }

    const row0 = () => {
        const result = []; 
        let i = 1;
        if (divToMerge === i) {
            result.push(
                <>
                <div className="flex-stage">
                    <div className="array-and-div">
                        <div className="element-target" ref={drop} >
                        {mergeArray.map((element) => {
                            return <Element contents={element.contents} id={element.id} style="ar-el" />
                        })}
                        </div>
                    </div>
                </div>
                <button className="btn-merge" onClick={() => onMergeClick(i)} >merge</button>
                </>
            );
        }
        else {
            result.push(
                <>
                <div className="flex-stage">
                    <div className="array">{arrays[i].contents.map((element) => {
                        return <Element contents={element.contents} id={element.id} style={arrays[i].style} />
                    })}
                    </div>
                    
                </div>
                {determineButton(i)}
                </>
            );
        }
        return (
           result
        );
    }

    const row1 = () => {
        const result = [];
        for (let i = 2; i < 4; i++) {
            let elements = arrays[i].contents;

            if (visibleDivs.includes(i)) {
                if (divToMerge === i) {
                    result.push(
                        <div className="array-and-div">
                            <div className="element-target" ref={drop} >
                                {mergeArray.map((element) => {
                                    return <Element contents={element.contents} id={element.id} style="ar-el" />
                                })}
                            </div>
                            <button className="btn-merge" onClick={() => onMergeClick(i)} >merge</button>
                        </div>
                    );
                }
                else {
                    result.push(
                        <div className="array-and-div">
                            <div className="array-split">
                                {
                                    elements?.map((element) => {
                                        return <Element contents={element.contents} id={element.id} style={arrays[i].style} />
                                    })}
                            </div>
                            {determineButton(i)}
                        </div>
                    );
                }
            }
            else {
                result.push(<div className="array-and-div" />);
            }
            //if (arrays[i].contents !== undefined) {
            //}
            
        }
        return (
            <div className="flex-stage">
                {result}
            </div>
        );
    }

    const row2 = () => {
        const result = [];
        for (let i = 4; i < 8; i++) {
            let elements = arrays[i].contents;

            if (visibleDivs.includes(i)) {
                if (divToMerge === i) {
                    result.push(
                        <div className="array-and-div">
                            <div className="element-target" ref={drop} >
                                {mergeArray.map((element) => {
                                    return <Element contents={element.contents} id={element.id} style="ar-el" />
                                })}
                            </div>
                            <button className="btn-merge" onClick={() => onMergeClick(i)} >merge</button>
                        </div>
                    );
                }
                else {
                    result.push(
                        <div className="array-and-div">
                            <div className="array-split">
                                {
                                    elements?.map((element) => {
                                        return <Element contents={element.contents} id={element.id} style={arrays[i].style} />
                                    })}
                            </div>
                            {determineButton(i)}
                        </div>
                    );
                }
            }
            else {
                result.push(<div className="array-and-div" />);
            }
        }
        return (
            <div className="flex-stage">
                {result}
            </div>
        );
    }

    const row3 = () => {
        const result = [];
        for (let i = 8; i < 16; i++) {
            let elements = arrays[i].contents;

            if (visibleDivs.includes(i)) {
                if (divToMerge === i) {
                    result.push(
                        <div className="array-and-div">
                            <div className="element-target" ref={drop} >
                                {mergeArray.map((element) => {
                                    return <Element contents={element.contents} id={element.id} style="ar-el" />
                                })}
                            </div>
                            <button className="btn-merge" onClick={() => onMergeClick(i)} >merge</button>
                        </div>
                    );
                }
                else {
                    result.push(
                        <div className="array-and-div">
                            <div className="array-split">
                                {
                                    elements?.map((element) => {
                                        return <Element contents={element.contents} id={element.id} style={arrays[i].style} />
                                    })}
                            </div>
                            {determineButton(i)}
                        </div>
                    );
                }
            }
            else {
                result.push(<div className="array-and-div" />);
            }
        }
        return (
            <div className="flex-stage">
                {result}
            </div>
        );
    }
    //trying to figure out where to put code to fill in arrays, prooving difficult
    //When comment out row4, no undefined error. check when we set array to new vars cos i thinkt hats causing issues rn
    const row4 = () => {//Note: didn't add split buttons beacuse length should be max 1 so don't need to split furthur
        const result = [];
        for (let i = 16; i < 32; i++) {
            let elements = arrays[i].contents;
            if (visibleDivs.includes(i)) {
                result.push(
                    <div className="array-and-div">
                        <div className="array-split">
                            {
                                elements?.map((element) => {
                                    if ('contents' in element) {
                                        return <Element contents={element.contents} id={element.id} style={arrays[i].style} />
                                    }
                                })}
                        </div>
                    </div >
                );
            }
            else {
                result.push(<div className="array-and-div" />);
            }
        }
        return (
            <div className="flex-stage">
                {result}
            </div>
        );
    }


    const pageContents = () => {
        if (done) {//change back to "done" after testing
            //can change confetti colours!
            //could adjust amount of confetti based on user's score
            return (
                <>
                    <div className="header-small">
                        <h1 className="title-ppt-style-small">Merge Sort</h1>
                    </div>
                    <h2 className="well-done-merge">Well Done!</h2>
                    <div className="stage">
                        <Confetti recycle={false} numberOfPieces="100" />
                        <a className="homeButton" href="/">
                            <button className="btn-back">Home</button>
                        </a>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div className="header-small">
                        <h1 className="title-ppt-style-small">Merge Sort</h1>
                    </div>
                    <div className="flex-stage">
                        <div className="merge-container">
                            {row0()}
                            {row1()}
                            {row2()}
                            {row3()}
                            {row4()}
                        </div>
                        <div className="merge-text-container">
                            {tipText}
                        </div>

                    </div>
                </>
                );
        }
    }

    return (
        <>
            <div id="outer-container">
                <SideMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'} algorithm="merge" />
                <div id="page-wrap">
                    {pageContents()}
                </div>
            </div>
        </>
    );
}

export default Merge;
