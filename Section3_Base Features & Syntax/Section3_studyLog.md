## Section 3 - Understanding the Base Features & Syntax

### 25)

Using a Build Workflow

Why? for Optimizing code, to use next-gen JS features, to be more productive

How?

1) Dependency Management tool 이 필요하다. - dependency란 third party libraries를 말함. react, react dom 모두 dependency!

Dependency Management tool 엔 npm, yarn 등이 있고, 우리는 npm 씀

2) Bundler 이 필요하다. - 우리는 각 file이 clear task를 가지고 있게 하기 위해 (더 쉬운 유지보수를 위해) modular code를 쓰고 그걸 multiple files 들에 쪼갤 것임. 하지만 브라우저들은 그걸 지원하지 않기에 마지막엔 bundler을 사용해서 그 파일들을 couple of files 로 bundle 해야함.

우리는 webpack을 사용할 것임!

3) Complier 필요하다 - translation from modern features to work arounds that also work on older browsers (babel)

4) Development Server - 로컬에서 서버 띄우고 확인할 수 있게끔

### 28)

react is all about creating components, basically custom html elements which you can be used to construct application.

### 31)

component is just a function returning some JSX.

```javascript
import Person from './Person/Person';
//대문자 이름으로 import 해와야한다! 왜냐면 JSX에서 소문자로 시작하는 모든 element 들은 native html 요소들 (ex.div, h1)을 위해 reserved 되어 있기에

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Hi, I'm a React App</h1>
      </header>
      <Person /> //요로코롬 대문자로 가져와야 custom component로 인식
    </div>
  );
}
```

### 32)

[중간정리]

Components = core building block of React apps

React app 은  one root component ('App') 과 potentially infinite amount of nested child component를 가진 component tree 라고 볼 수 있다.

각각의 component는 JSX code를 return 하거나 render 해야한다. (최종적으로 real DOM에 나타도록 React가 render 해야 하는 HTML code)

JSX는 HTML과 유사하게 생겼지만 엄연히 다르다. React.createElement를 중첩해서 부르지 않고 HTMLish code를 작성할 수 있게 도와주는 js의 syntactic sugar 일 뿐



Component를 만드는 2가지 방법

1) Functional components (=presentational,dumb,stateless)

```javascript
const cmp = () => {
  return <div>some JSX</div>
}
```

2) class-based components (=containers, smart, stateful)

```javascript
class Cmp extends Component {
  render() {
    return <div>some JSX</div>
  }
}
```



### 35)

`Person.js`

(Functional components 일 때)

```javascript
//props는 제한되지 않은 숫자의 arguments 를 받을 수 있다.
const person = (props) => {
    return (
        <p>I'm {props.name} and I am {props.age} years old!</p>
    );
}
```
(Class-based components 일 때)


```javascript
class Person extends Component {
  render() {
    return <p>I'm {this.props.name} and I am {this.props.age} years old!</p>
  }
}
```


`App.js`

```javascript
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Hi, I'm a React App</h1>
      </header>
      <Person name = "Hannah" age ="25"/>
      <Person name = "Jeongho" age ="26"/>
      <Person name = "Hey" age ="30">My Hobbies: Hannah</Person>
    </div>
  );
}
```

### 36)

props.children = Children refers to any elements and this includes plain text as we have it here between the opening and closing tag of our component

```javascript
const person = (props) => {
    return (
        <div>
            <p>I'm {props.name} and I am {props.age} years old!</p>
            <p>{props.children}</p>
						//text 말고도 복잡한 HTML 코드들이 들어갈 수 있다!
        </div>
    );
}
```

### 37)

name이나 age는 component의 외부에서 주어지는 정보!

그러나 component 내부의 정보를 활용하고 싶다면? state를 사용하면 된다.

이 영상에서 하는 방식 - state property here is only available like this in components that extend components (in class-based React components)

그러나 React 16.8 에서는 React hooks 를 통해 functional components 에서도 manage state를 할 수 있다.

state는 reserved word 이고, special 한 property 이다.

State는 변경될 수 있고, 변경되면 React는 우리의 DOM을 re-render할 것임 (update DOM)

### 39)

switchNameHandler = this is a method you're not actively calling but you're assigning as an event handler. It's not required

### 41)

```javascript
switchNameHandler = () => {
//꼭 Arrow function을 사용해야만 this가 이 App class를 가르킨다!
// this.state.persons[0].name  = 'Tada~!'; 
// 위처럼 직접적으로 state를 Mutate 하면 안되고, 대신 setState라는 special method를 사용해야 한다!

this.setState({
  persons: [
    { name : 'Tada!', age: 28},
    { name : 'Hannah', age: 25},
    { name : 'Jeongho', age: 100},
  ]
})
}

...
<button onClick={this.switchNameHandler}>Switch Name</button>
...

```

React 가 DOM을 update 하게끔 만드는 것은 딱 2가지이다.

1) Changing state using `setState` - app.js에서

2) props - person.js

만약 저 2개가 변경되면 react는 watch 하고 있다가 기존에 이미 render 된 DOM과 비교해 변경된 사항을 reflect 하여 new state & props를 update한다!



### 43)

`useState`hook을 사용해서 functional component 에서도 state를 manage 할 수 있다.

```javascript
const App = props => {
    //useState는 항상 2개의 element 를 리턴한다. 이전 class based에서 this.state가 하던 역할을 이젠 personsState가 한다!
    //setPersonsstate는 우리가 new state 를 설정할 수 있도로 한다
    const [personsState, setPersonsState] = useState({
        persons: [
            { name: "Max", age: 28 },
            { name: "Hannah", age: 25 },
            { name: "Jeongho", age: 26 }
        ]
    });

    const switchNameHandler = () => {
        //이제 this.setState 가 아닌 setPersonsState 임!
        setPersonsState({
            persons: [
                { name: "Tada!", age: 28 },
                { name: "Hannah", age: 25 },
                { name: "Jeongho", age: 100 }
            ]
        });
    };
    return (
        <div className="App">
            <button onClick={switchNameHandler}>Switch Name</button>
            <Person
                name={personsState.persons[0].name}
                age={personsState.persons[0].age}
            />
            <Person
                name={personsState.persons[1].name}
                age={personsState.persons[1].age}
            />
            <Person
                name={personsState.persons[2].name}
                age={personsState.persons[2].age}
            >
                My Hobbies: Hannah
            </Person>
        </div>
    );
};
```



`useState`는 항상 2개의 element 를 리턴한다. 이전 class based에서 this.state가 하던 역할을 이젠 personsState가 한다!

`setPersonsState`는 우리가 new state 를 설정할 수 있도록 한다



### 45)

Passing Method References Btw Components



### 46)

Adding Two Way Binding



### 47,48)

Adding Styling with Stylesheets

Styling implement 하는 방법은 2가지가 있다!

1) CSS stylesheet로 하는 법

global이 된다

2) Inline styles로 하는 법

inline을 하면 styling이 scoped to the component 되나, css