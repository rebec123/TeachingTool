import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
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
}*/

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
    },

    {
        id: 6,
        contents: 7
    }
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

//This is seperate function because it's allows us to have multiple active drop targets at once
/*function DropTarget({ targetID, contents, handleDropFunct }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id, targetID),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const dropElement = (droppedID, targetID) => {
        handleDropFunct(droppedID, targetID);
        //setTipText("heyooooooo");

    }
    return (
        <div className="circle" ref={drop}>
            <Element contents={contents} id={targetID} />
        </div>
    )
}*/

//NTS index in tree is NOT equal to element id throughout, only at beginnign

const treeSetUp = () => {
    let result = [];
    if (true) {//Temp!!!!: testing mode for deletion
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
    const [tipText, setTipText] = useState("Click where you think the next element in the array should go");
    const [tree, setTree] = useState(treeSetUp());
    const [topArray, setTopArray] = useState([,]);//Code doesn't like this w/o comma
    const [arIndex, setArIndex] = useState(0);//start at 1 or 0?
    const [dropTarget, setDropTarget] = useState(0);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const dropElement = (indexOfDropped) => {
        let indexOfTarget = tree.findIndex(el => el.ref === drop);

        console.log("dropped : " + indexOfDropped + " target : " + indexOfTarget);
        //insertion mode
        if (arIndex === elementList.length) {
            if (indexOfTarget === Math.floor(indexOfDropped / 2) && tree[indexOfDropped].contents > tree[indexOfTarget].contents) {
                console.log("Valid af!");

                let swapNodeDropped = tree[indexOfDropped];
                let swapNodeTarget = tree[indexOfTarget];

                let newTree = tree;
                newTree[indexOfDropped] = swapNodeTarget;
                newTree[indexOfDropped].ref = undefined;
                newTree[indexOfTarget] = swapNodeDropped;
                setTree(newTree);
                console.log(tree);
                console.log(indexOfTarget);
                //setTipText("You swapped " + tree[indexOfTarget].contents + " and " + tree[indexOfDropped].contents);//We need to change something in this Heap component so page refreshes and we see reult of swappign nodes
                needToReorder(indexOfTarget)//was index of dropped but they've swapped now
            }
            else {
                console.log("not valid");
            }
        }
        else {//deletion mode
            if (tree[1].contents === " " && indexOfDropped === elementList.length - 1) {
                console.log("valid deletion mode drop");
            }
            else {
                console.log("wut");
            }
        }
        

    }
    

    const array = () => {
        const result = [];
        if (true) {//temp!!!!! change so there's a state that maintains what should appear in this array
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
        else {

            //shouldn't be element list! just temporary. If numbers aren't in array (been removed) should still maintain each posiition so we see empty array properly
            //need to make ar-el-container a drag target during deletion process?? Or should user just becale to click the node they want to delete?
            //console.log(elementList);
            result.push(
                <>
                    {
                        elementList.map(element => {
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
    const isTreeComplete = () => {
        //console.log("arr index " + arIndex);
        for (let i = 2; i <= arIndex; i++) {
            if (tree[i].contents > tree[Math.floor(i / 2)].contents) {
                return false;
            }
        }
        return true;
    }
    //Return true if the tree needs rearranging, false if not
    const needToReorder = (index) => {
        console.log(tree);
        if (index === 1) {
            setTipText("Click stuff innit");
            return false;//Only one node in tree so no need to reorder
        } //can i get out of bounds below?? check if this code needs error checking 
        else if (tree[index].contents > tree[Math.floor(index / 2)].contents) {
            setTipText("Looks like you need to switch nodes to hold the property: \n'A child node cannot be larger than a parent node'");
            let newTree = tree;
            newTree[Math.floor(index / 2)].ref = drop;
            setTree(newTree);
            console.log(newTree);
            return true;
        }
        else {
            setTipText("Click stuff innit");//tell them to click where next thing should go unless array all in tree now, then tell them to delete a node?
            return false;
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
            /*setTree(oldTree.map(
                el => (el.id === i ? Object.assign(el, { contents: newContents }) : el)
            ));*/
            setArIndex(arIndex + 1);
            //Is this right?????
            if (arIndex === elementList.length && isTreeComplete()) {
                setTipText("Click the node that should be deleted from the heap and added to the new ordered array");
            }
            else {
                setTipText("Click where you think the next element in the array should go");
            }
            //Need to check that the child is less than parent (so it's a valid max heap);
            //console.log(tree);
            if (needToReorder(index)) {//dont forget to pass this method args you numpty!
                //reorder time!
            }
            
        }
        else {
            setTipText("That's not the next position, try again.");
        }
    }

    //NTS: if page isnt rerendering immediatile, slice(); is a little hack :) assing new var slice of old stae var

    //"D" for deletion phase
    const onNodeClickD = (index) => {
        if (index === 1) {
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
            if (true) {
                setTipText("Drag the correct node to take the place of the old root node.");
            }
            //set tree root to nothing or smthing?
        }
        else {
            setTipText("That is not the element that should be deleted next, try again");
        }
    }
    //need to empty array as tree gets filled?
    //need an arrow or colour pointing to element in array being placed in tree
    //Weird: grey looks smaller than black cirlce
    const nodeDisplay = (i) => {
        let result = [];
        if (i > elementList.length) {//out of bounds
            return result;
        }
        //temp!!!!!!!!! replace 6 with arIndex
        //Tree is ordered and its time to delete root
        if (6 === elementList.length && isTreeComplete()) {
            //deletion mode (getting ordered array)
            //console.log(tree);//delete root then drag node that should take its place? then drag around
            result.push(
                <button className="circle" onClick={() => onNodeClickD(i)} ref={tree[i].ref }>
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </button>)
        }
        //We're in deletion phase but the heap needs reordering
        //temp!!!!!!!!! replace 6 with arIndex
        else if (6 === elementList.length) {
            result.push(
                <div className="circle" ref={tree[i].ref} >
                    <Element contents={tree[i].contents} id={tree[i].id} />
                </div>
            )
        }
        //Still filling up heap
        else {
            //If node has contents, display
            //NOT TO SELF, IS INDEX CORRECT HERE? COULD CAUSE WEIRD ERRORS SO KEEP LOOK OUT
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
                    <div className="heap-div">
                        <div className="heap-div">{nodeDisplay(2)}</div>
                        <div className="heap-div">{nodeDisplay(3)}</div>
                    </div>

                    <div className="heap-div">
                        <div className="heap-div">{nodeDisplay(4)}</div>
                        <div className="heap-div">{nodeDisplay(5)}</div>
                        <div className="heap-div">{nodeDisplay(6)}</div>
                        <div className="heap-div">{nodeDisplay(7)}</div>
                    </div>
                </>
            )
        
        
        return result;
        
    }

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
export default Heap;