import React from "react";
import { useDrag } from "react-dnd";

/*function Element({ id, contents }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "single-element",//ToDo: use enums instead of string eventually
        item: {id:id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    return (<div className="array-element" ref={ drag } style={{ "backgroundColor": isDragging ? "grey" : "white" }}>{ contents }</div>);
}

export default Element;*/
