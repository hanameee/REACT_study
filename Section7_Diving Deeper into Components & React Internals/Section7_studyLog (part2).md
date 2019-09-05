## Section7_Diving Deeper into Components & React Internals

### 100) React 는 어떻게 DOM을 update 하는가?

브라우저의 DOM을 어떻게 update 할까?

`render()` 이 called 되어도 실제로 real DOM이 render 되는 것은 아니다. Render은 HTML이 마지막에 어떻게 보여야 할지에 대한 suggestion에 더 가깝다.

그러나 render은 이미 displayed 되고 있는 result와 똑같을 가능성이 높기에 불필요한 render call을 막기 위해 shouldComponentUpdate나 React.memo를 쓰는 것!

render() 이 호출된 이후 React의 updating process는 다음과 같다.

![image-20190904192004210](/Users/hanameee/Library/Application Support/typora-user-images/image-20190904192004210.png)

STEP1.Old Virtual DOM과 Re-rendered Virtual DOM 비교

React는 DOM의 2가지 복사본을 가지고 있다.

첫번째는 기존 `Old Virtual DOM`과, 두번째는 render method가 실행되었을 때 생성되는 `re-rendered Virtual DOM` 이다.

이 두가지 DOM에 대한 comparison이 일어난다.

STEP2.Real DOM Update 진행여부 판단

comparison 해서 달라진 점이 있다면 real DOM의 변경된 부분만 re-render 됨.

#### +) Virtual DOM이란?

DOM representation in Javascript 이다. 



### 101) 

Component 안에는 오직 1개의 root JSX element만 들어가야 한다. One single element with as many children as you want. 따라서 adjacent JSX element 를 두는 것은 허용되지 않음.

그런데, 우리 이전 코드에서

```javascript
render() {
    console.log("[Persons.js]] rendering");
    return this.props.persons.map((person, index) => {
        return (
            <Person
                click={() => this.props.clicked(index)}
                name={person.name}
                age={person.age}
                changed={event => this.props.changed(event, person.id)}
                key={person.id}
            />
        );
    });
}
```

map을 통해 array of elements를 return 했었잖아!

React는 element들이 각각 key를 가지고 있는 한 array of adjacent element를 return 하는 것을 허용한다.

`Person.js`

```jsx
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
```

wrapping div를 지우고, array로 만들어서 리턴해도 된다!

```jsx
 return [
        <p key = "i1" onClick={this.props.click}> 
            I'm {this.props.name} and I am {this.props.age} years old!
        </p>,
        <p key = "i2" >{this.props.children}</p>,
        <input  key = "i3" type="text" onChange={this.props.changed} value={this.props.name} />
        {/* <input type="text" onChange={props.changed}/> */}
 ];
```

이렇게 array of element로 return해도 똑같이 실행이 된다.

React가 multiple adjacent top level element를 허용하지 않기에 HTML을 위해서는 technically 필요하지 않더라도 그냥 wrapping div나 section 을 추가해야 함. 이건 약간 redundancy지! 

따라서 styling이나 구조적 이유로 wrapping element가 필요한게 아니라면 array로 리턴하는 방식으로 대체할 수 있다. 그렇지만 element 별로 key도 추가해야하고, 쉼표도 추가해줘야하고... 조금 귀찮지!

따라서 리액트에는 이를 위해 **HOC** = higher order component가 존재한다!

어떠한 HTML code도 render하지 않지만, 그저 React가 요구하는 wrapping component 를 충족시키기 위한 component.

`/hoc/Aux.js`

```javascript
import React from "react";
//우리는 aux에서 JSX 코드를 쓰는게 아니라서 import React를 안해도 된다!

const aux = props => props.children;
//props.children = opening, closing tag 사이에 있는 whatever을 output하는 특별한 property.

export default aux;
```

이렇게 만들고 Person component에서 

```javascript
<Aux>
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
</Aux>
```

해주면 되지롱

아래가 기존에 `<div className = {styles.Person}>` 이라는 wrapping div 가 있었을 때

![image-20190904215254895](/Users/hanameee/Library/Application Support/typora-user-images/image-20190904215254895.png)

아래 hoc를 써서 Aux로 wrapping 했을 때

![image-20190904215237632](/Users/hanameee/Library/Application Support/typora-user-images/image-20190904215237632.png)



