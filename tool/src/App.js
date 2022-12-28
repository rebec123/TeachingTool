import React from "react";
import './App.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import About from "./Pages/About";


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            algoChoice: "none",
            contentChoice: "none"
        };
        /*this._onButtonClick = this._onButtonClick.bind(this);*/
    }

    onMergeClick() {
        this.setState({ algoChoice: "merge" },
            () => alert(this.state.algoChoice) );
    }

    render() {
        return (
            <div>
                <button onClick={() => { this.onMergeClick() }} >{/*className="btn-primary"*/}
                    Merge Sort
                </button>
                <button onClick={() => { this.onMergeClick() }}>
                    Heap Sort
                </button>
                <button onClick={() => { this.onMergeClick() }}>
                    About
                </button>
            </div>
        );
    }
}
function App() {
  return (
      <div className="App">
          <h1>App Name</h1>
          <Menu />
      </div>
  );
}

export default App;
