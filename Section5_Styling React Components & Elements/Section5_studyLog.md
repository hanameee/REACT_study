## Section 5 - Styling React Components & Elements

### 63)

이번 모듈에서 할 것 - how to style React Component and elements

(1) how to dynamically adjust styles or class names

(2) how to work around restriction of either using inline styles and hence having scoped styles but having limitations (media queries or pseudo selectors 못쓰는 것)
or using css files and then having global styles. 

이런 것들을 handling 하는 방법들이 있당

### 64)

현재의 styling 에는 문제가 있다

1. button - hover 시 스타일 바뀌지 않는 것 : styled with inline style! 

   ```javascript
   render() {
       const style = {
           backgroundColor: "white",
           font: "inherit",
           border: "3px solid blue",
           padding: "4px",
           margin: "10px",
           cursor: "pointer"
       };
   ...
   
   return (
       <div className="App">
           <button style={style} onClick={this.togglePersonsHandler}>
               Toggle Namecard
           </button>
           {persons}
       </div>
   );
   ```

   이런 `inline style 방식` 으로는 pseudo selector을 쓸 수 없다.

   Alternative 로는 css 파일을 분리시켜서 쓰는 방법이 있으나, 이 경우엔 모든 button 들에게 global 하게 적용된다는 단점이 있다!

   이 문제에 대해 다룰 것임

2. style을 dynamic 하게 바꾸는 법 : 버튼 누르면 초록색, 삭제하면 빨간색 등등등...



### 65)

Dynamically assign style 하는 법

만약 button background color을 다르게 하고 싶다면?

```javascript
render() {
    const style = {
        backgroundColor: "green",
        color: "white",
        font: "inherit",
        padding: "4px",
        margin: "10px",
        cursor: "pointer"
    };

    let persons = null;

    if (this.state.showPersons) {
      ...
        style.backgroundColor = "red"
    }
```

이렇게!

모든 것은 javascript 이므로 style 변수 (객체)의 backgroundColor 속성값에 접근해서 바꿔주면 된다.

className 도 배열로 관리해서 동적으로 변경해줄 수 있는데, 이건 다음 강의에서 :)



### 66)

state의 persons array의 잔여 element 갯수에 따라 App component 안의 p가 각각 다른 class 를 가지도록 하게 하고 싶다면!

`app.css`

```css
.red {
  color : red;
}

.bold {
  font-weight: bold;
}
```

이렇게 class를 정의해주고

`app.js`

```javascript
let classes = ["red", "bold"].join(" "); //red bold 가 될 것임
//이렇게 array로 한뒤 join을 통해 string 덩어리로 만들어줘야 나중에 dynamically 변경이 가능하다

return (
    <div className = "App">
        <p className = {classes}>I change my class depending on persons array length!</p>
        <button style={style} onClick={this.togglePersonsHandler}>
            Toggle Namecard
        </button>
        {persons}
    </div>
);
```



만약 state의 persons element 갯수에 따라 classes를 다르게 주고 싶다면

```javascript
const classes = [];

//persons.length가 2 이하일 경우 red
if(this.state.persons.length <= 2) {
    classes.push("red");
}

//persons.length가 1 이하일 경우 bold도 추가
if(this.state.persons.length <= 1) {
    classes.push("bold");
}


return (
    <div className = "App">
  			//className을 줄때 공백을 주고 join을 해주면 string 덩어리로 받을 수 있음
        <p className = {classes.join(" ")}>I change my class depending on persons array length!</p>
        <button style={style} onClick={this.togglePersonsHandler}>
            Toggle Namecard
        </button>
        {persons}
    </div>
);
```

이런 식으로 dynamically assign classes가 가능하다!

주의할 점은, 맨 마지막에 className을 줄 때 classes.join(" ") 을 통해 string으로 들어가게끔 해주는 것.



### 67)

