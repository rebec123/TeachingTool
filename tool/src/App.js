import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import About from "./Pages/About";
//import Menu from "./Pages/Menu";
import Merge from "./Pages/Merge";
import Heap from "./Pages/Heap";

const Algorithm = Object.freeze({
    None: Symbol("none"),
    Merge: Symbol("merge"),
    Heap: Symbol("heap")
})

const ContentType = Object.freeze({
    None: Symbol("none"),
    Demo: Symbol("demo"),
    Easy: Symbol("easy"),
    Hard: Symbol("hard")
})

function Menu() {
    const [algoChoice, setAlgoChoice] = useState(Algorithm.None);
    const [contentChoice, setContentChoice] = useState(ContentType.None);
    const [redirect, setRedirect] = useState(null);

    const onMergeClick = () => {
        //this.setState({ madeAlgoChoice: true, algoChoice: Algorithm.Merge }, () => { console.log(this.madeAlgoChoice) });
        setAlgoChoice(Algorithm.Merge);
    }

    const onHeapClick = () => {
        //this.setState({ algoChoice: Algorithm.Heap, madeAlgoChoice: true }, () => { console.log(this.madeAlgoChoice) });
        setAlgoChoice(Algorithm.Heap);
    }

    const onAboutClick = () => {
        setRedirect({ redirect: "/About" });

    }

    const onDemoClick = () => {
        setRedirect(ContentType.Demo);

    }

    const onEasyClick = () => {
        setContentChoice(ContentType.Easy);
        //console.log(this.algoChoice);
        if (algoChoice === Algorithm.Merge) {
            setRedirect("/Merge");
        }
        else if (algoChoice === Algorithm.Heap) {
            setRedirect("/Heap");
        }
    }

    const onHardClick = () => {
        setContentChoice(ContentType.Hard);
    }

    const selection1 = () => {
        console.log("Algo choice: " + algoChoice.toString());
        if (algoChoice === Algorithm.None) {
            return (
                <div>
                    <button onClick={() => { onMergeClick() }} >
                        Merge Sort
                    </button>
                    <button onClick={() => { onHeapClick() }}>
                        Heap Sort
                    </button>
                    <button onClick={() => { onAboutClick() }}>
                        About
                    </button>

                </div>
            );
        }
        return;
    }

    const selection2 = () => {
        if (algoChoice !== Algorithm.None) {
            return (
                <div>
                    <button onClick={() => { onDemoClick() }} >
                        Demo
                    </button>
                    <button onClick={() => { onEasyClick() }}>
                        Easy Practice
                    </button>
                    <button onClick={() => { onHardClick() }}>
                        Hard Practice
                    </button>

                </div>
            );
        }
        else {
            return;
        }
    }

    const redirectPage = () => {
        let result = [];
        if (redirect) {

            result.push(<Navigate to={redirect} />);
        }
        return result;
    }

    //Do not forget brackets when calling functions in return!!!
    return (
        <>
            <h1>Hello!</h1>
            <div>
                {redirectPage()}
                {selection1()}
                {selection2()}

            </div>

        </>
    );
}

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
                  {/*<Route path="*" element={<NoPage />} />*/}
              </Routes>
            </Router>
            </div>
        </DndProvider>
    );
}

export default App;
