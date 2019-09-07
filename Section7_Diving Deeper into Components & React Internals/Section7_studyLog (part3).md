## Section7_Diving Deeper into Components & React Internals



### 109) Refs 사용하기 (for referencing React element)

`Person.js` 에서 우리는 아래와 같이 person component의 JSX 코드를 구성했다. two-way binding (?Q) 을 통해 내가 enter한 value도 가져올 수 있다!

```jsx
return (
    <Fragment>
        <p onClick={this.props.click}>
            I'm {this.props.name} and I am {this.props.age} years old!
        </p>
        <p>{this.props.children}</p>
        <input
            type="text"
            onChange={this.props.changed}
            value={this.props.name}
        />
        {/* <input type="text" onChange={props.changed}/> */}
    </Fragment>
);
```

그런데, 만약 우리가 render 한 맨 마지막 Person component의 input에 focus를 주고 싶으면 어떻게 할까?

`Person.js`

```javascript
class Person extends Component {
  componentDidMount() {
      document.querySelector("input").focus();
  }
  
  render() {
    ...
  }
}

```

이렇게 작성을 하면, 첫번째 Person의 input에 focus가 간다. 왜일까? `document.querySelector`은  일반적인 웹 브라우저를 위한 기능인 DOM selector이고 항상 전체 DOM에서 작동한다. 얘는 우리가 React를 쓰든말든 관심이 없어.

그래서 우리가 element를 편하게 select 하도록 하기 위한 React 의 기능이 있다! 바로 `refs`

React에서 사용하는 custom component, 위에서 살펴본 input 등을 포함한 어떠한 Element에도 ref라는 special property를 추가할 수 있다. (마치 key 처럼, React에 의해 detected & understood 된다)

```jsx
class Person extends Component {
  // (3)componentDidMount는 render뒤에 실행되기에 이미 ihis.inputElement에는 inputEl이 들어가 있을 거야. (내가 ref 속성을 준 element에 대한 참조값)
  componentDidMount() {
    this.inputElement.focus();
  }
  
<input
  // (1)ref에 익명함수를 준다! argument는 내가 ref 속성을 준 그 element에 대한 참조값이다 (원하는 이름을 쓰면 된다)
  ref={(inputEl) = {this.inputElement = inputEl}}
  // (2)class에 inputElement라는 새로운 속성을 할당하고, 그 속성을 argument로 받은 inputEl로 설정하는것임!
  type="text"
  onChange={this.props.changed}
  value={this.props.name}
  />
```

1. 참조하고 싶은 원소에 ref = 익명함수 할당

   ```javascript
   ref = {
     (ref속성준원소참조할이름) = {this.새로운속성 = ref속성준원소참조할이름}
   }
   ```

2. class에 componentDidMount lifecycle hook 으로 새로운속성.focus() 코드 줌

이렇게 하고 실행시켜보면 맨 마지막 Person의 input 에 focus가 가있는 것을 알 수 있다.



ref를 쓰는 새로운 방법이 잇다! React 16.2ver 이후부터.

```javascript
class Person extends Component {
  //class 내에서 constructor을 사용할 땐 항상 super을 잊지 말자아
  constructor(props) {
    super(props);
    //createRef()를 아까 익명함수 할당하는 것 대신으로 쓸 수 있다. constructor에서 inputElementRef라는 새로운 속성을 initialize 하고 있는거지!
    this.inputElementRef = React.createRef();
  }
  
  componentDidMount() {
    //current를 사용해야 현재 reference에 접근할 수 있다 (current element stored in this Reference = input)
    this.inputElementRef.current.focus();
  }
}
...

<input
	//inputElementRef는 (= React.createRef()는) 이 ref가 placed 된 element에 access 할 수 있게끔 해준다!
  ref={this.inputElementRef}
  type="text"
  onChange={this.props.changed}
  value={this.props.name}
  />
```

이렇게 constructor에서 inputElementRef 라는 속성을 새로 만들고, `React.createRef()` 를 할당해 준 뒤 참조를 원하는 원소의 ref 속성 값으로 this.inputElementRef 를 주고, componentDidMount 내에서 .current.focus() 를 주는 방법도 있다.

