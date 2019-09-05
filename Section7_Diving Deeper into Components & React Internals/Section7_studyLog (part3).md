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



