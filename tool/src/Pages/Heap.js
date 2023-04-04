import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import Confetti from 'react-confetti'
import SideMenu from '../Components/SideMenu';

/*
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
    }
*/

const feedback = {
    insert_click: "Click the position in the heap where the next element from the array should go.",
    delete: "That's right! \nNow click the node that should be deleted from the heap and added to the ordered array.",
    sift: "That's right!\nNow the root needs sifting down the heap to maintiain the following property:" +
        "\n~A child node cannot be larger than a parent node~" +
        "\nDrag the largest child of the root to replace ",
    correct_no_sift: "That's right! \nAlso, the new root is not smaller than its children so the heap does not need sifting." +
        "\nClick the node that should be deleted next.",
    reorder: "That's right! \nNow the heap needs reordering to hold the property: \n~A child node cannot be larger than a parent node~." +
        "\nDrag the invalid child node to the position of its parent to swap the two.",
    drag_new_root: "That's right! \nDrag the correct node to take the place of the old root node.",
    not_right: "That's not quite right.",
    not_child_active: "\nAre you choosing a child of the node you're trying to swap?",
    not_bigger_swap_active: "\nIs the child node you're trying to swap larger than its parent?",
    not_last_pos_insert_active: "\nAre you choosing the left-most position on the current row of the heap?",
    wrong_new_root_active: "\nAre you choosing the right-most node on the last row of the heap?",
    not_largest_child_active: "\nDid you choose the node's largest child?",
    unordered_insert_active: "\nCan you see any child nodes greater than their parents?\nDrag the child to the position of the parent to swap them.",
    wrong_del_root_active: "\nWhich node always gets deleted in a heap?"
}
const elementList = []

function Element({ id, contents }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",//ToDo: use enums instead of string eventually
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    return (<div className="ar-el-bare" ref={drag}>{contents}</div>);
}

//NTS index in tree is NOT equal to element id throughout, only at beginnign

//React loads twice, so need to make sure list is only created once
let arrayCreated = false;
function createArray() {
    if (arrayCreated === false) {
        arrayCreated = true
        let length = Math.floor((Math.random() * 10) + 6);// generates a number between 6 and 15 ((max-min +1) + min)
        for (let i = 0; i < length; i++) {
            elementList.push({
                id: i + 1,
                contents: Math.floor(Math.random() * 9) +1
            });
        }
        console.log("length " + elementList.length);
        console.log(elementList);
        return elementList;
    }
}

const treeSetUp = () => {
    let result = [];
    createArray();
    console.log(elementList);
    result.push({});
    for (let i = 1; i <= elementList.length; i++) {
        result.push({
            id: i,
            contents: "",
            ref: undefined
        });
    }
    return result;
}