첫번째 방법은 보다 전통적인 방법으로 coverage가 넓고, 두번째 방법은 좀 더 modern한 syntax임.



### 110) Refs with React Hooks

109에서 알아본 방법은 class-based component에서 refs를 사용하는 방법이었다. functional component에서는 어떻게 할까?

React Hooks의 도움을 받는다면 두번째 방법을 사용할 수 있다.

functional component인 `Cockpit.js` 에서,  페이지가 로딩될 때 button이 자동으로 눌리게 해보자!

```javascript
// class component에서 React.createRef() 를 썼다면 functional component에는 useRef hook이 있다!
import React, { useEffect, useRef } from "react";
const cockpit = props => {
  // 어디 있든지간에 상관 없지만 반드시 JSX 코드를 리턴하기 전이어야 함!
  // useRef() hook을 통해 reference를 만들었당
  const toggleBtnRef = useRef(null)
  toggleBtnRef.current.click();
  // 나중에 알아볼 것이지만 useRef 안에 value를 저장할 수 있다. 지금은 null 넣어둠
  ...
  return (
    ...
      // 이렇게 button의 ref 속성값으로 toggleBtnRef을 할당해준다
      <button ref={toggleBtnRef} onClick={props.clicked} className={btnClass}>
      Toggle Namecard
        </button>
  )
  
}
```

**위의 코드는 아래와 같은 에러가 난다**

![image-20190906011037265](/Users/hanameee/Library/Application Support/typora-user-images/image-20190906011037265.png)

왜일까? 이 에러를 이해하기 위해서는 React hook 이 어떻게 동작하는지를 잘 알아야한다.

```javascript
const cockpit = props => {
  // toggleBtnRef 에 useRef를 할당한 직후
  const toggleBtnRef = useRef(null)
  // 바로 해당 reference에 대해서 click을 호출하고 있다
  toggleBtnRef.current.click();
  ...
    return (
    ...
      // 그런데 정작 나는 ref 에 button 참조값을 return 코드 내에서 할당해주고 있음!
      <button ref={toggleBtnRef} onClick={props.clicked} className={btnClass}>
      Toggle Namecard
        </button>
  )
  
```

button ref 속성값이  toggleBtn 에 담기는 것은 return에서니까, 당연히 저 시점에선 (click이 실행되는 시점에선) useRef 에 button ref 가 안담긴 undefined!

어떻게 해결할까? 바로 `useEffect` 를 통해서.

useEffect 는 every render cycle 이후에 실행된다. 따라서, useEffect 한테 넘겨준 코드는 즉각 실행되는 것이 아니고 JSX 코드가 처음 render 된 이후에 실행된다.

```javascript
// 특히 아래의 useEffect는 2번째 argument로 빈 배열을 넘겨주기에 component가 맨 처음 rendered 되었을 때만 실행되고 unmounted 되었을 때 cleanup 한다. 따라서 여기 안에서 click을 실행하면 딱 처음 render 했을때만 버튼이 클릭되도록 할 수 있음
useEffect(() => {
  console.log("[Cockpit.js] useEffect");
  // 여기에 이렇게 넣어주면 되는거지! (기존 alert 코드는 삭제)
  toggleBtnRef.current.click();
  return() => {
    console.log("[Cockpit.js] clean up work in useEffect");
  }
}, [] );
```

이런 식으로 useRef() hook을 이용해 특정 element의 ref 값을 전달할 수 있다.
+) useEffect 가 JSX 코드의 첫렌더 이후에 실행된다는 것, 따라서 그 이후에야 비로소 React가 ref 를 element와 연결할 수 있다는 것을 꼭 유념하자!



### 111) Prop Chain 문제 이해하기

만약 우리가 각 Person의 authentication status를 `Cockpit` 에서 관리하고, authenticated 되었는지 아닌지를 각 Person에서 나타내고 싶다고 생각해보자.

그렇다면 지금 상태에서는

1. Cockpit.js 에서 Log in 버튼을 만들고, 그 버튼의 onclick 으로 props.login 을 준다.

