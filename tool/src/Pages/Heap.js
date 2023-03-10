import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import Confetti from 'react-confetti'
//import Tree from 'react-d3-tree';

//not usre we need this anymore
/*function TreeStruct({ datatata }) {
    //ToDo: Translate needs to dynamically know size of div and translate to half of it (to centre tree)
    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div className="tree-wrapper" style={{ width: '300em', height: '1000em' }}>
            <Tree
                data={orgChart}
                pathFunc="straight"
                orientation="vertical"
                zoomable={false}
                draggable={false}
                translate={{ x: 500, y: 25 }}
            />
        </div>
    );
}
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

//When user needs to switch node position, that should be text tip until they've done it

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
    }/*,
    {
        id: 6,
        contents: 10
    },
    {
        id: 7,
        contents: 2
    },

    {
        id: 8,
        contents: 1
    },

    {
        id: 9,
        contents: 1
    }*/
]

//ToDo:customise this for heap (number with no box) 
function Element({ id, contents }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",//ToDo: use enums instead of string eventually
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    //should item disappear while being dragged? i rekon so
    return (<div className="ar-el-bare" ref={drag}>{contents}</div>);//style={{ "backgroundColor": isDragging ? "grey" : "none" }
}

//NTS index in tree is NOT equal to element id throughout, only at beginnign

//Need to empty array as tree is built

const treeSetUp = () => {
    let result = [];
    if (false) {//Temp!!!!: testing mode for deletion
        result.push({});
        result.push({
            id: 5,
            contents: 8,
            ref: undefined
        });
        result.push({
            id: 1,
            contents: 6,
            ref: undefined
        });
        result.push({
            id: 6,
            contents: 7,
            ref: undefined
        });
        result.push({
            id: 4,
            contents: 1,
            ref: undefined
        });
        result.push({
            id: 2,
            contents: 5,
            ref: undefined
        });
        result.push({
            id: 3,
            contents: 3,
            ref: undefined
        });
        result.push({
            id: 7,
            contents:2,
            ref: undefined
        });
        result.push({
            id: 8,
            contents: 1,
            ref: undefined
        });
        result.push({
            id: 9,
            contents: 1,
            ref: undefined
        });

    }
    else {
        result.push({});
        for (let i = 1; i <= elementList.length; i++) {
            result.push({
                id: i,
                contents: "",
                ref: undefined
            });
        }
    }
    return result;
}

