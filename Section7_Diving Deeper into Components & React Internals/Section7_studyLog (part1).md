## Section7_Diving Deeper into Components & React Internals

### 84) Project 디렉토리 구조 개선하기

기존에 우리가 사용했던 component 는 2개!

- app component (우리의 state를 담고 있는 main container)
- person component (1개의 person을 보여주는 functional component)

이 구조를 개선해보자!

일반적으로 state를 관리하는 `App.js` 같은 container component 는 UI rendering 에 깊게 관여하지 않는다.

다시 말하자면, `render()` 너무 많은 jsx 없이 lean 하게 유지되는 것이 좋다.

작은 app에서는 무관하지만, app 크기가 커지면 더 작은 component 들로 쪼개는 것이 좋겠지!



구조를 개선해보자.

![image-20190901162823725](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190901162823725.png)

src 밑에 assets (이미지 파일 등), components (Persons, Cockpit), containers 으로 경로를 분리했다.

이렇게 디렉토리를 나눔으로써 improved & focused 된 component structure을 가질 수 있다.



### 85) cockpit 와 persons 컴포넌트 모듈화하기

App.js에서 새롭게 분리한 cockpit과 persons 컴포넌트를 맹글어보자.

우리 프로젝트에서는 state management를 위해 class based component를 사용하고, presentation을 위해 functional component를 사용하는 구조를 택했다. (물론 react hooks 를 사용해서 functional component로도 state management를 할 수 있지만)



1. state의 persons array를 person component로 mapping 해주는 persons component를 분리하고
2. 첫 화면에 p를 띄워주고 button을 눌러 persons를 conditional 하게 보여주는 cockpit component를 분리하려고 한다!



App.js 에서는 최대한 state를 manage 하는 메서드들만 남기고, 출력을 담당하는 다른 JSX 코드들은 별개의 functional component로 최대한 잘게 분리한다.

그 결과 render 에는

` App.js` 

```javascript
render() {
    let persons = null;

    if (this.state.showPersons) {
        persons = (
            <Persons
                persons = {this.state.persons}
                clicked = {this.deletePersonHandler}
                changed = {this.nameChangedHandler}
            />
        );
    }

    return (
        <div className = {styles.App}>
            <Cockpit
                persons = {this.state.persons}
                showPersons = {this.state.showPersons}
                clicked = {this.togglePersonsHandler}
            />
            {persons}
        </div>
    );
}
```

만 남게 된다! 깔끔 :)

새롭게 만든 component 들은 다음과 같다.



`cockpit.js`

```javascript
import React from "react";
import styles from "./Cockpit.module.css"

const cockpit = (props) => {
    const classes = [];
    let btnClass = "";

    if (props.showPersons) {
        btnClass = styles.Red;
    }

    if (props.persons.length <= 2) {
        classes.push(styles.red);
    }

    if (props.persons.length <= 1) {
        classes.push(styles.bold);
    }
    return (
        <div className = {styles.Cockpit}>
            <p className={classes.join(" ")}>
                I change my class depending on persons array length!
            </p>
            <button onClick={props.clicked} className={btnClass}>
                Toggle Namecard
            </button>
        </div>
    );
};

export default cockpit;

```

`Persons.js`

```javascript
import React from 'react';
import Person from './Person/Person';

const persons = (props) => 
        props.persons.map((person,index) => {
            return(
                <Person
                    click = {() => props.clicked(index)}
                    name = {person.name}
                    age = {person.age}
                    changed = {event => props.changed(event, person.id)}
                    key = {person.id}
                />
            )
        })

export default persons;
```



### 86) Stateless vs Stateful components

stateless(presentational,dumb) VS stateful components(container,rich).

16.8 에서 functional component 들도 react hook 을 사용해 state를 manage 할 수 있게 되었다. 따라서 stateful = class based component 를 의미하는건 아니다!



app에 최대한 많은 presentational component를 가지고 있는게 좋다. presentational component = functional component that does not manage state.

presentational component 는 외부 input (props) 에 의해 정의되므로 app 어디서나 가져다 쓸 수 있다.

리액트 연습을 많이 하다보면 어떤 component가 자식 component 들이 알맞은 input을 받을 수 있도록 state를 manage 해야하는지, 어떤 component가 그냥 presentational component로 남아있는 것이 좋을지 감이 올 것임!