#### +) 왜 adjacent, top-level JSX elements를 리턴하는게 불가능한가?

JSX 코드를 javascript 로 translate 해보면 명확해진다.

아래와 같은 JSX 코드가 있다고 가정해보자.

```jsx
import React from 'react';
const heading = props => (
     <h1>{props.title}</h1>
     <h2>{props.subtitle}</h2>
);
export default heading;
```

React는 우리를 위해 대신 위의 JSX 코드를 아래와 같은 javascript 코드로 변환해준다.

```javascript
import React from 'react';
const heading = props => React.createElement('h1', {},
props.title) React.createElement('h2', {}, props.subtitle);
export default heading;
```

`React.createElement( )` 태그가 2번 나오고 있지! 이건 유효하지 않은 자바스크립트 문법이다.
2개의 expression을 return하고 있기 때문이다.

가능한 방법은

- 1. array of React.createElement() calls 를 리턴하거나

     ```javascript
     import React from 'react';
     const heading = props => [
          React.createElement('h1', {key: 'i1'}, props.title),
          React.createElement('h2', {key: 'i2'}, props.subtitle)
     ];
     export default heading;
     // 아까 첫 방식대로 array of keyed JSX elements를 리턴하면 이렇게 translate 된다.
     ```

- 2. 여러 React.createElement() call 을 wrap 하는 한개의 React.createElement() call을 리턴하는 방법이 있다.

     ```javascript
     import React from 'react';
     import Aux from '../hoc/Aux';
     const heading = props => React.createElement(
          Aux,
          {},
          React.createElement('h1', {key: 'i1'}, props.title),
          React.createElement('h2', {key: 'i2'}, props.subtitle)
     );
     export default heading;
     //아까 두번째 방식대로 aux로 wrap하면 이렇게 translate 된다.
     ```

     

### 102) React.Fragment 사용하기

real DOM에 extra DOM(html) element가 rendered 되지 않으면서 adjacent elements를 사용하고 싶으면 Aux를 사용한다.

앞서 props.children을 사용해 직접 만든 Aux component를 사용해도 되지만, React 16.2 버전부턴  자체 built in 된 component를 제공한다.

`React.Fragment` 임!

```javascript
<React.Fragment>
  ...
</React.Fragment>
```

이렇게 사용해도 되고,

```javascript
import React, { Fragment } from "react";
//이렇게 Fragment를 import 한 뒤
<Fragment>
  ...
</Fragment>
//이렇게 . 없이 사용해도 된다
```

Fragment는 기능적으로 Aux와 완전히 동일하게 작동한다.



### 103) Higher Order Component

HOC = 다른 component들을 wrap 하는 component!

우리는 이전에 className을 assign 하기 위해 wrapper div를 사용했었지. 이런 경우가 custom hoc를 만들기 좋은 경우이다.

`/hoc/WithClass.js` (hoc filename은 With로 시작하는 경우가 많다.)

```javascript
import React from "react";

const withClass = props => (
    <div className = {props.classes}>
        {props.children}
    </div>
);

export default withClass;
```

이 withClass 는 단순히 내 component를 wrap 하는 특정 class를 가진 div를 set up 한다.

이 custom hoc는 App.js 에서 아래와 같이 사용할 수 있다.

```javascript
return (
  <WithClass classes = {styles.App}>
  ...
	</WithClass>
)
```

지금은 기존처럼 `<div className = {styles.App}>` 으로 하나, custom hoc로 하나 별반 차이가 없지만 나중에 HTTP request를 날리는 component 를 wrap 해서 HTTP error을 handling하는 경우에 아주 유용하다!

정리하자면, 다른 components 를 감싸는 HOC는 styling이든, additional HTML 구조든, logic이든을 추가한다는 것!



### 104) HOC 를 생성하는 다른 방법

앞서 functional component를 만드는 방식으로 hoc를 만들었다면, hoc를 만드는 방식에 하나 더 있다! 일반적인 JS function 으로 만드는 방식!

```javascript
import React from "react";
//first argument는 우리의 wrapped component가 될거고 이후 그 component를 JSX에서 reference하게 쓰일 것이기에 반드시 대문자로 입력해야 함
//second argument는 hoc에서 필요한 것 - 어떤 종류의 hoc를 만드느냐에 따라 달라짐
const withClass = (WrappedComponent,className) {
  //여기서 리턴값으로 component function 을!!
  return props => (
    <div className = {className}>
    	//이렇게 쓰일거라서 대문자가 필요하지롱
    	<WrappedComponent />
    </div>
  )
}

export default withClass;
```

