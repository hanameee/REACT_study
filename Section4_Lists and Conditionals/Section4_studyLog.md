## Section 4 - Working with Lists and Conditionals

### 51)

이번 모듈에서 할 것 - how to output content conditionally.

- only when certain condition is true
- output lists of data

### 52)

Rendering content conditionally!

버튼을 클릭했을 때, 아래 사람들을 show & hide 하게 하기. 이를 위해선
1) App.js 의 3개의 Person component들을 하나의 div로 wrap 해서, 이 div를 show/hide
2) switchNameHandler을 togglePersonHandler로 바꿔주기!

```javascript
//togglePersonsHandler 메소드 만들때
togglePersonsHandler() {
  
}
//이렇게 하면 this 키워드가 함수 내 scope에 한정되어 문제가 생긴다.
//따라서 this 키워드에 영향을 주지 않는 arrow function으로! > 이부분 더 공부
togglePersonsHandler = () => {
  
}
```



이렇게 한 뒤에, 어떻게 Person 3개를 감싸고 있는 outer div를 dynamically rendering 할까?

우리가 App.js에서 쓰고 있는건 어디까지나 jsx 이므로, JS 코드이다. 따라서 outer div를 `{}` 안에 enclose를 하고, js 코드를 써주면 된다.

단, 주의할 점은 이 `{}` 안에서는 if 같은 block statement를 못쓰고 simple statement 만 쓸 수 있다는 점! JSX 코드 내부이기 때문에 이런 제약사항이 있다. 따라서 우리는 지금은   ternary 문을 쓸 것임 (삼항연산자)

```javascript
{
// 사실 그냥 this.state.showPersons ? 라고만 해도 됨
this.state.showPersons === true ? 
// 1. showPersons가 true이면
<div>
    <Person
        name={this.state.persons[0].name}
        age={this.state.persons[0].age}
    />
    <Person
        name={this.state.persons[1].name}
        age={this.state.persons[1].age}
        click={this.switchNameHandler.bind(this, "Yay!")}
        changed={this.nameChangedHandler}
    />
    <Person
        name={this.state.persons[2].name}
        age={this.state.persons[2].age}
    >
        My Hobbies: Hannah
    </Person>
</div>
// 2. showPersons가 false이면 null
: null
}
```

이제 togglePersonHandler 로직을 완성하자

```javascript
togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({
      	//doesShow가 아닌 것으로 showPersons를 바까주기!
        showPersons : !doesShow
    });
}
```

setState에서 다른 state들은 가만 냅두고 showPersons 만 바꿨지! 변경된 이 state와 다른 untouched state를 merge 해준다.



yarn install 후 yarn start로 실행해보면 button 클릭 시에만 card 들이 rendering 되는 것을 알 수 있다! 숨겨진 것이 아니라, 아예 rendering 되지 않은 것임.



### 53)

52에서 삼항연산자를 사용해 content 를 dynamically 하게 render 하는 법을 배웠다! 하지만 이게 이상적인 방법은 아님. application이 커지면 관리하기가 힘들어지기 때문에!

React 가 화면에 어떠한 것들을 render 할 때, react는 return 뿐만 아니라 render method 전체를 실행한다.

따라서, return smth 하기 전에 render 에서 먼저 code를 실행시킬 수 있는 것!

return 내부에 코드를 작성하면 jsx 제약사항이 없으므로 if statement 도 자유롭게 쓸 수 있다.

```javascript
let persons = null;

if (this.state.showPersons) {
    persons = (
        <div>
            <Person
                name={this.state.persons[0].name}
                age={this.state.persons[0].age}
            />
            <Person
                name={this.state.persons[1].name}
                age={this.state.persons[1].age}
                click={this.switchNameHandler.bind(this, "Yay!")}
                changed={this.nameChangedHandler}
            />
            <Person
                name={this.state.persons[2].name}
                age={this.state.persons[2].age}
            >
                My Hobbies: Hannah
            </Person>
        </div>
    );
}
```

render 내부에 이렇게 persons 변수를 작성한다! showPersons가 true일 경우 persons 변수에 null 이 아닌 해당 jsx 코드가 할당되도록

그리고 return 내부에

```javascript
return (
    <div className="App">
        <button style={style} onClick={this.togglePersonsHandler}>
            Toggle Namecard
        </button>
        {persons}
				//요렇게 persons를 추가해주면 끝!
    </div>
);
```

React에서 update를 trigger 하는 것은 state change임. state가 바뀌면 React가 re-render 한다는 것을 항상 기억할 것!



52번에서 한 것보다, 53번에서 한 것이 return 내부의 template를 clean 하게 유지하면서, conditional content를 output 할 수 있는 (일종의 outsourcing?) 더 선호되는 방법이다.