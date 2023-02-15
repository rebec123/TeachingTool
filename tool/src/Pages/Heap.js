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
function DropTarget({ targetID, contents, handleDropFunct }) {
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
}

//NTS index in tree is NOT equal to element id throughout, only at beginnign

const treeSetUp = () => {
    let result = [];
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
    const [tipText, setTipText] = useState("Click where you think the next element in the array should go");
    const [tree, setTree] = useState(treeSetUp());
    const [arIndex, setArIndex] = useState(0);//start at 1 or 0?
    /*const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const dropElement = (id) => {
        console.log("hi");
        setTipText("heyooooooo");

    }*/

    function handleDrop(droppedID, targetID) {
        //Swap tree nodes if its a valid swap (nodes are child and parent, childs contents are greater than parents)
        console.log("dropped : " + droppedID + " target : " + targetID);
        if (targetID === Math.floor(droppedID / 2) && tree[droppedID].contents > tree[targetID].contents) {
            console.log("Valid af!");

            //finding index of "dropped" element in tree
            let indexOfDropped = tree.findIndex(el => el.id === droppedID);
            console.log("Found dropped index " + indexOfDropped);
            let swapNodeDropped = tree[indexOfDropped];

            //finding index of "target" element in tree
            let indexOfTarget = tree.findIndex(el => el.id === targetID);
            console.log("Found target index " + indexOfTarget);
            let swapNodeTarget = tree[indexOfTarget];

            //Swapping the elements in tree
            let newTree = tree;
            newTree[indexOfDropped] = swapNodeTarget;
            newTree[indexOfTarget] = swapNodeDropped;
            setTree(newTree);
            setTipText("You swapped " + tree[indexOfTarget].contents + " and " + tree[indexOfDropped].contents);//We need to change something in this Heap component so page refreshes and we see reult of swappign nodes

            //add code here to check if the result of that swap means we need to do another swap! don't let user continue until root is largest element
            needToReorder(indexOfTarget)//was index of target but they've swapped now
        }
        else {
            console.log(tree);
        }
    }
    

    const array = () => {
        //shouldn't be element list! just temporary. If numbers aren't in array (been removed) should still maintain each posiition so we see empty array properly
        //need to make ar-el-container a drag target during deletion process?? Or should user just becale to click the node they want to delete?
        const result = [];
        //console.log(elementList);
        result.push(
            <>
                <div className="array-heap">
                {
                    elementList.map(element => {
                        return (
                            <div className="ar-el-container">
                                <Element contents={element.contents} id={element.id} />
                            </div>
                        )
                    })
                }
                </div>
            </>
        );

        return (
            result
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

    //Return true if the tree needs rearranging, false if not
    const needToReorder = (i) => {
        if (i === 1) {
            return false;//Only one node in tree so no need to reorder
        } //can i get out of bounds below?? check if this code needs error checking 
        else if (tree[i].contents > tree[Math.floor(i / 2)].contents) {
            let oldTree = tree;
            //add logic here to initiate swap stuff??? careful of infinite loops from set state
            //node parent = target, child = draggable. Do we need to add bool properties to state tree (draggable and target)
            setTipText("Looks like you need to switch nodes to hold the property: \n'A child node cannot be larger than a parent node'");
            
            return true;
        }
        else {
            return false;
        }
    }

    const onNodeClick = (i) => {
        //checking the user filled in the correct node (binary tree needs to be "complete" for heapsort algorithm)
        if (i-1 === arIndex) {
            let newContents = elementList[arIndex].contents;
            let oldTree = tree;
            tree.findIndex((el) => (el.index))
            let newTree = tree;
            newTree[i].contents = newContents;//using position in array since we're just filling out tree
            setTree(newTree);
            /*setTree(oldTree.map(
                el => (el.id === i ? Object.assign(el, { contents: newContents }) : el)
            ));*/
            setArIndex(arIndex + 1);
            setTipText("Click where you think the next element in the array should go");
            //Need to check that the child is less than parent (so it's a valid max heap);
            //console.log(tree);
            if (needToReorder(i)) {//dont forget to pass this method args you numpty!
                //reorder time!
                
            }
        }
        else {
            setTipText("That's not the next position, try again.");
        }
    }
    //Weird: grey looks smaller than black cirlce
    const nodeDisplay = (i) => {
        let result = [];
        if (i > elementList.length) {
            //setArIndex(0);//cant set here- infinite re renders :( - but do need to set somewhere!
            //set screen to deletetion mode or somthing! (all inserts are finished, time to delete)
            return result;
        }
        //If node has contents, display
        //NOT TO SELF, IS INDEX CORRECT HERE? COULD CAUSE WEIRD ERRORS SO KEEP LOOK OUT
        //console.log("tree ref: " + tree[i].ref);
        if (tree[i].contents) {
            result.push(
                <DropTarget contents={tree[i].contents} targetID={tree[i].id} handleDropFunct={handleDrop} />//dropRef={drop}
            )
        }
        //If 1 has no content, we want to display it as a button (can't lump it in with children like below because root has no children)
        else if (i === 1) {
            result.push(<button className="circle-grey" onClick={() => onNodeClick(i)}></button>)
        }
        //If the node's parent is showing, display node as grey button
        else if (i / 2 >= 1) {
            if (tree[Math.floor(i / 2)].contents) {
                result.push(<button className="circle-grey" onClick={() => onNodeClick(i)}></button>)
            }
        }
        return (result); 
    }

    const displayHeap = () => {
        let result = [];
        //console.log(tree);
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