import React from "react";
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
import Merge from "./Pages/Merge";

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            madeAlgoChoice: false,
            algoChoice: "none",
            contentChoice: "none",
            redirect: null
        };
    }

    onMergeClick() {
        this.setState({ algoChoice: "merge", madeAlgoChoice: true });
    }

    onHeapClick() {
        this.setState({ algoChoice: "heap", madeAlgoChoice: true });
    }

    onAboutClick() {
        this.setState({ redirect: "/About" });//ToDo:add thing to go back to algo selection menu on about page

    }

    onDemoClick() {
        this.setState({ contentChoice: "demo" });

    }

    onEasyClick() {
        this.setState({ contentChoice: "easy" });
        this.setState({ redirect: "/Merge" });
    }

    onHardClick() {
        this.setState({ contentChoice: "hard" });
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }
        if (!this.state.madeAlgoChoice) {
            return (
                <div>
                    <button onClick={() => { this.onMergeClick() }} >{/*className="btn-primary"*/}
                        Merge Sort
                    </button>
                    <button onClick={() => { this.onHeapClick() }}>
                        Heap Sort
                    </button>
                    <button onClick={() => { this.onAboutClick() }}>
                        About
                    </button>

                </div>
            );
        }
        if (this.state.madeAlgoChoice) {
            return (
                <div>
                    <button onClick={() => { this.onDemoClick() }} >
                        Demo
                    </button>
                    <button onClick={() => { this.onEasyClick() }}>
                        Easy Practice
                    </button>
                    <button onClick={() => { this.onHardClick() }}>
                        Hard Practice
                    </button>

                </div>
            );
        }
    }
}

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
            <h1>App Name</h1>
            <Router>
              <Routes>
                  <Route exact path="/" element={<Menu/>} />
                  <Route exact path="/About" element={<About />} />
                  <Route exact path="/Merge" element={<Merge />} />
                  {/*<Route path="*" element={<NoPage />} />*/}
              </Routes>
            </Router>
            </div>
        </DndProvider>
    );
}

export default App;