### 87) Class-based vs Functional components

![image-20190901211623156](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190901211623156.png)

class-based component 도 this를 통해 props 를 쓸 수 있다.

`index.js`

```javascript
ReactDOM.render(<App appTitle = "Person Manager"/>, ...
```

App component 에 appTitle props 를 추가해주면

`App.js`

Class based component인 app.js 에서 `this` 를 통해 props 에 접근할 수 있다.

Cockpit component의 props 로 이 appTitle을 전달해줄 수 있다.

```jsx
return (
    <div className = {styles.App}>
        <Cockpit
						//this는 App class를 의미하니까 this.props로 appTitle을 가져옴!
            title = {this.props.appTitle}
            persons = {this.state.persons}
						...
```

`Cockpit.js`

```jsx
return (
  <div className = {styles.Cockpit}>
    <h1>{props.title}</h1>
    <p className={classes.join(" ")}>
      I change my class depending on persons array length!
    </p>
    ...
```

Cockpit component 에 title 을 넣어주면 끝!



왜 App.js 에서는 this.props.appTitle 이고 Cockpit.js 에서는 this 없이 props.title인지 잘 이해할 것.



### 88) 컴포넌트 lifecycle overview

Component Lifecycle은 일단 class based component에서만 가능하지만, functional component에서도 가능한 방법이 있고 이건 나중에 배우게 될 것임.

![image-20190901224312195](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190901224312195.png)

Child Components 의 lifecycle이 모두 끝나고 난 뒤에야 lifecycle hook이 끝날 것임 (when componentDidMount gets called)



### 89) Component Lifecycle - [Creation]

App.js에서 만들어보자!

#### Lifecycle creation hooks #1. Constructor

```javascript
class App extends Component {
    constructor(props){
        super(props);
        console.log("[App.js] constructor");
        //원래 여기서 this.state 를 선언하는 건데, 밑의 최신 문법이 super이나 this.state 설정을 이걸 우리 대신 해주는 것!
    } ...
```



#### Lifecycle creation hooks #2. getDerivedStateFromProps

```javascript
static getDerivedStateFromProps(props,state){
    console.log("[App.js] getDerivedStateFromProps" , props);
    return state
}
```

static 키워드를 앞에 붙여줘야 한다! (Q.왜죠)

#### Lifecycle creation hooks #3. Render

```javascript
render() {
  console.log("[App.js] render");
```

Render 상태를 확인하기 위해 Persons.js 와 Person.js 의 return 직전에 console.log 찍기

```javascript
//Persons.js
const persons = (props) => {
    console.log("[Persons.js]] rendering");
    return props.persons.map((person,index) => {
    ... 
    
//Person.js
const person = props => {
    console.log("[Person.js]] rendering");
    return (
        <div className = {styles.Person}>
      ...
```



Child component 의 render이 다 끝나면 componentDidMount 가 run 할 것임.

#### Lifecycle creation hooks #4. componentDidMount

```javascript
static getDerivedStateFromProps(props,state){
  console.log("[App.js] getDerivedStateFromProps" , props);
  return state
    }
```

이렇게까지 추가하고 서버 돌려보면 만들어둔 console.log 들이 lifecycle의 순서대로 찍히는 것을 볼 수 있다.




### 90) Component Lifecycle - [Update for props]

![image-20190902145848216](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902145848216.png)

Update lifecycle 을 보기 위해 persons, person component를 functional > classed-based component로 바꿀 것임!

`Person.js`

1. import 문 수정

   ```javascript
   import React, { Component } from "react";
   ```

2. render( ) method 추가

   ```javascript
   //class는 주로 대문자로 시작한다!
   class Person extends Component {
       render() {
           console.log("[Person.js]] rendering");
           return (
               <div className = {styles.Person}>
                   <p onClick={this.props.click}>
                       I'm {this.props.name} and I am {this.props.age} years old!
                   </p>
                   <p>{this.props.children}</p>
                   <input type="text" onChange={this.props.changed} value={this.props.name} />
                   {/* <input type="text" onChange={props.changed}/> */}
               </div>
           );
       }
   }
   ```

   Render 안에 return을 넣고 JSX 코드도 추가해준다.

