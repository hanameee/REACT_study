## Section6_Debugging React Apps

### 75)

React 의 error message를 읽고 디버깅 하는 법에 대해서 배워보자

### 76)

nameChangedHandler 에 error을 추가할 것임

```javascript
// person.name = event.target.value;
person.name = event.input.value;
```

일부러 잘못 접근해보자!

이렇게 하고 localhost 띄워보면 처음엔 잘 뜨지만 input 창에 쳐보면 에러 쫙 뜬다.

콘솔창을 띄워보면,

`Uncaught TypeError: Cannot read property 'value' of undefined` 라고 뜬다.

event에는 input이라는 property가 없기 때문에!



그럼 우리는 아! App.js:39 저부분이 잘못되었구나! 를 알고, html event documentation에 가서 event.target 으로 고칠 수 있겠지.



error message는 아주 쓸모있고, Line number도 꼭 봐야 한다.

그런데 logic error은 어떻게 알아낼 수 있을까? :) 다음 강의에서!



###77)

보통은 logical error이 더 많다. 에러메세지가 뜨진 않지만, 뭔가 뜻대로 안되는 경우.

이때는 어떡할까?



예를 들어 nameChangedHandler 에서

```javascript
const personIndex = this.state.persons.findIndex(p => {
    // return p.id === id;
    return p.userId === id;
});
```

이렇게 하면, p에는 userID라는 속성이 없어서 undefined 겠지만 JS에서 undefined와 무언가를 비교하는건 error을 떤지진 않는다. 단지 맞는 id 를 가진 person을 못 찾아낼 뿐.



이 경우에 다시 update 해보면 input에 입력도 안되고, 당연히 p도 업데이트 안된다! 이건 어떻게 고칠 수 있을까?



크롬 개발자 도구에서 sources 탭을 활용하자.

browser에서 돌아가는 코드가 아니더라도 debug를 할 수 있다! 짱짱맨



지금 문제는 input에다 쳤을때 뭔가 원하는 대로 안되는 상황이고, 우리는 input에다 쳤을때 fire 되는 함수가 nameChangedHandler이라는걸 알고 있다. 그러니까 nameChangedHandler 함수 시작 첫줄에다가 breakpoint를 걸어보자



breakpoint 를 걸고 input에 하나 쳐본 뒤 chrome의 debugger을 이용해서 stepInto 해보자.

이후 p.userId 에 hover over 해보면 p.userId가 undefined 라는 것을 알 수 있음.



chrome browser developer tool의 sourcemap, source tab을 이용해 debugging 하면서 logical error을 수정할 수 있다.



### 78)

React app의 current state를 알고 싶은데, developer tool로 되긴 되지만 좀 불편할 때! Chrome 에는 react developer tools 라는 확장기능이 있당.

설치 고고링!



###79)

만약 내 코드가 runtime 에서 오류가 생긴다면?

`Person.js` 에서 person component에 30% 의 확률로 error을 리턴시켜보자

```javascript
const person = (props) => {
    const rnd = Math.random();

    if (rnd > 0.7) {
        throw new Error( "something went wrong");
    }
  ...
}
```

이런 error을 catch 해서 잘 다룰 수 있다면 좋을 것!

React 16 이상에 추가된 기능, ErrorBoundary를 사용해서 해보자.

Src 폴더 밑에 ErrorBoundary 폴더를 만들고, ErrorBoundary.js 파일을 만들자!

`ErrorBoundary.js`

```javascript
import React, {Component} from "react";
class ErrorBoundary extends Component {
    state = {
        hasError : false,
        errorMessage : ""
    }

		//potential error 과 some additional information passed를 받는다. 우리가 ErrorBoundary 로 wrap 한 component가 error을 throw 할 때마다 실행될 것임
    componentDidCatch = (error, info) => {
        this.setState({
            hasError : true,
            errorMessage : error
        })
    }
    render() {
        if(this.state.hasError) {
            return <h1>Something went wrong</h1>;
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary;
```



`App.js`

Person component를 ErrorBoundary로 감싸준다!

```javascript
<ErrorBoundary key={person.id}>
    <Person
        click={() =>
            this.deletePersonHandler(index)
        }
        name={person.name}
        age={person.age}
        changed={event =>
            this.nameChangedHandler(
                event,
                person.id
            )
        }
    />
</ErrorBoundary>
```



ErrorBoundary = higher order component 이다! a component which simply wraps a component with the goal of handling any errors that component might throw.



Fail 할 것 같은 code만 ErrorBoundary로 wrap 해라! runtime에 fail할 가능성이 있고, 그걸 prevent 할 수 없을때 custom error message를 던지기 위한 용도로 사용해라. Don't overuse it.



실행해보면 똑같이 에러창이 뜨지만, 이건 우리가 developer mode에 있기 때문. Production mode에서는 에러가 생긴 친구만 우리의 custom error (ErrorBoundary에서 render하는)로 대체되고, React 앱은 잘 돌아간다.

