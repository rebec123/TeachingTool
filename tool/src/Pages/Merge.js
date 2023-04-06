import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import cloneDeep from 'lodash/cloneDeep.js';//Need deep clones to ensure each split array can be rearranged w/o effecting all arrays
import Confetti from 'react-confetti'
import SideMenu from '../Components/SideMenu.js';
import MergeHelpers from '../Pages/MergeHelpers.js'
import "./Merge.css";


//A dictionary of feedback
const feedback = {
    merge_start: "Click 'split' to start splitting the arrays in half.",
    merge_drag: "Merge the two highlighted arrays into one. \nDrag the elements into the new array in order of lowest to highest.",
    not_right: "That's not quite right.",
    merge_wrong_num_active:"\nHave you included all the elements from the child arrays? \nAre you adding each element only once?",
    continue_split: "That's right! \nContinue splitting the arrays that have not yet been split.",
    wrong_order_active: "\nDid you order the elements from lowest to highest?"
}

//The array to be sorted
const elementList = MergeHelpers.createArray();


//A draggable array element
function Element({ id, contents, style }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    //f element needs greying out
    if (style === "ar-el-grey") {
        return (<div className={style} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);//Not draggable
    }
    //Otherwise, display normally
    else {
        return (<div className={style} ref={drag} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);
    }
}

function Merge() {
    const [tipText, setTipText] = useState(feedback["merge_start"]);//Feedback the user sees
    const [visibleDivs, setVisibleDivs] = useState([1]);//The sub arrays that should be visible to the user
    const [arrays, setArrays] = useState(MergeHelpers.divContents(elementList));//An array of objects representing all the sub arrays
    const [divToMerge, setDivToMerge] = useState(0);//The number of the div that needs merging
    const [mergeArray, setMergeArray] = useState([]);//The array the user fills with elements from the sub arrays getting merged
    const [cMistakes, setCMistakes] = useState(0);//Mistakes made on the user's current task
    const [tMistakes, setTMistakes] = useState(0);//Overall mistakes made
    const [done, setDone] = useState(false);//When user finishes the full practice, this is true
    const [{ isOver }, drop] = useDrop(() => ({//Code for drag and drop
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    //Allows user to drop elements into the merge array
    const dropElement = (id) => {
        const latestElement = elementList.filter((element) => id === element.id);
        setMergeArray(mergeArray => [...mergeArray, latestElement[0]]);
    }

    //Code to start the merging proccess
    //once an array is merged, readyToMerge set back to false, merged set to true
    const mergeMode = (parent, child1, child2) => {
        let oldArrays = arrays;
        setDivToMerge(parent);
        setArrays(oldArrays.map(
            ar => ((ar.index !== parent && ar.index !== child1 && ar.index !== child2) ? Object.assign(ar, { style: "ar-el-grey" }) : ar)
        ));
        setTipText(feedback["merge_drag"]);
    }

    //Checks if the children of div i are ready to be merged
    const isMergePossible = (i) => {
        let child1 = i * 2;
        let child2 = (i * 2) + 1;
        if (arrays[child1].merged && arrays[child2].merged) {
            let oldArrays = arrays;
            setArrays(oldArrays.map(
                ar => (ar.index === i ? Object.assign(ar, { readyToMerge: true }) : ar)
            ));
            mergeMode(i, child1, child2);
        }
        return;
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

    //This checks if the array the user submitted to merge is valid or not
    const onMergeClick = (div) => {
        let sorted = true;
        let allElements = true;
        let currentMis = cMistakes;
        //Checking all elements from array 1 have been added
        for (let i = 0; i < arrays[div * 2].contents.length; i++) {
            let index = mergeArray.findIndex(el => el.id === arrays[div * 2].contents[i].id);
            if (index === -1) {
                allElements = false;
            }
        }
        //Checking all elements from array 2 have been added
        for (let i = 0; i < arrays[(div * 2) + 1].contents.length; i++) {
            let index = mergeArray.findIndex(el => el.id === arrays[(div * 2) + 1].contents[i].id);
            if (index === -1) {
                allElements = false;
            }
        }
        //Checking there's no repeated elements
        if (mergeArray.length !== arrays[div * 2].contents.length + arrays[(div * 2) + 1].contents.length) {
            allElements = false;
        }
        if (!allElements) {
            let active = "";
            if (currentMis > 0) {
                active = feedback["merge_wrong_num_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
            setMergeArray([]);
            return;
        }
        //Checking if the array is sorted
        for (let i = 0; i < mergeArray.length - 1; i++) {
            if (mergeArray[i].contents > mergeArray[i + 1].contents) { sorted = false; break; }
        }
        if (sorted) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);
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
            setVisibleDivs(newVisDivs);

            //Checking if the div's parent is ready to be merged now
            isMergePossible(Math.floor(div / 2));
        }
        else {
            let active = "";
            if (currentMis > 0) {
                active = feedback["wrong_order_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
            setMergeArray([]);
        }
    }

    //Given the index of a div, it determines the appropriate button out of: split or placeholder
    const determineButton = (div) => {
        let addButton = <div className="size-of-button" />;
        if (!visibleDivs.includes(div * 2) && !arrays[div].merged) {
            if (divToMerge !== 0) {
                addButton = <button className="btn-split-disabled" onClick={() => onSplitClick(div)} disabled>split</button>;
            }
            else {
                addButton = <button className="btn-split" data-testid="btn-split" onClick={() => onSplitClick(div)} >split</button>;
            }
        }
        return addButton;
    }

    //The first row of the visualisation (the full array)
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

    //The second row of the visualisation
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
        }
        return (
            <div className="flex-stage">
                {result}
            </div>
        );
    }

    //The third row of the visualisation
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

    //The fourth row of the visualisation
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

    //The fith row of the visualisation
    const row4 = () => {//There are no split buttons beacuse length should be max 1 so don't need to split furthur
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

    //Determines if should display end screen (because user finished the task) or the practice screen (task is ongoing)
    const pageContents = () => {
        if (done) {
            //User made 0 mistakes total (they get more confetti)
            if (tMistakes===0) {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Merge Sort</h1>
                        </div>
                        <div className="end-screen-merge">
                            <h2>Well Done!</h2>
                                You made 0 mistakes
                        </div>
                        <div className="stage">
                            <Confetti recycle={false} numberOfPieces="200" />
                            <a className="homeButton" href="/">
                                <button className="btn-back">Home</button>
                            </a>
                        </div>
                    </>
                );
            }
            //User made 1 mistake (they get slightly less confetti)
            else if (tMistakes === 1) {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Merge Sort</h1>
                        </div>
                        <div className="end-screen-merge">
                            <h2>Good job!</h2>
                            You only made 1 mistake, why not practice again and get it down to 0?
                        </div>
                        <div className="stage">
                            <Confetti recycle={false} numberOfPieces="100" />
                            <a className="homeButton" href="/">
                                <button className="btn-back">Home</button>
                            </a>
                        </div>
                    </>
                );
            }
            //User made 2+ mistakes, no confetti
            else {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Merge Sort</h1>
                        </div>
                        <div className="end-screen-merge">
                            <h2>Good try</h2>
                            You made {tMistakes} mistakes, practice again and see if you can improve!
                        </div>
                        <div className="stage">
                            <a className="homeButton" href="/">
                                <button className="btn-back">Home</button>
                            </a>
                        </div>
                    </>
                );
            }
            
        }
        //Displaying the visualisation and feedback
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
