import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
//import Tree from 'react-d3-tree';

/*const orgChart = {
    name: '1',
    children: [
        {
            name: '2',
            children: [
                {
                    name: '4',
                },
                {
                    name: '5',
                },
            ],
        },
        {
            name: '3',
            children: [
                {
                    name: '6',
                },
                {
                    name: '7',
                },
            ]

        },
    ],
};
function TreeStruct({ datatata }) {
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
    return (<div className="ar-el-bare" ref={drag} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);
}

const treeSetUp = () => {
    let result = [];
    result.push({});
    for (let i = 1; i <= elementList.length; i++) {
        result.push({
            index: i,
            contents: ""
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
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const dropElement = (id) => {
        console.log("hi");

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

    const needToReorder = () => {

    }

    const onNodeClick = (i) => {
        //checking the user filled in the correct node (binary tree needs to be "complete" for heapsort algorithm)
        if (i-1 === arIndex) {
            let newContents = elementList[arIndex].contents;
            let oldTree = tree;
            setTree(oldTree.map(
                el => (el.index === i ? Object.assign(el, { contents: newContents }) : el)
            ));
            setArIndex(arIndex + 1);
            setTipText("Click where you think the next element in the array should go");
            //Need to check that the child is less than parent (so it's a valid max heap);
            if (needToReorder()) {
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
        if (tree[i].contents) {
            result.push(<div className="circle"> {tree[i].contents} </div>)
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
        let i = 1;
        //console.log(tree);
        result.push(
            <div className="heap-div" ref={drop}>
                {nodeDisplay(i)}
            </div>

        );

        result.push(
            <>
                <div className="heap-div" ref={drop}>
                    <div className="heap-div">{nodeDisplay(2)}</div>
                    <div className="heap-div">{nodeDisplay(3)}</div>
                </div>

                <div className="heap-div" ref={drop}>
                    <div className="heap-div">{nodeDisplay(4)}</div>
                    <div className="heap-div">{nodeDisplay(5)}</div>
                    <div className="heap-div">{nodeDisplay(6)}</div>
                    <div className="heap-div">{nodeDisplay(7)}</div>
                </div>
            </>
        )
        /*if (tree[id].contents) {
            return (
                <>
                    <div className="heap-div" ref={drop}>
                        <div className="circle"> {tree[id].contents} </div>
                    </div>
                    <div className="heap-div" ref={drop}>
                        <div className="heap-div">
                            <button className="circle-grey" onClick={() => onNodeClick(2)}></button>
                        </div>
                        <div className="heap-div">
                            <button className="circle-grey" onClick={() => onNodeClick(3)}></button>
                        </div>
                    </div>
                </>
            );
        }
        else {
            return (
                <div className="heap-div" ref={drop}>
                    <button className="circle-grey" onClick={() => onNodeClick(id)}></button>
                </div>
            );
        }*/
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