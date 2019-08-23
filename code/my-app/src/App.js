import React, { Component } from "react"; //왜 component는 괄호 안에?
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
class App extends Component {
    //state는 reserved word 임
    state = {
      persons: [
        { name : 'Max', age: 28},
        { name : 'Hannah', age: 25},
        { name : 'Jeongho', age: 26},
      ]
    };

    switchNameHandler = () => {
      // console.log('Was clicked!');
      //꼭 Arrow function을 사용해야만 this가 이 App class를 가르킨다!
      // Don't do this! this.state.persons[0].name  = 'Tada~!';
      this.setState({
        persons: [
          { name : 'Tada!', age: 28},
          { name : 'Hannah', age: 25},
          { name : 'Jeongho', age: 100},
        ]
      })
    }
    render() {
        return (
            <div className="App">
                <button onClick={this.switchNameHandler}>Switch Name</button>
                <Person name={this.state.persons[0].name} age={this.state.persons[0].age} />
                <Person name={this.state.persons[1].name} age={this.state.persons[1].age} />
                <Person name={this.state.persons[2].name} age={this.state.persons[2].age}>
                My Hobbies: Hannah                
                </Person>
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
