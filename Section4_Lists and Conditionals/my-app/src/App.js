import React, { Component } from "react"; //왜 component는 괄호 안에?
// import React, { useState } from "react"; // useState react Hook 사용하려구! (위에거 주석처리)
import "./App.css";
import Person from "./Person/Person";

// 원래 예제에서 사용했던 classed based component
class App extends Component {
    //state는 reserved word 임
    state = {
        persons: [
            { id: "1", name: "Max", age: 28 },
            { id: "2", name: "Hannah", age: 25 },
            { id: "3", name: "Jeongho", age: 26 }
        ],
        showPersons: false
    };

    deletePersonHandler = (personIndex) => {
        const persons = [...this.state.persons];
        persons.splice(personIndex,1);
        this.setState({persons: persons});
    }

    nameChangedHandler = event => {
        this.setState({
            persons: [
                { name: "Max", age: 28 },
                //target은 input element를 가르키고, value는 그 input element의 값!
                { name: event.target.value, age: 25 },
                { name: "Jeongho", age: 100 }
            ]
        });
    };

    togglePersonsHandler = () => {
        const doesShow = this.state.showPersons;
        this.setState({
            showPersons: !doesShow
        });
    };

    render() {
        const style = {
            backgroundColor: "white",
            font: "inherit",
            border: "3px solid blue",
            padding: "4px",
            margin: "10px",
            cursor: "pointer"
        };

        let persons = null;

        if (this.state.showPersons) {
            persons = (
                <div>
                    {this.state.persons.map((person, index) => {
                        return <Person 
                        click={() => this.deletePersonHandler(index)}
                        name={person.name} 
                        age={person.age}
                        key={person.id}/>; 
                    })}
                </div>
            );
        }
        return (
            <div className="App">
                <button style={style} onClick={this.togglePersonsHandler}>
                    Toggle Namecard
                </button>
                {persons}
            </div>
        );
    }
}

// 영상에서 예제로 연습한 것. 위의 JSX가 사실은 밑에 return 되는 js 형태로 컴파일된다는것을 명심! (html처럼 보여도 html이 아니다)
// class App extends Component {
//   render() { ///위에서는 render이 없는데...!
//     return React.createElement('div', {className : 'App'}, React.createElement('h1', null, 'Does this work now?'))
//   }
// }

export default App;