```javascript
<button onClick = {props.login}>Log in</button>
```

2. Cockpit component를 사용하는 App.js에서 login prop을 pass 해준다

```jsx
class App extends Component {
  ...
    state = {
      ...
    	// state에 authenticated 추가
      authenticated: false
    }

loginHandler = () {
  // loginHandler이 실행되면 setstate에서 authenticated를 true로!
  this.setState({authenticated: true})
}
render() {
  ...
  <Cockpit
    // pass down login prop
    login={this.loginHandler}
  />  
}
```

이렇게 authenticated 된 정보를 person component에서 사용하고 싶은데, `app.js` 파일에서는 persons component 에 대해서만 접근이 가능하지!

따라서 이 정보를 person 에서 쓰려면 다음과 같이 App > Persons > Person 으로 전달해줘야한다.

`App.js`

```javascript
render() {
  ...
  if (this.state.showPersons) {
    persons = (
      <Persons
        ...
        // App.js 에서 Persons로 authenticated state를 전달해준다
        isAuthenticated = {this.state.authenticated}
      />
    );
  }
}
```

`Persons.js`

```javascript
render() {
  return this.props.persons.map((person, index) => {
    return (
      <Person
      ...s
      // App.js 에서 넘겨준 isAuthenticated를 Person으로 전달해준다
      isAuth={this.props.isAuthenticated}
      />
  );
});
}
```

`Person.js`

```javascript
render() {
  return (
    <Fragment>
    	// Persons.js 에서 넘겨받은 isAuth를 드디어 Person 에서 사용할 수 있다.
    	{this.props.isAuth ? <p>Authenticated!</p> : <p>Please log in</p>
      ...}
    </Fragment>
);
}
```

그런데 이건 별로 바람직한 방법이 아님. props를 전달하기 위해 multiple levels를 거치고 있고, Persons는 authentication 에 아무 관심도 없고 그저 App > Person으로 가기 위한 중간단계일 뿐! = extra redundancy & reusability 하락

이런 Prop chain 문제를 해결하기 위해 React 가 제공하는게 바로 **Context** 임.

특정 data나 state를 component A에서 component D로 보내기 위해 별로 상관도 없는 B,C를 일일히 거치는게 아니라 바로 A>D로 갈 수 있도록 하는것!



### 112) Using the Context API

`/context/auth-context.js` 에 context object를 생성해보자.

```javascript
import React from "react";

const authContext = React.createContext({
  	// 이렇게 내가 context에서 접근하고 싶은 값들을 몽땅 첫 default value로 주는 이유는 mandatory이기 때문이 아니라, 단지 IDE 자동완성을 위한 것. 뒤에서 어차피 다시 value를 dynamic하게 줄 것이기 때문에 ~_~
    authenticated : false,
    login : () => {}
});

export default authContext;
```

context = value that can be passed btw React components without using props 

`React.createContext` 내에 초기값을 줘서 context를 만들 수 있다. context는 결국에 우리가 available 한 scope를 정할 수 있는 (globally or whatever) JS object이기 때문.

createContext의 value로는 (=context value) 객체 말고도 배열이나 string, number 등을 줄 수 있다. 

`app.js`

```javascript
import AuthContext from "../context/auth-context";
// 이렇게 import 해와서 custom component 처럼 사용할 수 있다.
```

Context component는 해당 context value 값에 접근해야 하는 모든 app의 부분들을 wrap 해야함.
우리의 경우 App.js 에서는 Cockpit과 **Persons에서** authentication info가 필요하기에 return의 cockpit 부분을 감싸준다. (조심! Persons에서 안감쌌다가 person에서 적용 안되가지고 삽질함)

```jsx
<AuthContext.Provider value = {
  {
    // 아까  auth-context.js에서 default로 설정한 초기값들한테 Dynamic value를 준다
  	authenticated: this.state.isAuthenticated,
  	login: this.loginHandler
  }
 }>
  {this.state.showCockpit ? (
   <Cockpit
     title={this.props.appTitle}
     personsLength={this.state.persons.length}
     showPersons={this.state.showPersons}
     clicked={this.togglePersonsHandler}
     login={this.loginHandler}
   />
  ) : null}
  {persons}
</AuthContext.Provider>
```