//just store tree as an array and imply level in tree and parents with maths
//instead of dragging elements, why not get user to click where they should go, if they get it right, the element is displayed there.
//if they think tree needs rearranging, they can drag elements to swap them?
//we have a function that calculates what tree should look like and compare it to what the user came up with
function Heap() {
    const [tipText, setTipText] = useState(feedback["insert_click"]);
    const [tree, setTree] = useState(treeSetUp());
    const [topArray, setTopArray] = useState(elementList);//useState([,]);//Code doesn't like this w/o comma
    const [arIndex, setArIndex] = useState(0);//start at 1 or 0?
    const [mode, setMode] = useState("insertion");
    const [cMistakes, setCMistakes] = useState(0);//mistakes made on the user's current task
    const [tMistakes, setTMistakes] = useState(0);//overall mistakes made
    const [done, setDone] = useState(false);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }),
        [mode, arIndex, cMistakes, tMistakes])//add tree to this and ifx out the id index mystery (wasn't updating state properly before hence hwy got differen things)

    const dropElementD = (indexOfDropped) => {
        console.log("Deletion drop " + indexOfDropped);
    }

    function dropElement(indexOfDropped) {
        let currentMis = cMistakes;
        let indexOfTarget = tree.findIndex(el => el.ref === drop);
        console.log("dropped : " + indexOfDropped + " target : " + indexOfTarget);
        //insertion mode
        if (mode ==="insertion") {
            if (indexOfTarget === Math.floor(indexOfDropped / 2)) {
                if (tree[indexOfDropped].contents > tree[indexOfTarget].contents) {
                    setTMistakes(tMistakes + currentMis);
                    setCMistakes(0);

                    let swapNodeDropped = tree[indexOfDropped];
                    let swapNodeTarget = tree[indexOfTarget];
                    let newTree = tree;
                  
                    newTree[indexOfDropped] = swapNodeTarget;
                    newTree[indexOfDropped].ref = undefined;
                    newTree[indexOfTarget] = swapNodeDropped;
                    setTree(newTree);
                    needToReorder(indexOfTarget)//was index of dropped but they've swapped now
                    console.log("ar index: " + arIndex + " ele len: " + elementList.length);

                    if (isTreeComplete() && arIndex === elementList.length) {
                        setMode("deletion");//not updating soon neough, uh oh! might need to move :/
                        setTopArray([,]);
                        setTipText(feedback["delete"]);
                        console.log("deletion time");
                        console.log("just set mode in drop: " + mode);
                    }
                }
                else {
                    let active = "";
                    if (currentMis > 0) {
                        active = feedback["not_bigger_swap_active"];
                    }
                    setTipText(feedback["not_right"] + active);
                    setCMistakes(currentMis + 1);
                }
            }
            else {
                let active = "";
                if (currentMis > 0) {
                    active = feedback["not_child_active"];
                }
                setTipText(feedback["not_right"] + active);
                setCMistakes(currentMis + 1);
            }
        }
        else if (mode ==="deletion") {
            console.log("indexOfDropped " + indexOfDropped);
            let droppedIndex = tree.findIndex(el => el.id === indexOfDropped);
            let x = tree.findIndex(el => el.id === indexOfDropped);
            console.log("dropped index" + droppedIndex);
            //User needs to drag the last element in the heap to be the new root
            if (tree[1].contents === " ") {
                if (droppedIndex === tree.length - 1) {
                    setTMistakes(tMistakes + currentMis);
                    setCMistakes(0);

                    let newTree = tree;
                    let newRoot = tree[droppedIndex];
                    newRoot.ref = drop;
                    newTree[1] = newRoot;
                    //this is causing issue! trying to access when out of bounds!
                    if (tree.length === 3) {
                        if (newRoot.contents < tree[2].contents) {
                            setTipText(feedback["sift"] + tree[1].contents + ".");
                        }
                    }
                    else if (newRoot.contents < tree[2].contents || newRoot.contents < tree[3].contents) {
                        setTipText(feedback["sift"] + tree[1].contents + ".");
                    }
                    else {
                        setTipText(feedback["correct_no_sift"]);
                    }
                    newTree.pop();
                    if (newTree.length === 2) {
                        setTipText(feedback["delete"]);
                    }
                    setTree(newTree);
                //delete last node from heap
                //make left/right child a drop?
                }
                else {
                    let active = "";
                    if (currentMis > 0) {
                        active = feedback["wrong_new_root_active"];
                    }
                    setTipText(feedback["not_right"] + active);
                    setCMistakes(currentMis + 1);
                }
            }
            //We're sifitng root down
            else if (tree[1].contents) {
                if (indexOfTarget === Math.floor(droppedIndex / 2)) {
                    //if that was the biggest child, then swap. otherwise tell user that they have to choose biggest child
                    //if dropped index odd, its a left child otherwise its right
                    let sibling = droppedIndex + 1;
                    if (droppedIndex % 2 !== 0) {
                        sibling = droppedIndex - 1;
                    }
                    console.log("tree.length: " + tree.length);
                    //If node has a sibling...
                    if (sibling < tree.length) {
                        //and sibling's contents are greater than the node the user dragged, we need to correct them
                        if (tree[sibling].contents > tree[droppedIndex].contents) {
                            let active = "";
                            if (currentMis > 0) {
                                active = feedback["not_largest_child_active"];
                            }
                            setTipText(feedback["not_right"] + active);
                            setCMistakes(currentMis + 1);
                            return;
                        }

                    }
                    //User chose the correct node to swap
                    setTMistakes(tMistakes + currentMis);
                    setCMistakes(0);

                    let swapNodeDropped = tree[droppedIndex];
                    let swapNodeTarget = tree[indexOfTarget];

                    let newTree = tree;
                    newTree[droppedIndex] = swapNodeTarget;
                    newTree[droppedIndex].ref = undefined;
                    newTree[indexOfTarget] = swapNodeDropped;
                    setTree(newTree);
                    setTipText(feedback["delete"]);
                    //console.log(droppedIndex);
                    //console.log(indexOfTarget);
                    needToReorder(droppedIndex);
                }
                else {
                    let active = "";
                    if (currentMis > 0) {
                        active = feedback["not_child_active"];
                    }
                    setTipText(feedback["not_right"] + active);
                    setCMistakes(currentMis + 1);
                }
            }
        }
        else {
            console.log("whoopsie");//ToDo: be more profesh
        }
        

    }
    

    const array = () => {
        const result = [];
        if (mode === "insertion") {
            result.push(
                <>
                    {
                        topArray.map(element => {
                            return (
                                <div className="ar-el-container">
                                    <Element contents={element.contents} id={element.id} />
                                </div>
                            )
                        })
                    }
                </>
            );  
        }
        else {//deletion mode
            topArray.map(element => {
                result.push(
                    <div className="ar-el-container">
                        <Element contents={element.contents} id={element.id} />
                    </div>
                )
            });
            let blanksLeft = elementList.length - (topArray.length - 1);
            //console.log(blanksLeft);
            for (let i = 0; i < blanksLeft; i++) {
                //console.log("i: "+i);
                result.push(
                    <div className="ar-el-container">
                        <Element contents=" " id="" />
                    </div>
                )
            }

        } 

        return (
            <div className="array-heap">
                {result}
            </div>
        );
    }

    const heapAndTips = () => {
        const result = [];
        result.push(
            <>
                <div className="under-ar">
                    <div className="heap-container">
                        {array()}
                        {displayHeap()}
                    </div>
                    <div className="heap-text-container">
                        { tipText }
                    </div>
                </div>
            </>
        );

        return (
            result
        );
    }

    //In mathematical terms, a "complete" max-heap means that no child node is greater than its parent.
    //It doesn't necessarily mean that it is "complete" as in all array elements are now in the tree
    //Todo: rename to say it checks all parents are bigegr than children! not technically chekcing if complete cos spots might be missing in deletion
    const isTreeComplete = () => {
        //console.log("arr index " + arIndex);
        for (let i = 2; i <= tree.length-1; i++) {
            //console.log("i: " + tree[i].contents + "    i/2: " + tree[Math.floor(i / 2)].contents)
            if (tree[i].contents > tree[Math.floor(i / 2)].contents) {
                return false;
            }
        }
        return true;
    }
    //Return true if the tree needs rearranging, false if not
    const needToReorder = (index) => {
        //console.log(mode);
        if (mode === "insertion") {
            if (index === 1) {
                setTipText(feedback["insert_click"]);
                return false;//Only one node in tree so no need to reorder
            }
            //can i get out of bounds below?? check if this code needs error checking 
            else if (tree[index].contents > tree[Math.floor(index / 2)].contents) {
                setTipText(feedback["reorder"]);
                let newTree = tree;
                newTree[Math.floor(index / 2)].ref = drop;
                setTree(newTree);
                console.log(newTree);
                return true;
            }
            else {
                setTipText(feedback["insert_click"]);
                return false;
            }
        }
        else {//deletion mode
            //add error checking, maybe make its own function because repetition from "dropElement"
            if (tree[index].contents < tree[index * 2].contents || tree[index].contents < tree[(index * 2) +1].contents) {
                setTipText(feedback["reorder"]);
                let newTree = tree;
                newTree[Math.floor(index)].ref = drop;
                setTree(newTree);
                //console.log(newTree);
                return true;
            }
        }
    }
    //"I" for insertion phase
    const onNodeClickI = (index) => {
        let currentMis = cMistakes;
        //checking the user filled in the correct node (binary tree needs to be "complete" for heapsort algorithm)
        let treeComplete = isTreeComplete();
        console.log(treeComplete);
        //User clicked correct position
        if (index - 1 === arIndex && treeComplete) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            let newContents = elementList[arIndex].contents;
            let oldTree = tree;
            tree.findIndex((el) => (el.index))
            let newTree = tree;
            newTree[index].contents = newContents;//using position in array since we're just filling out tree
            setTree(newTree);
            let newArray = topArray;
            newArray[arIndex].contents = "";
            setTopArray(newArray);
            setArIndex(arIndex + 1);

            setTipText(feedback["insert_click"]);
            
            //Need to check that the child is less than parent (so it's a valid max heap);
            //console.log(tree);
            needToReorder(index);

        }
        else if (!isTreeComplete()) {
            let active = "";
            if (currentMis > 0) {
                active = feedback["unordered_insert_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
        }
        else {
            let active = "";
            if (currentMis > 0) {
                active = feedback["not_last_pos_insert_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
        }
        //Is all of the array in the heap? If so, time for deletion phase
        if (isTreeComplete() && arIndex === elementList.length - 1) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            setMode("deletion");
            setTopArray([,]);
            setTipText(feedback["delete"]);
        }
    }

    //"D" for deletion phase
    const onNodeClickD = (index) => {
        //console.log("on click " + mode);
        console.log(isTreeComplete());
        let currentMis = cMistakes;
        //User has finished task
        if (index === 1 && tree.length == 2) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            let newTopArray = topArray;
            console.log("c: " + tree[1].contents + " id: " + tree[1].id);
            newTopArray.push(tree[1]);
            setTopArray(newTopArray);
            let newTree = tree;
            newTree.pop();
            setTree(newTree);
            setDone(true);
        }
        //User deleted the correct node (root)
        if (index === 1 && isTreeComplete()) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            let newTopArray = topArray;
            newTopArray.push(tree[1]);
            setTopArray(newTopArray);
            let newTree = tree;
            newTree[1] = {
                id: "", contents: " ", ref: drop
            };
            setTree(newTree);
            setTipText(feedback["drag_new_root"]);
        }
        //User deleted wrong node
        else {
            let active = "";
            if (currentMis > 0) {
                active = feedback["wrong_del_root_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
        }
    }

    const nodeDisplay = (i) => {
        let result = [];
        if (i > tree.length-1) {//Out of bounds so display nothing
            return result;
        }
        //Tree is ordered and its time to delete root
        if (mode === "deletion" && isTreeComplete()) {
            //deletion mode (getting ordered array)
            //console.log(tree[i].ref);//delete root then drag node that should take its place? then drag around
            result.push(
                <button className="btn-circle" onClick={() => onNodeClickD(i)} ref={tree[i].ref }>
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </button>)
        }
        //We're in deletion phase but the heap needs reordering
        else if (mode === "deletion") {
            result.push(
                <div className="circle" ref={tree[i].ref} >
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </div>
            )
        }
        //Still filling up heap
        else {
            //If node has contents, display
            //NTS, IS INDEX CORRECT HERE? COULD CAUSE WEIRD ERRORS SO KEEP LOOK OUT
            //console.log("tree ref: " + tree[i].ref);
            if (tree[i].contents) {
                result.push(
                    <div className="circle" ref={tree[i].ref}>
                        <Element contents={tree[i].contents} id={tree[i].id} />
                    </div>
                )
            }
            //If 1 has no content, we want to display it as a button (can't lump it in with children like below because root has no children)
            else if (i === 1) {
                result.push(<button className="btn-circle-empty" onClick={() => onNodeClickI(i)}></button>)
            }
            //If the node's parent is showing, display node as grey button
            else if (i / 2 >= 1) {
                if (tree[Math.floor(i / 2)].contents) {
                    result.push(<button className="btn-circle-empty" onClick={() => onNodeClickI(i)}></button>)
                }
            }
        }
        
        return (result); 
    }

    const nodeLines = (start, end) => {
        let leftLine = true;
        let result = [];
        for (let i = start; i <= end; i++) {
            //console.log(tree.length);
            if (i > tree.length - 1) {//Node isn't on display so line shouldn't be either
                result.push(
                    <>
                        <div className="flex-container" />
                        <div className="flex-container" />
                    </>
                );
            }
            else if (!tree[Math.floor(i/2)].contents) {
                result.push(
                    <>
                        <div className="flex-container" />
                        <div className="flex-container" />
                    </>
                );
            }
            else if (leftLine) {
                result.push(
                    <>
                        <div className="flex-container" />
                        <div className="flex-container"><div className="line-left" /></div>
                    </>
                );
                leftLine = false;
            }
            else {
                result.push(
                    <>
                        <div className="flex-container"><div className="line-right" /></div>
                        <div className="flex-container" />
                    </>
                );
                leftLine = true;
            }

        }
        return (<div className="flex-container">
            {result} 
        </div>);
    }

    const displayHeap = () => {//need way to determine nodes in deletion mode
        //root should be a button (to delete node an dadd to main array), then should be able to drag latest elemnt to root and shift stuff
        let result = [];

        
            //insertion mode
            result.push(
                <div className="heap-div">
                    {nodeDisplay(1)}
                </div>

            );

            result.push(
                <>
                    {nodeLines(2,3)}

                    <div className="flex-container">
                        <div className="heap-div">{nodeDisplay(2)}</div>
                        <div className="heap-div">{nodeDisplay(3)}</div>
                    </div>

                    {nodeLines(4, 7)}

                    <div className="flex-container">
                        <div className="heap-div">{nodeDisplay(4)}</div>
                        <div className="heap-div">{nodeDisplay(5)}</div>
                        <div className="heap-div">{nodeDisplay(6)}</div>
                        <div className="heap-div">{nodeDisplay(7)}</div>
                    </div>

                    {nodeLines(8, 15)}

                    <div className="flex-container">
                        <div className="heap-div">{nodeDisplay(8)}</div>
                        <div className="heap-div">{nodeDisplay(9)}</div>
                        <div className="heap-div">{nodeDisplay(10)}</div>
                        <div className="heap-div">{nodeDisplay(11)}</div>
                        <div className="heap-div">{nodeDisplay(12)}</div>
                        <div className="heap-div">{nodeDisplay(13)}</div>
                        <div className="heap-div">{nodeDisplay(14)}</div>
                        <div className="heap-div">{nodeDisplay(15)}</div>
                    </div>
                </>
            )
        
        
        return result;
        
    }
    const pageContents = () => {
        if (done) {
            if (tMistakes === 0) {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Heap Sort</h1>
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
            else if (tMistakes === 1) {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Heap Sort</h1>
                        </div>
                        <div className="end-screen-heap">
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
            else if (tMistakes < 5) {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Heap Sort</h1>
                        </div>
                        <div className="end-screen-heap">
                            <h2>Good job</h2>
                            You only made {tMistakes} mistakes, why not practice again and get it down to 0?
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
            else {
                return (
                    <>
                        <div className="header-small">
                            <h1 className="title-ppt-style-small">Heap Sort</h1>
                        </div>
                        <div className="end-screen-heap">
                            <h2>Good try</h2>
                            You made {tMistakes} mistakes, practice again and see if you can improve!
                        </div>
                    </>
                );
            }
        }
        else {
            return (
                <>
                    <div className="header-small">
                        <h1 className="title-ppt-style-small">Heap Sort</h1>
                    </div>
                    <div className="stage">
                        {heapAndTips()}

                    </div>
                </>
            );
        }
    }

    return (
        <>
            <div id="outer-container">
                <SideMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'} algorithm="heap" />
                <div id="page-wrap">
                    {pageContents()}

                </div>
            </div>
        </>
    );
}
export default Heap;