이걸 어떻게 사용할 것이냐?

`App.js`

```javascript
import withClass from "../hoc/WithClass";
//대문자로 할 필요가 없다. regular JS function 이니까
...

<Aux>
  ...
</Aux>

...

export default withClass(App, styles.App);
//이렇게 App을 첫번째 argument로, className이 될 css module의 styles.App을 두번째 argument로 withClass 함수에게 넘겨주면 됨!
```

HOC를 만드는 2가지 방법 중 (functional component, regular JS function with 2 argument that returns functional component) 어떤걸 사용할 것이냐? = hoc가 수행하는 기능에 따라 다르다!

behind the scenes logic (some Javascript code that handles errors or sends analytics data  등등) 을 담당하는 hoc의 경우 렌더링되는 JSX에는 크게 관여하지 않고 logic에 관여하므로 후자를 사용하는 것이 조금 더 명확하다.

앞으로 강의에서 다양한 hoc를 활용하게 될텐데, (꼭 직접 만드는게 아니더라도 thrid party 패키지를 이용한) 그때마다 hoc가 component에 smth extra를 추가한다는 것을 기억하자!

- style
- HTML code
- extra JS logic 등등...



### 105) Passing props through hoc

`App.js` 에서 App component에 withClass hoc를 적용한 것처럼 `Person.js` 에도 적용해보자!

![image-20190904235041986](/Users/hanameee/Library/Application Support/typora-user-images/image-20190904235041986.png)

적용해보면, className styles는 잘 먹혔는데 data가 다 날라간 것을 볼 수 있다.

우리가 `Person.js` 파일에서 아래와 같이 withClass 를 사용하는데
`export default withClass(Person,styles.Person);`

여기 Person이 WrapperComponent를 담당한다. 그런데 이 WrapperComponent에 어떤 props도 전달되고 있지 않아서 data가 보여지고 있지 않은 것!

withClass 함수가 return 하는 functional component는 props를 파라미터로 받고, 이 props는 Person을 import 해서 person component에 props를 전달한 그 props와 동일하다 (우리 예제에서는 `Persons.js`) 

`Persons.js`

```jsx
<Person
    click={() => this.props.clicked(index)}
    name={person.name}
    age={person.age}
    changed={event => this.props.changed(event, person.id)}
    key={person.id}
/>
```

위에서 전달된 저 props들이 다 아래 withClass의 props에 key-value 형태로 전달되는 것!

```javascript
const withClass = (WrapperComponent,className) => {
    return props => (
        <div className = {className}>
      			//<WrapperComponent props={props}> 이케 하면 안됨 주의주의~
            <WrapperComponent {...props}/>
        </div>
    )
}
```

위처럼 spread operator을 사용해서 props를 전달해주면 정상적으로 data가 넘어가는 것을 볼 수 있다.



### 106) Setting state correctly (in class based component)

우리는 `App.js` 에서 state를 관리하고, setState를 통해 state를 manage 했었다.
예제에서는 바르게 setState를 사용했지만, invalid 하게 사용하는 경우도 있다! 예시로 알아보자.

`nameChangedHandler` 이 called 될때마다 그 갯수를 tracking 하고 싶다고 가정해보자. 이 경우, 우리는 직전의 state ( = previous old state) 를 받아 거기에 +1을 해가면 되겠지! (increment) 

아래처럼 작성하면 될 것 같다.

```javascript
state = {
    persons: [
        { id: "001", name: "Max", age: 28 },
        { id: "002", name: "Hannah", age: 25 },
        { id: "003", name: "Jeongho", age: 26 }
    ],
    showPersons: false,
    showCockpit: true,
  	//changeCounter을 추가해준다 (초기값 0)
    changeCounter : 0
};

...
nameChangedHandler = (event, id) => {
  	...
    this.setState({ 
        persons: persons,
      	//nameChangedHandler의 setState에 changeCounter을 추가해준다
        changeCounter: this.state.changeCounter + 1
    });
};
```

실행해보면 잘 되는걸 알 수 있지만, 위와 같이 old state 를 `this.state.changeCounter` 로 정의하는 방식엔 문제가 있다.

