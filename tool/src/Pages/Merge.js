//import React, { useState } from "react";
import React from "react";
//import Element from "../Components/Element";
import { useDrop, useDrag } from "react-dnd";
//import { toBeVisible } from "../../node_modules/@testing-library/jest-dom/dist/to-be-visible";

/*const algorithm = ["mergeSort(A)", "If array length > 1", "Split the array in to two halves: S1 and S2",
    "call mergeSort(S1)", "call mergeSort(S2)", "call merge(S1, S2, A)", "\n", "merge(S1, S2, A)",
    "i = 0, j = 0, k = 0", "while (i < p and j < q)", "if S1[i] <= S2[j]", "A[k] = S1[i]", "i = i + 1", "else", "A[k] = S2[j]", "j = j + 1",
    "k = k + 1", "if i = p", "Copy S2[j,…, q - 1] to A", "else", "Copy S1[i,…, p - 1] to A"];*/
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

function Element({ id, contents }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",//ToDo: use enums instead of string eventually
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    return (<div className="array-element" ref={drag} style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{contents}</div>);
}

class Merge extends React.Component {
    constructor(props) {
        super(props);
        //GOOD TO KNOW: page is re-rendered everything you set state
        //do not change state INSIDE render, because you will get stuck in endless loop and hang!
        this.state = {
            title: "Merge Sort",
            visibleDivs: [1],
            //title: "Merge Sort",
            ordered: [] //an array of divs containing arrays that are ordered (including single-element arrays which are ordered by definition)
        }; 
    }

