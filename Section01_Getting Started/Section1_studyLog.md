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