그 이유는 **setState가 state의 immediate update를 보장하지 않기 때문**이다.

React는 setState가 실행되면, state update와 re-render cycle을 실행할 resources가 있을 때 진행하라고 schedule 한다. 작고 간단한 app에서는 주로 이 과정이 instant 하게 일어나겠지만 그게  instant update를 guarantee 하는 것은 아니다.

set state 를 동기적으로 호출해도 그 즉시 execute & finish 하는 것이 아니기 때문에  위에서 우리가 old state를 가져오기 위해 사용한 `this.state.changeCounter` 은 우리의 로직에서  depend 하고 있는 latest state (or the previous state)를 보장하지 않는다!

예를 들어 어플의 어딘가에서 거의 동시에 다른 setState를 호출했고 그 setState가 더 먼저 끝났다면? this.state는 older state일 수도 있다. 핵심은 this.state는 우리가 depend하는 직전의  previous state를 보장하지 못한다는 것. 

그렇다면 대안은?

setState는 일반적으로 Javascript object를 받지만, 아래와 같이 function을 받을 수도 있다!

```javascript
//첫번째 argument는 prevState, 두번째 argument는 props (지금은 사용되지 X)
this.setState((prevState, props) => {
    return {
        persons: persons,
      	//여기서의 prevState는 직전의 state임을 보장한다
        changeCounter: prevState.changeCounter + 1
    };
});
```

이거 중요하니까 꼭 기억하자! state updates that depend on the old state 를 할때는 꼭 setState에서 위의 문법을 사용할 것.



### 107)  

state를 바르게 쓰는 법을 배웠으니 이제 props를 바르게 쓰는 법을 공부해보자

`Person.js` 에서 우리는 Person 컴포넌트에서 아래와 같은 props를 받는다.

```javascript
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
```

Name, age, changed, click 등의 prop을 받고 있는 것을 볼 수 있다.

지금은 내가 만든 프로젝트라 어떤 컴포넌트가 어떤 prop을 쓰는지 다 알고 있지만, 여럿이서 프로젝트를 진행하거나, 타인이 만든 라이브러리를 쓸 때는 그렇지 않을 수도 있다!

만약 age prop으로 계산을 해야 하는데 실수로 age prop에 string을 넘긴다면? (틀린 type) 받지 않는 prop인 hobby를 넘긴다면? (없는 prop)

-  어떤 컴포넌트가 어떤 props를 사용하는지 알려줄 수 있다면
- incorrect props를 pass했을때 error나 warning을 throw할 수 있다면

훨씬 좋을 것!



`prop-types` 라는 외부 package를 통해 할 수 있다. React team이 제공하는 추가 설치 패키지. 

1. 설치 `npm install --save prop-types`

2. import 해오기

   ```javascript
   // 대문자 권장
   import PropTypes from "prop-types"
   ```

3. component 선언문 이후에 사용하기 (functional & class based 다 된다)

   ```javascript
   class Person extends Component {
       render() {
           console.log("[Person.js]] rendering");
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
       }
   }
   //위처럼 class definition 후, 혹은 function setup 뒤 변수에 할당한 후, component에 접근 할 수 있지!
   
   //이 propTypes는 반드시 소문자 p로 시작되어야 함 (special property = it will be a JS object from now on. React는 development mode에서 내가 incorrect props를 넘기면 warning을 줄 것임)
   Person.propTypes = {
       click : PropTypes.func,
       name : PropTypes.string,
       age : PropTypes.number,
     	changed : PropTypes.func 
   }
   //위처럼 key-value pair로 [prop name - PropTypes.자료형] 을 정의
   ```

이렇게 proptype을 정해주고 난 후 `App.js` 에서 age prop을 string으로 변경해보면 아래와 같은 에러가 뜬다.

![image-20190905232036726](/Users/hanameee/Library/Application Support/typora-user-images/image-20190905232036726.png)

협업할 때 development mode에서 잘못된 proptype을 잡아낼 수 있으니까 유용하다.

모든 component에 적용해야 하는 것은 아니지만

- 중요한 component나 다른 개발자들과 함께 사용할 component library를 만들 때
- which props your components take & which type of data goes into which prop 이 명확하지 않을 때

이럴때는 곡 prop type을 사용하는게 좋다!