    //Given a div (a position in the graph formed by splitting an array in half recursively), this
    //function returns the array elements that should be in that sub array
    getElementsByDiv(div) {
        let parentLen = 0;
        let lowerBound = 0;
        let upperBound = 0;
        let parent = [];
        let elementCount = elementList.length;
        if (div === 1) {
            return elementList;
        }
        else if (div === 2) {
            return elementList.filter(element => element.id <= (Math.ceil(elementCount / 2)));
        }
        else if (div === 3) {
            return elementList.filter(element => element.id > (Math.ceil(elementCount / 2)));
        }
        else if (div === 4) {
            parentLen = Math.ceil(elementCount / 2);
            upperBound = Math.ceil(parentLen / 2);
            return elementList.filter(element => element.id <= upperBound);
        }
        else if (div === 5) {
            parentLen = Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(parentLen / 2);
            upperBound = Math.ceil(elementCount / 2);
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (div === 6) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2);
            upperBound = lowerBound + Math.ceil(parentLen / 2);
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (div === 7) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2) + Math.ceil(parentLen / 2);
            upperBound = lowerBound + (parentLen - Math.ceil(parentLen / 2));
            return elementList.filter(element => element.id > lowerBound && element.id <= upperBound);
        }
        else if (7 < div < 32) {
            let divHalved = div / 2;
            parent = this.getElementsByDiv(Math.floor(divHalved));
            if (divHalved - Math.floor(divHalved) === 0) {
                return this.getChildLeft(parent);    
            }
            else if (divHalved - Math.floor(divHalved) === 0.5) {
                return this.getChildRight(parent);
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
    getChildLeft(parent) {
        if (parent.length === 1) {
            return [];
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

    //code totally freaks out when this added :( just trying to make array of divs that are ready to merge
    //The when a parent sees its two children are ready, the merge code can be triggered

    //Given an array (the parent), this function returns the children that would appear
    //To the right of the array (the right half of the array's elements)
    getChildRight(parent) {
        if (parent.length === 1) {
            return [];
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

    //Idea: when new elements added to ordered, check every time if ready to merge
    isMergePossible() {
        if (this.state.ordered.includes(16) && this.state.ordered.includes(17)) {
            return true;
        }
        return false;
    }

    //Given a parent div, this function adds the index of the two children divs to a state array "visibleDivs"
    //VisibleDivs are the divs that are visible to the user (e.g. after user has split div 1, they can see it's children: div 2 and 3)
    onSplitClick(div) {
        //children are div*2 and div*2+1
        let newlyVisible = [];
        let newOrdered = [];
        let canMerge = false;
        let newTitle = "Merge Sort ;p"
        if (!this.state.visibleDivs.includes(div * 2)) {
            newlyVisible.push(div * 2);
            if (this.getElementsByDiv(div * 2).length === 1) {
                newOrdered.push(div * 2);
            }
        }
        if (!this.state.visibleDivs.includes((div * 2) + 1)) {
            newlyVisible.push((div * 2) + 1);
            if (this.getElementsByDiv((div * 2)+1).length === 1) {
                newOrdered.push((div * 2)+1);
            }
        }

        canMerge = this.isMergePossible();
        if (canMerge) {
            newTitle = "Can Merge!!!!";
        }

        this.setState({
            visibleDivs: [...this.state.visibleDivs, ...newlyVisible],
            ordered: [...this.state.ordered, ...newOrdered],
            title: newTitle
        },
            () => console.log(this.state.ordered),   
        );
        
    }

    row1 = () => {
        const result = [];
        for (let i = 2; i < 4; i++) {
            let elements = this.getElementsByDiv(i);
            if (this.state.visibleDivs.includes(i)) {
                result.push(
                    <div className="array-and-div">
                        <div className="array-split">
                            {
                                elements?.map((element) => {
                                    return <Element contents={element.contents} id={element.id} />
                                })
                            }
                        </div>
                        <button className="split" onClick={() => this.onSplitClick(i)} >split</button>
                    </div>

                );
            }
            else {//we still need to fill up the space where the array will go (to keep the layout intact)
                result.push(<div className="array-and-div"/>);
            }
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    row2 = () => {
        const result = [];
        for (let i = 4; i < 8; i++) {
            let elements = this.getElementsByDiv(i);
            if (this.state.visibleDivs.includes(i)) {
                result.push(
                    <div className="array-and-div">
                        <div className="array-split">
                            {
                                elements?.map((element) => {
                                    return <Element contents={element.contents} id={element.id} />
                                })}
                        </div>
                        <button className="split" onClick={() => { this.onSplitClick(i) }} >split</button>
                    </div>
                );
            }
            else {
                result.push(<div className="array-and-div" />);
            }
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    row3 = () => {
        const result = [];
        for (let i = 8; i < 16; i++) {
            let elements = this.getElementsByDiv(i);
            let addSplit = "";
            if (elements.length > 1) {
                addSplit = <button className="split" onClick={() => { this.onSplitClick(i) }} >split</button>;
            }
            if (this.state.visibleDivs.includes(i)) {
                result.push(
                    <div className="array-and-div">
                        <div className="array-split">
                            {
                                elements?.map((element) => {
                                    return <Element contents={element.contents} id={element.id} />
                                })}
                        </div>
                        {addSplit}
                    </div>
                );
            }
            else {
                result.push(<div className="array-and-div" />);
            }
        }
        return (
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    row4 = () => {//Note: didn't add split buttons beacuse length should be max 1 so don't need to split furthur
        const result = [];
        for (let i = 16; i < 32; i++) {
            let elements = this.getElementsByDiv(i);
            if (this.state.visibleDivs.includes(i)) {
                result.push(
                    <div className="array-and-div">
                        <div className="array-split">
                            {
                                elements?.map((element) => {
                                    return <Element contents={element.contents} id={element.id} />
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
            <div className="sub-stage">
                {result}
            </div>
        );
    }

    render() {
        return (
            <>
                <h1>{this.state.title}</h1>
                <div className="stage">
                    <div className="sub-stage">
                        <div className="array">{ elementList.map((element) => {
                        return <Element contents={element.contents} id={ element.id }/>
                        })}
                    </div>
                    </div>
                    <button className="split" onClick={() => { this.onSplitClick(1) }} >split</button>
                    {this.row1()}
                    {this.row2()}
                    {this.row3()}
                    {this.row4()}
                </div>
            </>
        );
    }
}

/*function Merge() {
    const [array, setArray] = useState([]);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "single-element",
        drop: (item) => addElementToArr(item.id), we set a sub array as "focused" aqnd thats the array users can rearrange?
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))
    //use this for user swapping positions of elements in array
    const addElementToArr = (id) => {
        const latestElement = elementList.filter((element) => id === element.id);
        //setArray((array) => [...array, latestElement[0]]); //adds multiple elements into array
        setArray([latestElement[0]]); //only one element in array
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
                <button className="split" onClick={() => { splitClick() }} >split</button>
                {row1()}
                {row2()}
                {row3()}
                {row4()}
                <div className="element-target" ref={ drop }>Add to merge class!!!!!!!!!!!!!!!!
                    {array.map((element) => {
                        return <Element contents={element.contents} id={element.id} />
                    })}
                </div>
            </div>
        </>
    );
}*/

export default Merge;
