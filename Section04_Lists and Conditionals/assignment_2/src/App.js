import React, { Component } from "react";
import "./App.css";
import ValidationComponent from "./validationComponent";
import CharComponent from "./charComponent";
import charComponent from "./charComponent";

class App extends Component {
    state = {
        length : null,
        input : []
    };

    inputChangeListener = event => {
        let input = event.target.value;
        this.setState({
            length : input.length,
            //string에는 바로 map을 못쓰니, split으로 array화 시켜준다
            input : input.split("")
        });
    };

    deleteCharHandler = (index) => {
      let newInput = [...this.state.input];
      newInput.splice(index,1);
      this.setState({input : newInput})
    }

    render() {
        let charComponents = (
        <div>
            {this.state.input.map((char, index) => {
                return (
                    <CharComponent
                        click = {() => this.deleteCharHandler(index)}
                        char = {char}
                    />
                );
            })}
        </div>
        )
        return (
            <div className="App">
                <input className="input" type="text" onChange={this.inputChangeListener} />
                <p>{this.state.length}</p>
                <ValidationComponent length={this.state.length} />
                {charComponents}
            </div>
        );
    }
}

export default App;
