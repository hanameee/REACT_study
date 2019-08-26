import React, { Component } from "react"; //왜 component는 괄호 안에?
// import React, { useState } from "react"; // useState react Hook 사용하려구! (위에거 주석처리)
import "./App.css";
import Person from "./Person/Person";

// function App() {
//     return (
//         <div className="App">
//             <button>Switch Name</button>
//             <Person name="Hannah" age="25" />
//             <Person name="Jeongho" age="26" />
//             <Person name="Hey" age="30">
//                 My Hobbies: Hannah
//             </Person>
//         </div>
//     );
// }

//

// useState Hook 사용하기 위해 functional component로 변경
// const App = props => {
//     //useState는 항상 2개의 element 를 리턴한다. 이전 class based에서 this.state가 하던 역할을 이젠 personsState가 한다!
//     //setPersonsstate는 우리가 new state 를 설정할 수 있도로 한다
//     const [personsState, setPersonsState] = useState({
//         persons: [
//             { name: "Max", age: 28 },
//             { name: "Hannah", age: 25 },
//             { name: "Jeongho", age: 26 }
//         ]
//     });

//     const switchNameHandler = () => {
//       //이제 this.setState 가 아닌 setPersonsState 임!
//         setPersonsState({
//             persons: [
//                 { name: "Tada!", age: 28 },
//                 { name: "Hannah", age: 25 },
//                 { name: "Jeongho", age: 100 }
//             ]
//         });
//     };
//     return (
//         <div className="App">
//             <button onClick={switchNameHandler}>Switch Name</button>
//             <Person
//                 name={personsState.persons[0].name}
//                 age={personsState.persons[0].age}
//             />
//             <Person
//                 name={personsState.persons[1].name}
//                 age={personsState.persons[1].age}
//             />
//             <Person
//                 name={personsState.persons[2].name}
//                 age={personsState.persons[2].age}
//             >
//                 My Hobbies: Hannah
//             </Person>
//         </div>
//     );
// };

// 원래 예제에서 사용했던 classed based component
class App extends Component {
    //state는 reserved word 임
    state = {
        persons: [
            { name: "Max", age: 28 },
            { name: "Hannah", age: 25 },
            { name: "Jeongho", age: 26 }
        ],
        showPersons: false
    };

    switchNameHandler = newName => {
        // console.log('Was clicked!');
        //꼭 Arrow function을 사용해야만 this가 이 App class를 가르킨다!
        // Don't do this! this.state.persons[0].name  = 'Tada~!';
        this.setState({
            persons: [
                { name: "Max", age: 28 },
                { name: newName, age: 25 },
                { name: "Jeongho", age: 26 }
            ]
        });
    };

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
                    <Person
                        name={this.state.persons[0].name}
                        age={this.state.persons[0].age}
                    />
                    <Person
                        name={this.state.persons[1].name}
                        age={this.state.persons[1].age}
                        click={this.switchNameHandler.bind(this, "Yay!")}
                        changed={this.nameChangedHandler}
                    />
                    <Person
                        name={this.state.persons[2].name}
                        age={this.state.persons[2].age}
                    >
                        My Hobbies: Hannah
                    </Person>
                </div>
            );
        }
        return (
            <div className="App">
                <button style={style} onClick={this.togglePersonsHandler}>
                    Toggle Namecard
                </button>
                {/* 아래처럼 할 수도 있지만 react가 re-render을 너무 자주 할 수도 있으므로 권장되진 않는다 */}
                {/* <button onClick={() => this.switchNameHandler('hehe!!')}>Switch Name</button> */}
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
