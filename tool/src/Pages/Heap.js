import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import Confetti from 'react-confetti'
import SideMenu from '../Components/SideMenu';
import "./Heap.css";

//A dictionary of feedback
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

//The array being sorted
const elementList = []

//An element of the array/heap that is draggable
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

//React loads twice, so need to make sure list is only created once
let arrayCreated = false;
//Randomly generates an array between 6 and 15 elements. Elements range from 1-10
function createArray() {
    if (arrayCreated === false) {
        arrayCreated = true
        let length = Math.floor((Math.random() * 10) + 6);//((max-min +1) + min)
        for (let i = 0; i < length; i++) {
            elementList.push({
                id: i + 1,
                contents: Math.floor(Math.random() * 9) + 1//((max-min +1) + min)
            });
        }
        return elementList;
    }
}

//Filling the heap with empty nodes
const treeSetUp = () => {
    let result = [];
    createArray();
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

function Heap() {
    const [tipText, setTipText] = useState(feedback["insert_click"]);
    const [tree, setTree] = useState(treeSetUp());//The tree (heap) structure represented as an array of objects
    const [topArray, setTopArray] = useState(elementList);//The arrays being sorted
    const [arIndex, setArIndex] = useState(0);//Current index of array
    const [mode, setMode] = useState("insertion");//Indicates if user is populating tree or deleting
    const [cMistakes, setCMistakes] = useState(0);//Mistakes made on the user's current task
    const [tMistakes, setTMistakes] = useState(0);//Overall mistakes made
    const [done, setDone] = useState(false);//When user finishes the full practice, this is true
    const [{ isOver }, drop] = useDrop(() => ({//Code for drag and drop
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }),
        [mode, arIndex, cMistakes, tMistakes])

    //This is called when an element is dropped (during a drag and drop action)
    //It checks if the swap was valid and determines the next steps based off the result
    function dropElement(indexOfDropped) {
        let currentMis = cMistakes;
        let indexOfTarget = tree.findIndex(el => el.ref === drop);

        //Insertion mode
        if (mode === "insertion") {
            //If dragged element was a child node
            if (indexOfTarget === Math.floor(indexOfDropped / 2)) {
                //...and dragged element was greater than parent
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
                    needToReorder(indexOfTarget)//Check if tree needs reordering

                    //If every array element has been added to the heap, put into deletion mode
                    if (isTreeCorrect() && arIndex === elementList.length) {
                        setMode("deletion");
                        setTopArray([,]);
                        setTipText(feedback["delete"]);
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
        //Deletion mode
        else if (mode ==="deletion") {
            let droppedIndex = tree.findIndex(el => el.id === indexOfDropped);
            let x = tree.findIndex(el => el.id === indexOfDropped);
            //User needs to drag the last element in the heap to be the new root
            if (tree[1].contents === " ") {
                if (droppedIndex === tree.length - 1) {
                    setTMistakes(tMistakes + currentMis);
                    setCMistakes(0);

                    let newTree = tree;
                    let newRoot = tree[droppedIndex];
                    newRoot.ref = drop;
                    newTree[1] = newRoot;

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
                }
                //User chose the wrong node as the new root
                else {
                    let active = "";
                    if (currentMis > 0) {
                        active = feedback["wrong_new_root_active"];
                    }
                    setTipText(feedback["not_right"] + active);
                    setCMistakes(currentMis + 1);
                }
            }
            //Root needs sifting down the heap
            else if (tree[1].contents) {
                if (indexOfTarget === Math.floor(droppedIndex / 2)) {
                    //If that was the largest child node, then swap
                    //Otherwise, give user feedback
                    //If dropped index is odd, it's a left child otherwise it's right
                    let sibling = droppedIndex + 1;
                    if (droppedIndex % 2 !== 0) {
                        sibling = droppedIndex - 1;
                    }
                    //If node has a sibling...
                    if (sibling < tree.length) {
                        //...and sibling's contents are greater than the node the user dragged, we need to correct them
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

                    //Check if tree needs reordering
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
            console.log("Invalid mode");
        }
    }

    //Displaying the array
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
        else {//Deletion mode
            topArray.map(element => {
                result.push(
                    <div className="ar-el-container">
                        <Element contents={element.contents} id={element.id} />
                    </div>
                )
            });
            //Making sure array positions stay even when when some indexes are (temporarily) empty
            let blanksLeft = elementList.length - (topArray.length - 1);
            for (let i = 0; i < blanksLeft; i++) {
                result.push(
                    <div className="ar-el-container">
                        <Element contents=" " id="" />
                    </div>
                )
            }

        } 

        return (
            <div className="array">
                {result}
            </div>
        );
    }

    //Display the heap visualisation and the feedback
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

    //Checking no child nodes are greater than parent nodes.
    const isTreeCorrect = () => {
        for (let i = 2; i <= tree.length-1; i++) {
            if (tree[i].contents > tree[Math.floor(i / 2)].contents) {
                return false;
            }
        }
        return true;
    }

    //Returns true if the tree needs rearranging, false if not
    const needToReorder = (index) => {
        if (mode === "insertion") {
            //If there's only one node in tree so no need to reorder
            if (index === 1) {
                setTipText(feedback["insert_click"]);
                return false;
            }
            //If child "i" is greater than parent, need to reorder
            else if (tree[index].contents > tree[Math.floor(index / 2)].contents) {
                setTipText(feedback["reorder"]);
                let newTree = tree;
                newTree[Math.floor(index / 2)].ref = drop;
                setTree(newTree);
                return true;
            }
            //Don't need to reorder
            else {
                setTipText(feedback["insert_click"]);
                return false;
            }
        }
        else {//Deletion mode
            //If either child is greater than parent, need to reorder
            if (tree[index].contents < tree[index * 2].contents || tree[index].contents < tree[(index * 2) +1].contents) {
                setTipText(feedback["reorder"]);
                let newTree = tree;
                newTree[Math.floor(index)].ref = drop;
                setTree(newTree);
                return true;
            }
        }
    }
    //Called when a node is clicked in (insertion mode). Checks if it is a valid position to add node to heap
    const onNodeClickI = (index) => {
        let currentMis = cMistakes;
        //Checking the user filled in the correct node (need to fill in left-most node on last row)
        let treeComplete = isTreeCorrect();
        //If user clicked correct position, put the element form the array into that node position
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
            
            //Checking if tree needs reordering
            needToReorder(index);

        }
        //Tree is not correct, can't insert any new nodes till it's rearranged
        else if (!isTreeCorrect()) {
            let active = "";
            if (currentMis > 0) {
                active = feedback["unordered_insert_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
        }
        //User chose wrong position
        else {
            let active = "";
            if (currentMis > 0) {
                active = feedback["not_last_pos_insert_active"];
            }
            setTipText(feedback["not_right"] + active);
            setCMistakes(currentMis + 1);
        }
        //Is all of the array in the heap? If so, time for deletion phase
        if (isTreeCorrect() && arIndex === elementList.length - 1) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            setMode("deletion");
            setTopArray([,]);
            setTipText(feedback["delete"]);
        }
    }

    //Called when a node is clicked in (deletion mode). Checks if user deleted root
    const onNodeClickD = (index) => {
        let currentMis = cMistakes;
        //User deleted the last node and has finished task
        if (index === 1 && tree.length == 2) {
            setTMistakes(tMistakes + currentMis);
            setCMistakes(0);

            let newTopArray = topArray;
            newTopArray.push(tree[1]);
            setTopArray(newTopArray);

            let newTree = tree;
            newTree.pop();
            setTree(newTree);
            setDone(true);
        }
        //User deleted the correct node (root), so make the root empty and a drop target
        if (index === 1 && isTreeCorrect()) {
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

    //Given an index in the heap "i", determine how to display the node (button, normal, or empty)
    const nodeDisplay = (i) => {
        let result = [];
        if (i > tree.length-1) {//Out of bounds so display nothing
            return result;
        }
        //Tree is filled and ordered, make node a deletion candidate
        if (mode === "deletion" && isTreeCorrect()) {
            result.push(
                <button className="btn-circle" onClick={() => onNodeClickD(i)} ref={tree[i].ref }>
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </button>)
        }
        //In deletion phase but the heap needs reordering, so display nodes as normal (not buttons)
        else if (mode === "deletion") {
            result.push(
                <div className="circle" ref={tree[i].ref} >
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </div>
            )
        }
        //Still populating heap
        else {
            //If node has contents, then display it
            if (tree[i].contents) {
                result.push(
                    <div className="circle" ref={tree[i].ref}>
                        <Element contents={tree[i].contents} id={tree[i].id} />
                    </div>
                )
            }
            //If 1 has no content, we want to display it as a button (can't give it same logic as children like below because root has no children)
            else if (i === 1) {
                result.push(<button className="btn-circle-empty" onClick={() => onNodeClickI(i)}></button>)
            }
            //If the node's parent is showing, display this node position as a button (an insertion candidate)
            else if (i / 2 >= 1) {
                if (tree[Math.floor(i / 2)].contents) {
                    result.push(<button className="btn-circle-empty" onClick={() => onNodeClickI(i)}></button>)
                }
            }
        }
        return (result); 
    }

    //The diagonal lines that connect nodes in the heap visualisation
    const nodeLines = (start, end) => {
        let leftLine = true;
        let result = [];
        for (let i = start; i <= end; i++) {
            //If node isn't on display, line shouldn't be either
            if (i > tree.length - 1) {
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
            //Its a left child
            else if (leftLine) {
                result.push(
                    <>
                        <div className="flex-container" />
                        <div className="flex-container"><div className="line-left" /></div>
                    </>
                );
                leftLine = false;//Setting to false so will do right line next
            }
            //Its a right child
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

    //Displaying the heap visualisation
    const displayHeap = () => {
        let result = [];
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

    //Determines if should display end screen (because user finished the task) or the practice screen (task is ongoing)
    const pageContents = () => {
        //If user completed the task, show end screen
        if (done) {
            //User made 0 mistakes total (they get more confetti)
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
            //User made 1 mistake
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
            //User made 5 or less mistakes
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
            //User made 5+ mistakes, no confetti
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
                        <div className="stage">
                            <a className="homeButton" href="/">
                                <button className="btn-back">Home</button>
                            </a>
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