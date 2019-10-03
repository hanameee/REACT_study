import React, { Component } from "react";
import "./App.css";
import UserInput from "./UserInput/UserInput";
import UserOutput from "./UserOutput/UserOutput";
import { id } from "postcss-selector-parser";

class App extends Component {
    state = {
        clicked: 0,
        users: [
            { name: "Hannah", id: 1 },
            { name: "Jeongho", id: 2 },
            { name: "Kwanhun", id: 3 }
        ]
    };

    clickHandler = e => {
        console.log(e.target.id);
        this.setState({
            clicked: e.target.id
        });
    };

    nameChangedHandler = event => {
        this.setState({
            users: { name: event.target.value, id: this.state.clicked }
        });

        // this.setState({
        //     users: [
        //         { name: event.target.value, id: 1 },
        //         { name: "Jeongho", id: 2 },
        //         { name: "Kwanhun", id: 3 }
        //     ]
        // });
    };

    render() {
        return (
            <div className="App">
                <UserInput
                    name={this.state.users[0].name}
                    changed={this.nameChangedHandler}
                />
                <UserOutput
                    name={this.state.users[0].name}
                    id={this.state.users[0].id}
                    clicked={this.clickHandler}
                />
                <UserOutput
                    name={this.state.users[1].name}
                    id={this.state.users[1].id}
                    clicked={this.clickHandler}
                />
                <UserOutput
                    name={this.state.users[2].name}
                    id={this.state.users[2].id}
                    clicked={this.clickHandler}
                />
            </div>
        );
    }
}

export default App;
