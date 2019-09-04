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

     

### 102)

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