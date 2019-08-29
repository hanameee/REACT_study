import React, { Component } from "react"; //왜 component는 괄호 안에?
// import React, { useState } from "react"; // useState react Hook 사용하려구! (위에거 주석처리)
import "./App.css";
import Person from "./Person/Person";
import Radium, { StyleRoot } from "radium";

// 원래 예제에서 사용했던 classed based component
class App extends Component {
    //state는 reserved word 임
    state = {
        persons: [
            { id: "001", name: "Max", age: 28 },
            { id: "002", name: "Hannah", age: 25 },
            { id: "003", name: "Jeongho", age: 26 }
        ],
        showPersons: false
    };

    deletePersonHandler = personIndex => {
        const persons = [...this.state.persons];
        persons.splice(personIndex, 1);
        this.setState({ persons: persons });
    };

    nameChangedHandler = (event, id) => {
        const personIndex = this.state.persons.findIndex(p => {
            return p.id === id;
        });

        const person = {
            //this.state.persons[personIndex] 라고 하면 원래 object를 mutate하는 거니까!
            //spread operator을 사용해서 항상 복사본으로, Immutable 하게.
            ...this.state.persons[personIndex]
        };

        //alternative approach - depreciated
        // const person = Object.assign({}, this.state.persons[personIndex]);

        person.name = event.target.value;

        const persons = [...this.state.persons];
        //변경된 person을 복사본 persons array에 update 해준다
        persons[personIndex] = person;
        this.setState({ persons: persons });
    };

    togglePersonsHandler = () => {
        const doesShow = this.state.showPersons;
        this.setState({
            showPersons: !doesShow
        });
    };

    render() {
        const style = {
            backgroundColor: "green",
            color: "white",
            font: "inherit",
            padding: "4px",
            margin: "10px",
            cursor: "pointer",
            ":hover": {
                backgroundColor: "lightgreen",
                color: "black"
            }
        };

        let persons = null;

        if (this.state.showPersons) {
            persons = (
                <div>
                    {this.state.persons.map((person, index) => {
                        return (
                            <Person
                                click={() => this.deletePersonHandler(index)}
                                name={person.name}
                                age={person.age}
                                key={person.id}
                                changed={event =>
                                    this.nameChangedHandler(event, person.id)
                                }
                            />
                        );
                    })}
                </div>
            );

            style.backgroundColor = "red";
            style[":hover"] = {
                backgroundColor: "salmon",
                color: "black"
            };
        }

        const classes = [];

        if (this.state.persons.length <= 2) {
            classes.push("red");
        }

        if (this.state.persons.length <= 1) {
            classes.push("bold");
        }

        return (
            <StyleRoot>
                <div className="App">
                    <p className={classes.join(" ")}>
                        I change my class depending on persons array length!
                    </p>
                    <button style={style} onClick={this.togglePersonsHandler}>
                        Toggle Namecard
                    </button>
                    {persons}
                </div>
            </StyleRoot>
        );
    }
}

// 영상에서 예제로 연습한 것. 위의 JSX가 사실은 밑에 return 되는 js 형태로 컴파일된다는것을 명심! (html처럼 보여도 html이 아니다)
// class App extends Component {
//   render() { ///위에서는 render이 없는데...!
//     return React.createElement('div', {className : 'App'}, React.createElement('h1', null, 'Does this work now?'))
//   }
// }

export default Radium(App);