3. props를 this.props 로 수정

   이제 props가 argument가 아니라, property of this class이기에 this keyword를 사용한다

4. Export 수정

   Class 이름은 주로 대문자로 사용하므로

#### Lifecycle update hooks #1. getDerivedStateFromProps

`Person.js`

```javascript
static getDerivedStateFromProps(props,state){
  console.log("[Person.js] getDerivedStateFromProps");
  return state;
}
```

#### Lifecycle update hooks #2. shouldComponentUpdate

`Person.js`

```javascript
shouldComponentUpdate(nextProps,nextState){
    console.log("[Person.js] shouldComponentUpdate");
    return true; //return true if React should continue updating or false if it shouldn't
  	//보통 하드코딩하진 않고 current props랑 upcoming props랑 비교해서 바뀌면 permit 하는 식으로 조건문을 써넣지! 지금은 일단 true로 해둘 것
} 
```

#### Lifecycle update hooks #3. getSnapshotBeforeUpdate

```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("[Persons.js] getSnapshotBeforeUpdate");
    return { message : "snapshot!" };
}
```

이후에는 render 메서드가 실행 될 것임!

Child component 들의 lifecycle까지 끝나고 나면, componentDidUpdate 가 실행될 것

#### Lifecycle update hooks #4. componentDidUpdate

```javascript
componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("[Persons.js] componentDidUpdate");
    console.log(snapshot)
}
```

이렇게 하고 콘솔 지운뒤 실행해보면 처음에 creation lifecycle이 돌아가고, input에 글자를 바꿔서 props를 update해보면 update lifecycle이 돌아가는 것을 알 수 있다.

![image-20190902163437972](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902163437972.png)

예전엔 사용되었던 hook들 : `componentWillReceiveProps `, `componentWillUpdate` 
더 이상 사용하진 않지만 그냥 historically 존재했었다.

가장 자주 사용할 hook은 update가 끝난 이후 실행되는 **componentDidUpdate** 다! 이때  주로 server 로부터 new data를 fetch 해오기 위해 사용할 것임.



###91) Component Lifecycle - [Update for state]

`App.js`

```javascript
static getDerivedStateFromProps(props,state){
    console.log("[App.js] getDerivedStateFromProps" , props);
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
```

![image-20190902181108295](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902181108295.png)

추가해준 후 (1) 실행 > (2) 버튼클릭 > (3) input 입력 해보면 위의 순서대로 App과 Person, Persons의 lifecycle이 돌아가는 것을 알 수 있다.

이렇게 Component의 lifecycle을 알고, 어떻게 component들이 생성되고 custom code를 execute 할 수 있는지를 아는 것은 중요하다!

특히 중요한 lifecycle hooks 들은

`componentDidMount`, `componentDidUpdate` , `shouldComponentUpdate` 가 있다!

- componentDidMount 와 componentDidUpdate 에서는 fetching new data from a server 과 같은 일을 하게 될 거구
- shouldComponentUpdate 에서는 performance를 향상시키기 위한 일들을 하게 될 것임.



기존에 functional component 에서 state 를 manage 할 수 없을 때 (=presentational component 로만 사용할 때)는 lifecycle hooks 에 대해 생각할 필요가 없었다.

근데 이제는 React hooks 덕분에 functional component 에서도 state management 가 가능해졌고, 따라서 functional component 에서도 lifecycle hooks 와 equivalent 한 것들이 존재.

다음 강의에서 알아볼 것 :)



### 92) Using useEffect() in functional component

