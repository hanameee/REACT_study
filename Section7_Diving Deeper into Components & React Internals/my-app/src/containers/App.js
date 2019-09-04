import React, { Component } from "react"; //왜 component는 괄호 안에?
// import React, { useState } from "react"; // useState react Hook 사용하려구! (위에거 주석처리)
import styles from "./App.module.css";
import Persons from "../components/Persons/Persons";
import Cockpit from "../components/Cockpit/Cockpit";
import Aux from "../hoc/Aux";
import withClass from "../hoc/WithClass";

// classed based component
class App extends Component {
    constructor(props) {
        super(props);
        console.log("[App.js] constructor");
        //원래 여기서 this.state 를 선언하는 건데, 밑의 최신 문법이 super이나 this.state 설정을 이걸 우리 대신 해주는 것!
    }
    state = {
        persons: [
            { id: "001", name: "Max", age: 28 },
            { id: "002", name: "Hannah", age: 25 },
            { id: "003", name: "Jeongho", age: 26 }
        ],
        showPersons: false,
        showCockpit: true
    };

    static getDerivedStateFromProps(props, state) {
        console.log("[App.js] getDerivedStateFromProps", props);
        return state;
    }

    componentDidMount() {
        console.log("[App.js] componentDidMount");
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("[App.js] shouldComponentUpdate");
        return true;
    }

    componentDidUpdate() {
        console.log("[App.js] componentDidUpdate");
    }

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
        console.log("[App.js] render");
        let persons = null;

        if (this.state.showPersons) {
            persons = (
                <Persons
                    persons={this.state.persons}
                    clicked={this.deletePersonHandler}
                    changed={this.nameChangedHandler}
                />
            );
        }

        return (
            // <div className={styles.App}>
            //     <button
            //         onClick={() => {
            //             this.setState({ showCockpit: false });
            //         }}
            //     >
            //         Remove Cockpit
            //     </button>
            //     {this.state.showCockpit ? (
            //         <Cockpit
            //             title={this.props.appTitle}
            //             personsLength={this.state.persons.length}
            //             showPersons={this.state.showPersons}
            //             clicked={this.togglePersonsHandler}
            //         />
            //     ) : null}
            //     {persons}
            // </div>
            <Aux>
                <button
                    onClick={() => {
                        this.setState({ showCockpit: false });
                    }}
                >
                    Remove Cockpit
                </button>
                {this.state.showCockpit ? (
                    <Cockpit
                        title={this.props.appTitle}
                        personsLength={this.state.persons.length}
                        showPersons={this.state.showPersons}
                        clicked={this.togglePersonsHandler}
                    />
                ) : null}
                {persons}
            </Aux>
        );
    }
}

export default withClass(App, styles.App);