지금 normal javascript inline styles 로는 pseudo-selector이나 media queries 등이 적용되지 않는다. 물론 css 파일을 별도로 분리하고 unique한 선택자를 줘서 global scope로 적용되지 않게끔 하는 방법이 있긴 하나, javascript inline styles는 어디까지나 javascript 이므로 동적으로 edit 하는 것이 가능하다는 장점이 있기에 이런 restriction을 극복하는 방법이 있다면 좋을 것!

default로는 불가능하지만, third-party-package `radium` 을 설치하면 가능!

```shell
npm install --save radium
```

Radium 이란? React 에서 인기있는 패키지로, inline styles 에서 pseudo selectors and media queries 를 쓸 수 있게끔 해준다!



Radium을 설치한 후에는

`App.js 와 Persons.js`

```javascript
import Radium from "radium";
...
export default Radium(App);
// 이렇게 App을 Radium으로 감싸서 export 하는 형태 = higher order component 방식
// Component를 Component로 감쌈으로써 extra functionality를 inject한다!
```

이렇게 Radium을 export/import 해주고 style을 수정해준다!



```javascript
const style = {
    backgroundColor: "green",
    color: "white",
    font: "inherit",
    padding: "4px",
    margin: "10px",
    cursor: "pointer",
  	//:hover은 :로 시작해서 valid js property name이 아니니, "" 로 감싸줘야 한다
    ":hover": {
        backgroundColor: "lightgreen",
        color: "black"
    }
};

...

//if 내에 있는 style도 (toggle on/off시 conditional 하게 렌더링하기 위해) override 해준다
style[":hover"] = {
    backgroundColor: "salmon",
    color: "black"
}
```

이렇게 Radium을 사용하면 javascript code라서 쉽게 동적으로 수정할 수 있으면서, 딱 내가 원하는 component의 scope에만 한정되면서 pseudo selector과 media query를 쓸 수 있다! media query는 담강의에서!



### 68)

이번엔 Person.js에서 Radium+media query 사용해보자!

export 할 때 App을 Radium으로만 감싸면 됐던 pseudo-selector과는 다르게, media query나 keyframes 같은 transforming selector 들은 entire application을 `StyleRoot` 라는 Radium이 제공하는 special component 로 감싸줘야 한다.



### 70)

앞에서는 radium 이라는 third-party-app을 이용해서 inline style에서도 media query와 pseudo code를 사용하는 법을 배웠다.

그런데 person.css 같은 외부 css 파일이 같은 class이름을 공유하더라도 특정 js component 파일에만 scoped 되고 다른 component에는 영향을 미치지 않으면 편하지 않을까!!

외부 css 파일은 css의 문법 제약 없이 작성할 수 있으니까!

이게 css modules 로 가능하다 :) 모든 것을 scoped css 파일로 관리하기.





`CSS Module` 이란? CSS 클래스를 불러와서 사용할 때 [파일이름]_[클래스이름]__[해쉬값] 형태 `[filename]\_[classname]\_\_[hash]` 로 클래스 name을 자동으로 unique 하게 만들어주어서 컴포넌트 스타일 중첩현상을 방지해주는 기능. (CSS Modules allows the scoping of CSS by automatically creating a unique classname of the format)

단 이를 사용하기 위해선, 꼭 해당 css 파일을 [파일이름].module.css `[name].module.css` 파일명 형태로 저장해야 한다. CSS Module 사용하면 각기 다른 파일들에서 naming이 중첩되는 것을 걱정하지 않고 같은 class 이름을 사용할 수 있다.

이게 무슨 말인고 하면...

`Button.module.css`

```css
.error {
  background-color: red;
}
```

`another-stylesheet.css`

```javascript
.error {
  color: red;
}
```

`Button.js`

```css
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles
import './another-stylesheet.css'; // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```

error 이라는 class 명이 `Button.module.css` 와 `another-stylesheet.css` 모두에서 쓰였지만, css modules 덕분에 clash 가 나지 않는다!

왜냐면 Button.module.css의 className은

```javascript
<button class="Button_error_ax7yz">Error Button</button>
```

요렇게 unique 한 className을 가지게 되기 때문에!



