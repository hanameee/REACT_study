import React, { Component } from "react"; //왜 component는 괄호 안에?
// import React, { useState } from "react"; // useState react Hook 사용하려구! (위에거 주석처리)
import styles from "./App.module.css";
import Person from "../components/Persons/Person/Person";

// classed based component
class App extends Component {
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
        let persons = null;
        let btnClass = "";

        if (this.state.showPersons) {
            persons = (
                <div>
                    {this.state.persons.map((person, index) => {
                        return (
                            <Person
                                click={() => this.deletePersonHandler(index)}
                                name={person.name}
                                age={person.age}
                                changed={event =>
                                    this.nameChangedHandler(event, person.id)
                                }
                            />
                        );
                    })}
                </div>
            );

            btnClass = styles.Red;
        }

        const classes = [];

        if (this.state.persons.length <= 2) {
            classes.push(styles.red);
        }

        if (this.state.persons.length <= 1) {
            classes.push(styles.bold);
        }

        return (
            <div className={styles.App}>
                <p className={classes.join(" ")}>
                    I change my class depending on persons array length!
                </p>
                <button
                    onClick={this.togglePersonsHandler}
                    className={btnClass}
                >
                    Toggle Namecard
                </button>
                {persons}
            </div>
        );
    }
}

export default App;