[공식 참고 문서](https://ko.reactjs.org/docs/hooks-effect.html)

Functional component 에서는 `useState()` 를 이용해서 state management 가 가능했지!
[Section3 #43 필기 참고]([https://github.com/hanameee/REACT_study/blob/master/Section3_Base%20Features%20%26%20Syntax/Section3_studyLog.md](https://github.com/hanameee/REACT_study/blob/master/Section3_Base Features %26 Syntax/Section3_studyLog.md))

그 다음으로 중요한 hook 이 바로 `useEffect()` 이다. 

useEffect() 를 통해 전달된 함수 = Effect 이다

`Cockpit.js`

```javascript
const Cockpit = (props) => {
    useEffect(() => {
        console.log("[Cockpit.js] useEffect")
    })
  ...
```

⚠️ 주의점 : cockpit 을 lowercase로 시작했더니 아래와 같은 경고메세지가 떴다.

`React Hook "useEffect" is called in function "cockpit" which is neither a React function component or a custom React Hook function`

찾아보니 React Component name은 non-lowercase letter 로 시작해야 하는 것 같다! (Q. 그럼 왜 useEffect를 쓰기 전에는 에러가 안난걸까....? 😅)

그래서 const 변수였던 cockpit을 Cockpit으로 수정해주니 에러 해결!

[stackoverflow 참고 링크](https://stackoverflow.com/questions/54605667/warning-messaged-from-eslint-when-using-react-hooks)

useEffect는 반드시 function 을 argument로 받는다! 이 함수는 (=effect 는) cockpit의 모든 render cycle마다 실행될 것임. 즉, every update 마다 실행된다는 것! 물론 component가 생성되었을 때도 실행된다.  "React 는 effect 를 기억했다가 DOM update가 이뤄진 후에 effect 를 call 한다. 즉, React는 effect 가 실행된 시점에서 update가 이뤄져있는 것을 보장한다."

(p.s - 여기서 말하는 render cycle은 real-DOM의 re rendering이 아니라 React의 virtual-DOM의 re rendering!)

정리하자면, useEffect 는 마치 componentDidMount (처음 created=first render 되었을 때) 와 componentDidUpdate (update 되었을 때) 가 합쳐진 것!

getDerivedStateFromProps 가 미포함되어있지않냐! 라고 할 수 있는데, functional component에서는 useState를 이용해서 props의 데이터를 initial state로 보내줄 수 있다.



### 93) Controlling useEffect() behavior

useEffect 가 모든 render cycle마다 실행되어서 다루기 까다로울 수 있다.
예를 들어 cockpit.js 에 아래 코드를 추가하면

```javascript
useEffect(() => {
    console.log("[Cockpit.js] useEffect");
    setTimeout(()=> {
        alert("Saved data to cloud");
    },1000)
})
```

처음 render 했을 때, 버튼을 toggle 했을 때, input을 입력했을 때마다 alert 가 1초의 timeout을 가지고 뜬다!

useEffect 가 매번 실행되는 것이 아니라, 내가 execute 되는 경우를 control 하고 싶다면?
= useEffect 의 second argument 로 array를 넘겨주면 된다!

1. 만약 Persons 이 변경될 때만 alert 가 뜨게 하고 싶다면?

   useEffect의 2번째 parameter로 props.persons 를 넣어준다 (dependency)

   ```javascript
   useEffect(() => {
       console.log("[Cockpit.js] useEffect");
       setTimeout(()=> {
           alert("Saved data to cloud");
       },1000)
   }, [props.persons])
   //persons가 바뀔 때만 alert가 뜬다!
   ```

   - 한 array 안에 여러개의 dependencies를 넣는 것도 가능
   - 여러개의 effect가 있다면 useEffect를 여러개 사용하는 것도 가능

   

2. 만약 맨 처음 Rendering 될 때만 alert가 뜨게 하고 싶다면?

   useEffect의 2번째 parameter로 빈 array 를 넣어주면 된다!

   ```javascript
   useEffect(() => {
       console.log("[Cockpit.js] useEffect");
       setTimeout(()=> {
           alert("Saved data to cloud");
       },1000)
   }, [])
   ```

   빈 array를 넘겨준다는 건, 이 effect가 dependencies를 가지고 있지 않다는 뜻이다. useEffect는 dependencies 들 중 하나가 변경되었을 때 rerun 되는데, 빈 array = no dependencies 이므로 이 useEffect는 rerun 될 수가 없다! 따라서 처음에만 실행되고 그 이후에는 실행되지 않음.

   = componentDidMount (component creation이 완료되었을 때)  로 사용하고 싶으면 second argument로 빈 array를 전달해주면 되겠지! :)



### 94) Cleaning up with Lifecycle Hooks & useEffect()

우리 app 에서 `Persons` 컴포넌트는 버튼 toggle을 하면 사라지지! 지금은 별다른 cleaning up이 필요 없지만, live connection 이 있는 app 등등에서는 cleaning up이 필요할 수 있다.

#### How to clean up in class based component

Class based component에서는 `componentWillUnmount` 로 이를 관리할 수 있다.

```javascript
componentWillUnmount() {
  console.log("[Persons.js] componentWillUnmount")
}
```

![image-20190902220053727](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902220053727.png)

button을 눌러 Persons 컴포넌트를 없애면 componentWillUnmount 가 콘솔에 찍히는 것을 볼 수 있다.

componentWillUnmount 내부에는 component가 removed 되기 직전에 실행되어야 하는 코드들을 넣으면 된다!

#### How to clean up in functional component

functional component인 cockpit 을 가지고 실습해보자.

만약 effect 가 함수를 return 하면, React는 그 함수를 clean up 해야하는 timing에 실행시킨다. 

- 1. React performs the cleanup **when the component unmounts**.

- 2. However, as we learned earlier, effects run for every render and not just once. This is why **React *also* cleans up effects from the previous render before running the effects next time**. 

Effect 에게 넘겨주는 function 안에 return을 추가해서 함수를 return 해보자!

```javascript
const Cockpit = (props) => {
    useEffect(() => {
        console.log("[Cockpit.js] useEffect");
        setTimeout(()=> {
            alert("Saved data to cloud");
        },1000);
      	//이 useEffect 의 콜백함수(?) 안에서 return으로 함수를 리턴하게 하면 이 함수는 main useEffect 함수가 실행되기 전에 & 첫번째 render cycle이 실행된 후에 실행된다! (runs BEFORE the main useEffect function runs, but AFTER the first render cycle!)
        return() => {
            console.log("[Cockpit.js] clean up work in useEffect");
        }
    }, [] )
```

이게 실행되는걸 보기 위해 cockpit 컴포넌트가 unmount 되게 해보자!

App.js 로 가서 cockpit component가 선택적으로 render 되게끔 버튼을 만들자.

```javascript
//App.js 의 state에 showCockpit 추가 (default = true)
state = {
  ...,
  showCockpit: true
}

...

render() {
  ...
  return (
    <div className={styles.App}>
    		//cockpit을 삭제하기 위한 button 추가
        <button
            onClick={() => {
                this.setState({ showCockpit: false });
            }}
        >
            Remove Cockpit
        </button>
				//삼항연산자를 사용해서! showCockpit이 true면 cockpit component를 렌더, 아니면 null을 렌더하게!
    		{this.state.showCockpit ? (
          <Cockpit
          	title={this.props.appTitle}
        		persons={this.state.persons}
            showPersons={this.state.showPersons}
            clicked={this.togglePersonsHandler}
         />
         ) : null}
				{persons}
		</div>
	);
}
```

이렇게 하고 remove 버튼을 눌러보면

![image-20190902223859555](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902223859555.png)

아래처럼 Cockpit.js 의 clean up 콘솔로그가 찍히는 것을 알 수 있다.

이렇게 `useEffect()` 의 두번째 argument로 **빈 배열**을 주면 해당 event는 dependencies가 없으므로 first render 에만 실행된다! 또한, event가 함수를 return 하고 있으므로 react는 해당 component가 unmount 될 때 해당 return되는 함수를 실행한다.

`React performs the cleanup when the component unmounts.`

한편,  `useEffect()` 의 두번째 argument로 아무것도 주지 않는다면 useEffect는 모든 render마다 (including first render) 실행된다. 

다음 useEffect를 추가로 실행해보면

```javascript
useEffect(() => {
    console.log("[Cockpit.js] 2nd useEffect");
    return() => {
        console.log("[Cockpit.js] clean up work in 2nd useEffect");
    }
},);
```

![image-20190902232619435](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902232619435.png)

update가 실행될 때 2nd useEffect 가 실행되기 전 effect를 clean up 하는 코드가 실행되는 것을 알 수 있다!

컴포넌트를 re-render 할 때마다 clean up 해야하는 operation이 있을 경우 이렇게 useEffect 의 second argument로 아무것도 주지 않으면 된다 :)

[참고 링크 : ZEROCHO - React의 생명 주기](https://www.zerocho.com/category/React/post/579b5ec26958781500ed9955)
[참고 영상: React 기본 강좌](https://www.youtube.com/watch?v=V3QsSrldHqI&list=PLcqDmjxt30RtqbStQqk-eYMK8N-1SYIFn)

일단 이렇게까지만 hook 에 대해 배우고 (이후 강좌에서 더 배울 것이므로), 지금은 performance optimization과 shouldComponentUpdate에 대해 배워보자!

지금은 `App.js` 의 shouldComponentUpdate가 항상 true를 return하고 있다 = 즉 component에서 변화가 일어나면 항상 re-render한다 (real DOM을 re-render한다는 말은 아니고 real DOM을 업데이트 해야하는지를 내부적으로 항상 체크한다!)

이걸 막을 수 있다면 performance를 향상시킬 수 있겠지!

다음 강좌에서 shouldComponentUpdate 에 대해 알아볼 것.



### 95) Cockpit.js Clean up 보강하기

cockpit의 첫 effect인 alert는 cockpit을 unmount해도 실행된다...! 이걸 수정해보자.
cleanup 할때 이 alert도 없애버리는게 좋을 것 같지!

```javascript
const Cockpit = (props) => {
    useEffect(() => {
        console.log("[Cockpit.js] useEffect");
      	//timer 변수에 setTimeout을 할당하고
        const timer = setTimeout(()=> {
            alert("Saved data to cloud");
        },1000);
        return() => {
            clearTimeout(timer);
            console.log("[Cockpit.js] clean up work in useEffect");
        }
    }, [] );
  ...
```

이렇게 setTimeout을 timer 변수에 할당하고 cockpit 이 unmount 될 때 실행되는 return 함수 안에 clearTimeout으로 timer을 없애주면 - cockpit 이 unmount 될 때 alert도 같이 없어진다.



### 96) shouldComponentUpdate를 사용한 class based Component 의 Optimization

지금 우리 App의 문제 - `App.js` 의 shouldComponentUpdate 에서 항상 true를 return 하기 때문에 app component에 변경사항이 있을 때마다 render() 안에 있는 모든 것들이 re-render 된다. 즉, Persons와 모든 Person들이 다 lifecycle 을 처음부터 끝까지 거치는 것!

예를 들어 버튼으로 cockpit을 remove 해도, 아래에서 cockpit과 아무 상관 없는 Person과 Persons가 모두 re render 되는 것을 볼 수 있다.

![image-20190902235729826](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190902235729826.png)

이걸 고칠 수 있다면 좋겠지!

고치는 방법 = `shouldComponentUpdate` 에서 어떤 것들이 바뀌었는지 check 한다.

`Persons.js` 에서 수정해보자.

```javascript
shouldComponentUpdate(nextProps, nextState) {
    console.log("[Persons.js] shouldComponentUpdate");
  	//nextProps.persons 가 지금 props.persons 와 다르면 t
    if(nextProps.persons !== this.props.persons) {
        return true;
    } else {
        return false;
    }
}
```

![image-20190903211630981](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190903211630981.png)

위에서 보이는 것처럼, 이렇게 shouldComponentUpdate 를 수정하면 cockpit 을 없애도 persons component tree 전체를 virtually re-render 할 필요가 없기에 performance를 크게 향상시킬 수 있다.

Javascript의 배열과 객체는 reference type으로 메모리에 저장되고, 우리가 걔들을 변수에 저장하면 우리는 실제 배열/객체를 저장하는게 아니라 그들의 참조값을 저장하는 것임!

따라서 만약 업데이트를 담당하는 nameChangedHandler에서 실제 props.person 원본을 manipulate 했다면? props 가 변경되었더라도 memory 내의 포인터값이 같기 때문에 정상적인 비교가 가능하지 않았을 것임.

Q. `if(nextProps.persons !== this.props.persons) ` 이건 deep comparison이 아니라 shallow comparison 이다 (?)



Chrome 개발자도구 > 더보기 에서 More tools - rendering - paint flashing을 해보면 shouldComponentUpdate 을 수정하지 않아도 real DOM에서는 모든 요소들이 다 re-rendering 되지 않고 변경된 친구만 re-rendering 되는 것을 볼 수 있다.

lifecycle마다 console.log 찍었을 때는 cockpit만 수정해도 persons가 re-rendering 되었는데, 이건 React 가 internal virtual DOM을 업데이트 하는 방식과 실제 DOM을 업데이트 하는 방식이 다르기 때문!



###97) React.memo()를 사용한 Functional Component 의 Optimization

`shouldComponentUpdate` 로 class based component를 optimize 하는 것은 알겠다! 그렇다면 lifecycle hook을 못쓰는 functional component 들은?

아래 사진을 보면 input을 바꿀 때마다 functional component 인 `cockpit.js` 의 코드가 (아무 변경사항이 없는데도) 실행되는 것을 볼 수 있다.

![image-20190903221429984](/Users/hanameee/Desktop/PROGRAMMING/REACT_study/Udemy/images/image-20190903221429984.png)

Cockpit의 re-rendering에 관여하는 요소는 

1. persons.length
2. props.title
3. showPersons

이다. 그 외에 각각의 person component의 props등은 전혀 cockpit과 상관이 없다! 이런 불필요한 re-rendering을 막기 위해서는 어떡해야 할까?

#### React.memo()

memoization 을 사용한다. React가 이 component의 snapshot을 저장하고, input이 바뀔때만 re-render 한다. 만약 이 component의 (내 경우 cockpit) input이 바뀌지 않았는데 parent component가 update를 원하면 React는 저장한 snapshot을 돌려준다.

1. export 수정


   ```javascript
   //Cockpit 전체를 React.memo로 감싸준다
   export default React.memo(Cockpit);
   ```
2. cockpit의 prop 수정

   persons가 바뀌어도 cockpit의 props가 영향을 받지 않도록 `Cockpit.js` 수정

   ```jsx
   persons={this.state.persons}
   //위에 대신
   personsLength={this.state.persons.length}
   
   //마찬가지로 if 문도 수정해준다
   if (props.personsLength <= 2) {
       classes.push(styles.red);
   }
   
   if (props.personsLength <= 1) {
       classes.push(styles.bold);
   }
   ```

위처럼 수정하고 나면 이제 input에 타입해서 persons가 바뀌어도 cockpit.js의 코드가 실행되지 않는 것을 볼 수 있다.

이렇듯 React.memo 를 통해 functional components 를 optimize 할 수 있다! Parent component가 변경될 때마다 update 될 필요가 없는 functional component 라면 React.memo로 wrap 해서 관리하는 것이 좋다.



### 98) 언제 Optimization을 해야 하는가

언제 shouldComponentUpdate 와 React.memo 를 사용해  optimization을 해야 할까?

Parent가 update 될 때 높은 확률로 child도 update 되어야 한다면 오히려 optimize 함으로써 불필요한 code를 실행시키게 된다. 이럴 경우 아예 shouldComponentUpdate 와 React.memo 를 add 하지 않는 것이 좋다!



### 99) PureComponent 사용하기

`Persons.js` 에서 지금은

```javascript
shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.persons !== this.props.persons) {
        return true;
    } else {
        return false;
    }
}
```

이렇게 persons 만 체크하고 있지만, 사실 Persons는 prop으로 3개를 가진다

```jsx
<Persons
    persons={this.state.persons}
    clicked={this.deletePersonHandler}
    changed={this.nameChangedHandler}
/>
```

만약 shouldComponentUpdate 에서 persons 뿐만 아니라 clicked와 changed 도 변경되었는지 알고 싶다면?

만약 outside로부터 new function reference가 온다거나 하면 component도 알고 update를 해야하잖아!

이렇게 코드를 수정하면 persons,changed,clicked 중 하나만 바뀌어도 true가 리턴되어 persons가 update 된다!

```javascript
shouldComponentUpdate(nextProps, nextState) {
    if (
        nextProps.persons !== this.props.persons ||
        nextProps.changed !== this.props.changed ||
        nextProps.clicked !== this.props.clicked
    ) {
        return true;
    } else {
        return false;
    }
}
```



이렇게 component의 모든 props를 하나도 빠짐없이  check 하고 싶다면, (단 한개의 props도 빠짐 없이 변경되었나 체크하고 싶다면) 위처럼 하나하나 if문에 추가해줘도 되지만 `PureComponent` 라는 다른  type의 component를 extends 해도 동일한 효과를 누릴 수 있다!

```javascript
import React, { PureComponent } from "react";
...
class Persons extends PureComponent {
```

왜냐면,  PureComponent란 이미 complete props check를 하는 shouldComponentUpdate 를 implement한 컴포넌트이기 때문.

이런 경우 코드를 좀 save 할 수 있겠지 :)