JS는 context value의 object값이 변경 되었다고 해서 re-rendering을 진행하지 않는다. 따라서   authentication status는 여전히 component의 state에서 관리해야 한다. 다만 이 state를 (`this.state.isAuthenticated`) AuthContext.Provider 의 value prop에 저장함으로써 state가 update 되면 자동으로  re-rendering이 되도록!



`Person.js`

```jsx
// return하는 JSX 코드 중 context를 사용해야 하는 부분을 AuthContext.consumer로 감싸고, context를 인자로 받아 우리가 원하는 JSX를 리턴하는 익명함수를 childeren으로 넣어준다.
<AuthContext.Consumer>
  {(context) => context.authenticated ? <p>is Authenticated!</p> : <p>need to log in!</p> }
</AuthContext.Consumer>
```

AuthContex.Consumer은 감싸고 있는 children으로 JSX 코드를 받는게 아니라 **context를 argument로 받아 JSX코드를 리턴하는 function**을 받는다. 이렇게 함으로써 그 어떤 component에서도 해당 context를 consume해서 value값을 사용할 수가 있게 되는것.

그러면 `context.authenticated` 로 app.js에서 AuthContext.Provider에서 prop으로 준 context value 값을 `context.authenticated` 형태로 사용할 수 있게 된다! (props 대신에)

`Cockpit.js`

```jsx
import AuthContext from "../../context/auth-context";
...
<AuthContext.Consumer>
  {(context) => <button onClick={context.login}>Log in</button>}
</AuthContext.Consumer>
```

여기서도 마찬가지로 `context.login` 으로  context value를 가져다가  사용할 수 있다.



### 113) Using contextType & useContext()

class based component랑 functional components 에서 context API를 조금 더 고급지게 쓰는 방법이 있다.

#### 1. in Class based component

React 16.6 version 부터 static 변수 contextType을 지원한다. 이걸 이용하면 기존에 render() 내에서 `<AuthContext.Consumer>` 로 감싸서 내부에서 익명함수를 리턴해서 사용할 수 있던 context value를 아무곳에서나 사용할 수 있다. `componentDidMount` 같은 lifecycle hooks 내에서도!

```jsx
import AuthContext from "../../../context/auth-context";
...
// 반드시 static, 철자 지켜서 가져와야 한다
static contextType = AuthContext;
    componentDidMount() {
        this.inputElement.current.focus();
      	// this.context를 사용해 어디에서나 context value에 access 할 수 있다
      	console.log(this.context.authenticated);
    }

    render() {
      	...
        return (
            <Fragment>
                {this.context.authenticated ? <p>Authenticated!</p> : <p>You need to login</p>}
          ...
            </Fragment>
        );
    }
```

`contextType` 문법을 사용하는 것이 더 쉽고, 짧고, 또 기존에는 access를 가질 수 없던 곳들도 context에 접근할 수 있으므로 이 방법을 더 권장한다!

####2. in Functional component

React는 Functional component를 위해선 `useContext` hook을 제공한다! 

```javascript
import React, { useEffect, useRef, useContext } from "react";
...
const Cockpit = (props) => {
  ...
  // 아무 변수명으로 써도 무방
  const authContext = useContext(AuthContext);
  // 이제 function body 어느 곳에서나 사용할 수 있다.
  console.log(authContext.authenticated);
}

...
return (
  // authContext.login 만으로 간단하게 접근 가능!
  <button onClick={authContext.login}>Log in</button>
)
```



정리하자면, functional component 에서는 `useContext()` hook 을, class based component에서는 `contextType` 을 이용해서 보다 더 편리하게 context를 사용할 수 있다.

context API는 components 간에 props 를 줄줄이 거치지 않고도 data를 manage 할 수 있도록 도와준다. 나중에 Redux 랑도 연결될 것이고, 중요한 부분이니 꼭 기억해둘것!



### 114) Wrap Up

이 module (Section7) 은 나중에 API reference 처럼 찾아볼 것.
다양한 것들에 대한 broad overview를 제공했던 모듈이기에!