## Section7_Diving Deeper into Components & React Internals

### 109) Refs 사용하기

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

