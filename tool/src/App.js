import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import About from "./Pages/About";
import Merge from "./Pages/Merge";
import Heap from "./Pages/Heap";
import MergeInfo from "./Pages/MergeInfo";
import HeapInfo from "./Pages/HeapInfo";

//Different menu options as js equivalent of contants
const Algorithm = Object.freeze({
    None: Symbol("none"),
    Merge: Symbol("merge"),
    Heap: Symbol("heap"),
    About: Symbol("about")
})

function Menu() {
    const [algoChoice, setAlgoChoice] = useState(Algorithm.None);
    const [redirect, setRedirect] = useState(null);

    const onMergeClick = () => {
        setAlgoChoice(Algorithm.Merge);
        setRedirect("/Merge");
    }

    const onHeapClick = () => {
        setAlgoChoice(Algorithm.Heap);
        setRedirect("/Heap");
    }

    const onAboutClick = () => {
        setAlgoChoice(Algorithm.About);
        setRedirect("/About");
    }

    //Buttons to allow user to nav to different page
    const selection = () => {
        console.log("Algo choice: " + algoChoice.toString());
        if (algoChoice === Algorithm.None) {
            return (
                <div>
                    <button className="btn-menu" onClick={() => { onMergeClick() }} >
                        Merge Sort
                    </button>
                    <br/>
                    <button className="btn-menu" onClick={() => { onHeapClick() }}>
                        Heap Sort
                    </button>
                    <br />
                    <button className="btn-menu" onClick={() => { onAboutClick() }}>
                        About
                    </button>

                </div>
            );
        }
        return;
    }

    //Called when user has selected the page they want to go to
    const redirectPage = () => {
        let result = [];
        if (redirect) {

            result.push(<Navigate to={redirect} />);
        }
        return result;
    }

    return (
        <>
            <div className="flex-stage">
            <div className="header">
                <h1 className="title-ppt-style">Practice Sorting Algorithms</h1>
            </div>
            </div>
            <div>
                {redirectPage()}
                {selection()}
            </div>

        </>
    );
}

//Routes of the app and react DnD info
function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
            <Router>
              <Routes>
                  <Route exact path="/" element={<Menu/>} />
                  <Route exact path="/About" element={<About />} />
                  <Route exact path="/Merge" element={<Merge />} />
                        <Route exact path="/Heap" element={<Heap />} />
                        <Route exact path="/Merge-Info" element={<MergeInfo />} />
                        <Route exact path="/Heap-Info" element={<HeapInfo />} />
              </Routes>
            </Router>
            </div>
        </DndProvider>
    );
}

export default App;