일단 app.js와 persons.js에서 radium의 흔적을 모두 지워주고 시작해보자!

강의에서 eject 하구 그런건 예전 버전임! 최신 버전은 요기서 확인 > [react-scripts@2.0.0 이상에서 지원하는 Adding a CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet)



+) [참고링크 1 - SCSS velopert님 튜토리얼](https://velopert.com/1712)

[참고링크 2 - react component styling velopert님 튜토리얼 ](https://velog.io/@velopert/react-component-styling)



1) App.css 파일을 App.module.css 로 이름 변경해주기

App.module.css 내의 class들은 자동으로 hash 값이 붙어 unique 해질 것이기 때문에, 흔히 사용되는 단어를 class 이름으로 마음대로 사용해도 된다.

```javascript
.App {
  text-align: center;
}

.red {
  color :red;
}

.bold {
  font-weight: bold;
}
```



2) App.js에서 import styles 해오기

```javascript
import styles from "./App.css";
```

styles 를 불러오면 하나의 객체를 전달받게 되는데, 그 안에는 CSS Module 에서 사용한 class 이름과 그 이름을 고유화시킨 값이 key-value 형태로 들어있음!

예를 들어 console.log(styles)를 해보면

```css
{
  red : "App_red__CUMkx"
}
```

이런 식으로 Unique 하게!



3) import 해온 styles를 사용하기

`App.js`

```javascript
return (
  			//더이상 string을 할당하지 않고, import 해온 style 객체의 value값에 접근
        <div className={styles.App}>
            <p className={classes.join(" ")}>
                I change my class depending on persons array length!
            </p>
            <button style={style} onClick={this.togglePersonsHandler}>
                Toggle Namecard
            </button>
            {persons}
        </div>
);
```

마찬가지로, push 하는 것도 string 값을 push 하는게 아니라 객체의 value 값에 접근!

```javascript
if (this.state.persons.length <= 2) {
  	//JS 코드니까! styles의 property에 접근하면 된다.
    classes.push(styles.red);
}

if (this.state.persons.length <= 1) {
    classes.push(styles.bold);
}
```



다음 강의에서는 css modules에서 media query 랑 that hover state 도 작동하도록 해보자!



### 71)

pseudo selector과 media query를 해보잣

일단 button의 inline style과 style 변수를 지워주고 App.module.css 를 바꿔주자!

```css
.App button {
  background-color : green;
  color : white;
  font: inherit;
  padding: 4px;
  margin: 10px;
  cursor: pointer;
}

.App button:hover {
  background-color : lightgreen;
  color : black;
}

/*이렇게 nested 된 class 역시 나중에 styles.Red 로 가져다 쓸 수 있다*/
.App button.Red {
  background-color : red;
}

.App button.Red:hover {
  background-color : salmon;
  color : black;
}
```

 

이제 persons this.state.showPersons 가 true 일 때만 버튼 색깔이 red 로 바뀔 수 있도록 button에 conditional 하게 className을 부여하면 된다.



1. App.js` 의 render 안에 btnClass를 empty string으로 주고

```javascript
let btnClass = "";
```

2. conditional if block 안에

```javascript
btnClass = styles.Red
```

nest 된 애들도 그냥 styles.Red 로 가져다 쓸 수 있다는 점!

요렇게 준다음

3. return 되는 button 안에

```jsx
<button onClick={this.togglePersonsHandler} className={btnClass}>
```

이렇게 className을 주면 된다. btnClass는 string 이니까!





### 72)

`Person.module.css`

```css
@media (max-width: 600px) {
    .Person {
      width: 450px;
    }
  }
```

이렇게!

media query 내에 wrapped 되어 있어도 styles.css로 잘만 가져온당~

`Person.js`

```javascript
import styles from "./Person.module.css";
...
return (
  //이렇게 가져올 수 있다
    <div className = {styles.Person}>
  ...
    </div>
);
```

딱 내가 원하는 component에만 unique 하게 classname을 쓸 수 있다는 점 :)

