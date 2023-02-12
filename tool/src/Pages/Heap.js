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

//just store tree as an array and imply level in tree and parents with maths

function Heap() {
    const [treeContents, setTreeContents] = useState([]);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (element) => dropElement(element.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const dropElement = (id) => {
        const latestElement = elementList.filter((element) => id === element.id);
        console.log(latestElement);
        let oldTree = treeContents;
        /*setTreeContents(oldTree.map(
            el => ((el.index === id) ? Object.assign(el, { index: el.index, contents: el.contents }) : el)
        ));*/
        setTreeContents(treeContents => [...treeContents, latestElement[0]]);
        console.log("new tree array: " + treeContents);
        //allow user to drag element to build tree
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
                        <div className="heap-div">
                            <div className="circle" ref={drop}></div>
                        </div>
                    </div>
                <div className="heap-text-container"></div>
                </div>
            </>
        );

        return (
            result
        );
    }

    const displayHeap = () => {
        //for each element in state array, display in correct div
        for (let i = 1; i < treeContents.length; i++) {
            <div className="circle">{treeContents[i].contents}</div>
        }
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