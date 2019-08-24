#React Study 

## Section 1 - Getting Started

###4)

React = all about components!
components : custom HTML elements (building blocks - reusable pieces)

React component = just a function

React는 JSX라는 special syntax를 쓴다

```javascript
funtion Person(props) {
  return (
    <div class = "person">
    <h1>{props.name}</h1>
		<p>Your Age: {props.age}</p>
    </div>
  );
}

ReactDOM.render(<Person name = "Max" age="28" />,
document.quertSelector('#p1'));
ReactDOM.render(<Person name = "Dex" age="30" />,
document.quertSelector('#p2'));
```

아래 방식으로 하기도

```javascript
var app = (
<div>
	<Person name = "Max" age="28" />
  <Person name = "Dex" age="30" />
</div>
);

ReactDOM.render(app,
document.quertSelector('#app'));
```

### 5)

React를 사용하는 이유: UI state management

HTML의 구조를 바꿨을 경우, querySelector을 사용해서 귀찮아지는 것들…!

### 6)

Angular, Vue.js, Backbone, Ember 등등...

React is about declaring what you see and focusing on the logic instead of focusing on the "how"

### 7)

SPAs and MPAsv 

Single page Application - 1개의 HTML file, 모든게 rendered/handled ny Javascript

Multi page Application - 여러개의 HTML file (example.com/users)

Multi page Application 에도 React를 쓸 수 있지만, entire page를 관리하기 위해 쓰진 X.

최근엔 Single page Application 이 더 인기있는 approach 이다. 전체 page를 JS로 manage하면 서버에 재요청을 보내 reload 할 필요가 없기 때문에.

이 강의에서는 Single page Application - 즉 한개의 ReactDOM.render call만 있을 것임.
왜냐면 모든 다른 React components 를 host 하는 한개의 root app component (which is mounted to the DOM) 만 가지고 있기에!

+) React router과 같은 library도 쓸 수 있다.

## Section 2 - Refreshing Next Generation JavaScript

###12)

Variable (변수) 를 만들고 싶으면 let을 써라

Constant value (상수)를 만들고 싶으면 const를 써라 (only aassign once and never change, never going to receive a new value)

### 13)

Arrow function의 장점 : `this` 키워드와 관련된 문제 해결!

this 를 arrow function 안에서 사용하면 항상 keep its context / not change surprisingly on runtime 이다.

### 14)

Exports & Import

Default Import - 어떤 이름으로 import 하던 상관 없다

```javascript
const person = {
  name: 'Max'
}
export default person
```

```javascript
import person from './person.js'
import prs from './person.js'
//어떤 이름으로 import 하던 상관 없다
```

Named export - 정확히 그 이름으로 import 해야 한다

```javascript
import { smth } from './utility.js'
import { smth as Something } from './utility.js'

import * as bundled from './utility.js'
```

### 15)

class = properties, methods 를 가질 수 있다.

```javascript
class Human {
  constructor() {
    this.gender = 'female';    
  }
  
  printGender(){
    console.log(this.gender);
  }
}

class Person extends Human{
  constructor() {
    super(); //만약 다른 class를 extend 하고, constructor을 implement 한다면 constuctor 내에 super method를 add 해야 한다
    this.name = 'Max';
    this.gender = 'Male';
  }
  printMyName() {
    console.log(this.name);
  }
}
```

```javascript
const myPerson = new Person()
myPerson.call;
console.log(myPerson.name);
```

class 는 상속이 가능하다

```javascript
class Person extends Human
```



React 에서 components 를 생성하기 위해 classes 문법이 사용된다!

Next JS gen 에서는 constuctor 없이 property를 선언하고, arrow function을 사용해서 methods 를 정의할 수 있다.

```javascript
class Human {
  gender = 'male';
	printGender = () => {
    console.log(this.gender);
  }
}

class Person extens Human {
  name = 'Max';
  gender = 'female';
  
  printMyName = () => {
    console.log(this.name);
  }
}
```

### 16)

Spread, Rest Operators

`…` 둘다 이 점세개 operator을 지칭하는 말! Spread 인지, Rest Operator인지는 우리가 어디에 사용하는지에 따라 달려있다.

Spread Operator : array 요소나 object properties를 split up 할때

```javascript
const newArray = [...oldArray,1,2];
const newOeject = {...oldObject, newProp:5}
```

Rest Operator : list of function argument를 array에 merge 할 때


```javascript
function sortArgs(...args){
  //갯수 제한 없이 argument를 받고, 그것들을 array로 merge해준다
  return args.sort();
  //args들에 array methods 들을 apply 할 수 있다
}
```

언제 쓰냐?

array들을 편리하게 copy 할 때, old object를 안전하게 copy하면서 새로운 property를 추가 할 때

### 17)

Destructuring - easliy extract array elements or object properties and store them in variables (spread 와 다른 점은 spread는 모든 element/properties를 가져와 새로운 배열/객체에 분배하는 것이고, destructuring은 single element/properties를 가져와 새로운 배열/객체에 할당 할 수 있게끔 해주는 것)

Array Destructuring

```javascript
//새로운 array를 만드는 것 처럼 보이지만, 사실은 그게 아니당
[a,b] = ['Hello', 'Max'];
console.log(a) //Hello
console.log(b) //Ma


const numbers = [1,2,3];
[num1, ,num3] = numbers;
console.log(num1,num3) //1,3
```

Object Destructuring

```javascript
{name} = {name: 'Max', age:28};
console.log(name) //Max
console.log(age) //undefined
```

### 18)

References and primitive types

```javascript
const num = 2; //primitive type
const num2 = num; //num의 값이 복사되어 num2에 저장됨
```

Primitive type = numbers, Strings, booleans

Primitive type를 reassign 하거나 다른 변수에 store하면 그 값을 copy할 것임

Reference type = objects, arrays
```javascript
const person = {
  name: 'Max'
};

const secondPerson = person; //참조값이 복사되는거지, 값이 복사되는게 아님. person의 property를 변경하면 secondPerson의 값도 바뀜. 같은 객체를 참조하고 있으므로.
console.log(secondPerson);
```

객체도 마찬가지!

따라서 const arraysmth = smth 처럼 참조값을 복사하는 것이 아니라, immutable한 방식으로 진짜로 배열/객체의 값 자체를 복사하는 법을 배울 것임. spread operator을 이용해서!

```javascript
const person = {
  name = 'Max'
};

const secondPerson {
  ...person
}
//이렇게 spread operator을 이용하면 참조값을 복사하는게 아니라 property를 복사해와서 새로운 객체를 만드는거라, 이전 객체 값을 변경해도 새로운 secondPerson은 영향을 받지 않는다.

```

### 20)

array function들

```javascript
const numbers = [1,2,3];
//map은 function을 파라미터로 받아, 각 배열의 원소에 적용시킨다
const doubleArray = numbers.map((num) => {
  return num*2;
})
//map은 새로운 array를 리턴하고, 그게 doubleArray에 저장된다.

console.log(numbers);
console.log(doubleArray);
```



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

`setPersonsstate`는 우리가 new state 를 설정할 수 있도록 한다



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