//just store tree as an array and imply level in tree and parents with maths
//instead of dragging elements, why not get user to click where they should go, if they get it right, the element is displayed there.
//if they think tree needs rearranging, they can drag elements to swap them?
//we have a function that calculates what tree should look like and compare it to what the user came up with
function Heap() {
    const [tipText, setTipText] = useState("Click the position in the heap where the next element from the array should go.");
    const [tree, setTree] = useState(treeSetUp());
    const [topArray, setTopArray] = useState(elementList);//useState([,]);//Code doesn't like this w/o comma
    const [arIndex, setArIndex] = useState(0);//start at 1 or 0?
    const [mode, setMode] = useState("insertion")//temp!!!Change to start as insertion after we've finished coding deletion
    const [done, setDone] = useState(false);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }),
    [mode, arIndex])//add tree to this and ifx out the id index mystery (wasn't updating state properly before hence hwy got differen things)

    /*useEffect(() => {
        setTipText("Click the node that should be deleted from the heap and added to the new ordered array");
        console.log("mode in effects: " + mode);
        
    }, [mode]);*/

    const dropElementD = (indexOfDropped) => {
        console.log("Deletion drop " + indexOfDropped);
    }

    function dropElement(indexOfDropped){
        let indexOfTarget = tree.findIndex(el => el.ref === drop);
        console.log("mode in drop: " + mode);
        console.log("dropped : " + indexOfDropped + " target : " + indexOfTarget);
        //insertion mode
        if (mode ==="insertion") {
            if (indexOfTarget === Math.floor(indexOfDropped / 2) && tree[indexOfDropped].contents > tree[indexOfTarget].contents) {
                //console.log("Valid af!");

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
                    setTipText("Click the node that should be deleted from the heap and added to the ordered array.");
                    console.log("deletion time");
                    console.log("just set mode in drop: " + mode);
                }
            }
            else {
                console.log("not valid");
            }
        }//not setting to deletion mode in here when you shoudl?
        else if (mode ==="deletion") {//changed this from mode==="deletion";
            //NTS: big yikes, not index but id now, what is happening? it gave index in insertion mode!
            //target index still correct cos it just looks for chichever element has drop ref and retuns that index :)
            console.log("indexOfDropped " + indexOfDropped);
            let droppedIndex = tree.findIndex(el => el.id === indexOfDropped);
            let x = tree.findIndex(el => el.id === indexOfDropped);

            //console.log(tree);
            console.log("dropped index" + droppedIndex);
            //User needs to drag the latest element to be the new root
            if (tree[1].contents === " ") {
                if (droppedIndex === tree.length - 1) {
                    console.log("valid deletion mode drop");
                    let newTree = tree;
                    let newRoot = tree[droppedIndex];
                    newRoot.ref = drop;
                    newTree[1] = newRoot;
                    //this is causing issue! trying to access when out of bounds!
                    if (tree.length === 3) {
                        if (newRoot.contents < tree[2].contents) {
                            setTipText("That's right!\nNow the root needs sifting down the heap to maintiain the following property: " +
                                "\n~A child node cannot be larger than a parent node~" +
                                "\nDrag the largest child of the root to replace " + tree[1].contents + ".");
                        }
                    }
                    else if (newRoot.contents < tree[2].contents || newRoot.contents < tree[3].contents) {
                        setTipText("That's right!\nNow the root needs sifting down the heap to maintiain the following property: " +
                            "\n~A child node cannot be larger than a parent node~" +
                            "\nDrag the largest child of the root to replace " + tree[1].contents + ".");
                    }
                    else {
                        setTipText("That's right! \nAlso, the new root is not smaller than its children so the heap does not need sifting.\nClick the node that should be deleted next.");
                    }
                    newTree.pop();
                    if (newTree.length === 2) {
                        setTipText("That's right! \nNow click the node that should be deleted from the heap and added to the sorted array.");
                    }
                    setTree(newTree);
                //delete last node from heap
                //make left/right child a drop?
                }
                else {
                    setTipText("That's not quite right. \nAre you choosing the node in the last position of the heap?");
                }
            }
            //We're sifitng root down
            else if (tree[1].contents) {
                console.log("Got to sifting down logic");
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
                            setTipText("That 's not quite right. \nDid you choose the root's largest child?");
                            return;
                        }

                    }
                    //User chose the correct node to swap
                    let swapNodeDropped = tree[droppedIndex];
                    let swapNodeTarget = tree[indexOfTarget];

                    let newTree = tree;
                    newTree[droppedIndex] = swapNodeTarget;
                    newTree[droppedIndex].ref = undefined;
                    newTree[indexOfTarget] = swapNodeDropped;
                    setTree(newTree);
                    setTipText("That's right! \nNow click the node that should be deleted from the heap and added to the sorted array.");
                    //console.log(droppedIndex);
                    //console.log(indexOfTarget);
                    needToReorder(droppedIndex);
                }
                else {
                    setTipText("That's not quite right. \nAre you choosing a child of the node you're trying to swap?")
                    //ToDo: Seems to give this even when not true, fix!

                    //Also! make sure user can keep deleting and sifting till the end, broken atm 
                }
            }
        }
        else {
            console.log("whoopsie");//ToDo: be more profesh
        }
        

    }
    

    const array = () => {
        const result = [];
        //console.log("arra: " + mode);
        if (mode === "insertion") {//temp!!!!! change so there's a state that maintains what should appear in this array
            //shouldn't be element list! just temporary. If numbers aren't in array (been removed) should still maintain each posiition so we see empty array properly
            //need to make ar-el-container a drag target during deletion process?? Or should user just becale to click the node they want to delete?
            //console.log(elementList);
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
                setTipText("Click the position in the heap where the next element from the array should go.");
                return false;//Only one node in tree so no need to reorder
            }
            //can i get out of bounds below?? check if this code needs error checking 
            else if (tree[index].contents > tree[Math.floor(index / 2)].contents) {
                setTipText("That's right! \nNow the heap needs reordering to hold the property: \n~A child node cannot be larger than a parent node~." +
                    "\nDrag the invalid child node to the position of its parent to swap the two.");
                let newTree = tree;
                newTree[Math.floor(index / 2)].ref = drop;
                setTree(newTree);
                console.log(newTree);
                return true;
            }
            else {
                setTipText("Click the position in the heap where the next element from the array should go.");//tell them to click where next thing should go unless array all in tree now, then tell them to delete a node?
                return false;
            }
        }
        else {//deletion mode
            //add error checking, maybe make its own function because repetition from "dropElement"
            if (tree[index].contents < tree[index * 2].contents || tree[index].contents < tree[(index * 2) +1].contents) {
                setTipText("That's right! Looks like you need to switch nodes to hold the property: \n'A child node cannot be larger than a parent node'");
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
        //checking the user filled in the correct node (binary tree needs to be "complete" for heapsort algorithm)
        let treeComplete = isTreeComplete();
        console.log(treeComplete);
        if (index - 1 === arIndex && treeComplete) {
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

            setTipText("Click the position in the heap where the next element from the array should go.");
            
            //Need to check that the child is less than parent (so it's a valid max heap);
            //console.log(tree);
            needToReorder(index);

        }
        else if (!isTreeComplete()) {
            setTipText("That's not quite right. \nCan you see any child nodes greater than their parents?\nDrag the child to the position of the parent to swap them.");
        }
        else {
            setTipText("That's not quite right. \nAre you choosing the next available position in the heap?");
        }
        if (isTreeComplete() && arIndex === elementList.length - 1) {
            setMode("deletion");//not updating soon neough, uh oh! might need to move :/
            setTopArray([,]);
            setTipText("Click the node that should be deleted from the heap and added to the new ordered array.");
            console.log("deletion time");
           // console.log("mode in  clikc: " + mode);
        }
    }

    //"D" for deletion phase
    const onNodeClickD = (index) => {
        //console.log("on click " + mode);
        console.log(isTreeComplete());
        if (index === 1 && tree.length == 2) {
            let newTopArray = topArray;
            console.log("c: " + tree[1].contents + " id: " + tree[1].id);
            newTopArray.push(tree[1]);
            setTopArray(newTopArray);
            let newTree = tree;
            newTree.pop();
            setTree(newTree);
            setTipText("Well done, the array is fully sorted");
            setDone(true);
            //This isn't working, could just redirect them to an end screen?
        }
        if (index === 1 && isTreeComplete()) {//it has to be largest element in array!
            console.log("woop");
            let newTopArray = topArray;
            newTopArray.push(tree[1]);
            setTopArray(newTopArray);
            let newTree = tree;
            newTree[1] = {
                id: "", contents: " ", ref: drop
            };
            //newTree[1].ref = drag
            setTree(newTree);
            //console.log(tree.length);
            setTipText("That's right! \nDrag the correct node to take the place of the old root node.");
        }
        else {
            setTipText("That's not quite right. \nWhich node always gets deleted in a heap?");
        }
    }
    //need to empty array as tree gets filled?
    //need an arrow or colour pointing to element in array being placed in tree
    //Weird: grey looks smaller than black cirlce
    const nodeDisplay = (i) => {
        let result = [];
        if (i > tree.length-1) {//out of bounds
            return result;
        }
        //Tree is ordered and its time to delete root
        //console.log(tree);
        if (mode === "deletion" && isTreeComplete()) {
            //deletion mode (getting ordered array)
            //console.log(tree[i].ref);//delete root then drag node that should take its place? then drag around
            result.push(
                <button className="circle" onClick={() => onNodeClickD(i)} ref={tree[i].ref }>
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
                result.push(<button className="circle-grey" onClick={() => onNodeClickI(i)}></button>)
            }
            //If the node's parent is showing, display node as grey button
            else if (i / 2 >= 1) {
                if (tree[Math.floor(i / 2)].contents) {
                    result.push(<button className="circle-grey" onClick={() => onNodeClickI(i)}></button>)
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
            return (
                <>
                    <h1>Well Done!!!!</h1>
                    <div className="stage">
                        <Confetti recycle={false} numberOfPieces="100" />
                        <button><a className="homeButton" href="/">Home</a></button>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <h1>Heap Sort</h1>
                    <div className="stage">
                        {array()}
                        {heapAndTips()}

                    </div>
                </>
            );
        }
    }

    return (
        <>
            {pageContents()}
        </>
    );
}
export default Heap;