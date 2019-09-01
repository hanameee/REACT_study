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



### 54)

지금까지 우리는 Persons 를 hardcode 했다. inflexible 함!

```javascript
<Person
    name={this.state.persons[0].name}
    age={this.state.persons[0].age}
/>
```

만약 persons 에 하나를 추가하거나 삭제했거나 하면 모든게 break 될 거니까!

따라서 어떻게 arrays 를 output 하고, interact, update, change 할 수 있는지 알아볼 것임.



### 55)

위에서 conditional content 로 render 내부에 작성한 persons 변수 내의 JSX 코드를 바꿔보자!

vanila JS 로 작성할 거니까, single curly braces 내부에 작성.

```javascript
{this.state.persons.map(person => {

})}
```

`map` 을 활용해서 persons array 내부 객체 하나하나에 대해 작업할 것임! 우리가 JSX 코드 내부에 작성하므로, react는 map 이 리턴하는 array의 원소 하나하나를 DOM에 render 할 것임. (if it's valid jsx)

그럼 우리가 할 것은 persons array의 원소를 각각 valid JSX 형태로 mapping 해주는 것!

```javascript
{this.state.persons.map(person => {
    return <Person name = {person.name} age = {person.age} />
})}
```

위의 방법이 React 에서 주로 사용하는 방법이다.



### 56)

어떻게 array를 manipulate 하는지를 알아보자.

`Person.js` 에서 person component는 이렇게 정의되어 있다

```javascript
const person = (props) => {
    return (
        <div className = "Person">
            <p onClick={props.click}>I'm {props.name} and I am {props.age} years old!</p>
            <p>{props.children}</p>
            <input type="text" onChange={props.changed} value={props.name}/>
            {/* <input type="text" onChange={props.changed}/> */}
        </div>
    );
}
```

Person component의 첫번째 <p> 가 클릭되었을 때 props.click이 실행되는데, 난 이때 deletePersonHandler 라는 메소드를 실행시킬거임!

새롭게 메소드를 만들어주고 아래 App.js에서 persons state를 mapping 할 때 return 하는 JSX 파일에 click props를 만들어 deletePersonHandler의 참조값을 할당해준다.

```javascript
{this.state.persons.map(person => {
  return <Person name={person.name} age={person.age} click={this.deletePersonHandler}/>;
})}
```



그럼 deletePerson 할 때 내가 지금 지우고 싶은 이 element가 뭔지 어떻게 알 수 있을까!

다행히도 map은 2가지 인자를 받는다. (1) 내가 지금 작업하는 element와, (2) 그 element의 index 값!

```javascript
{this.state.persons.map((person, index) => {
  return <Person
  click={() => this.deletePersonHandler(index)}
  name={person.name} 
  age={person.age}/>;
})}
```

이렇게 map 에서 index를 넘겨주고, click에서도 deletePersonHandler에게 index를 넘겨준다.

```javascript
deletePersonHandler = (personIndex) => {
    const persons = this.state.persons;
    persons.splice(personIndex,1);
    this.setState({persons: persons});
}
```

그리고 deletePersonHandler가 personIndex를 받아, persons가 참조값을 가르키고 있는 this.state.persons array 객체에서 딱 그 Index 원소만 잘라낸 후 (splice) setState를 통해 persons를 변경된 값으로 할당해준다!

하지만 이 approach는 문제점이 있다. 다음 강의에서 ~_~



### 57)

56번에서 택한 방식의 문제는 JS에서 object와 array는 reference type 이기에 

```javascript
const persons = this.state.persons;
```

요렇게 접근하면 persons는 실제 original persons state object 의 참조값(pointer)을 참조하게 된다.

```javascript
persons.splice(personIndex,1);
```

요렇게 splice를 해버리면 original object를 mutate 하는거라서 좋은 방법이 아니다. 복사본을 만드는 것이 좀 더 바람직한 방법! 

이를 위해 (1)splice 대신 slice를 사용해 array를 복사해오거나 (2)spread 연산자를 사용할 수 있다.

(1) slice 사용

```javascript
const persons = this.state.persons.slice();
//persons에 원본 객체의 복사본이 담긴다
persons.splice(personIndex,1);
//원본이 아닌 복사본을 조작!
```

(2) spread 연산자 사용

```javascript
const persons = [...this.state.persons]
persons.splice(personIndex,1);
```

spread 연산자가 더 최신 문법이라 (2)를 더 많이 사용할 것임.

이렇게 immutable fashion 으로 (without mutating original state) update 하는 것이 항상중요하다!



### 58)

지금 App 을 돌려보면 `Warning: Each child in a list should have a unique "key" prop.` 에러가 나온다. 이걸 해결해보자!

Key prop 이란? 우리가 lists of data를 rendering 할 때 꼭 추가해줘야 하는 important property 이다! key property 는 React 가 list를 효과적으로 update 할 수 있게 도와준다!

Key property는 custom component이든, default HTML element 이든 list를 통해 render을 한다면 React가 기본적으로 찾게 된다. 



그럼, 왜 필요한걸까?

React는 virtual DOM을 통해 바뀐 부분에 대해서만 re-render을 진행하는데, list의 요소들이 각각 key prop을 가지고 있지 않다면 전체 list를 re-render 하게 되고 이건 나중에 list가 길어졌을때 큰 비효율을 초래!

```javascript
    state = {
        persons: [
            { id: "1", name: "Max", age: 28 },
            { id: "2", name: "Hannah", age: 25 },
            { id: "3", name: "Jeongho", age: 26 }
        ],
        showPersons: false
    };
```



```javascript
            persons = (
                <div>
                    {this.state.persons.map((person, index) => {
                        return <Person 
                        click={() => this.deletePersonHandler(index)}
                        name={person.name} 
                        age={person.age}
                        key={person.id}/>; 
                    })}
                </div>
            );
```

이렇게 id prop을 state와 persons component에 각각 추가해준다!



### 59)

이제 list 도 있고, 진짜 dynamic content가 되었으니, person component의 onChange에 걸린 changed prop에 state를 update하는 eventListener이나 method를 연결해주자!

App.js에 Person JSX 코드에 changed prop을 추가해준다

```javascript
persons = (
    <div>
        {this.state.persons.map((person, index) => {
            return <Person 
            click={() => this.deletePersonHandler(index)}
            name={person.name} 
            age={person.age}
            key={person.id}
						//map 안이니까 person에 접근 가능
            changed={(event) => this.nameChangedHandler(event, person.id)}/>;
        })}
    </div>
);
```

그리고 nameChangedHandler 역시 수정!

```javascript
nameChangedHandler = (event, id) => {
  	//findIndex는 주어진 판별함수를 만족하는 배열의 첫번째 요소에 대한 인덱스를 반환함
    const personIndex = this.state.persons.findIndex(p => {
        return p.id === id;
    });

    const person = {
        //this.state.persons[personIndex] 라고 하면 원래 object를 mutate하는 거니까 spread operator을 사용해서 항상 복사본으로, Immutable 하게 
        ...this.state.persons[personIndex]
    }

    //alternative approach - depreciated
    // const person = Object.assign({}, this.state.persons[personIndex]);
    
    person.name = event.target.value;

    const persons = [...this.state.persons];
    //변경된 person을 복사본 persons array에 update 해준다
    persons[personIndex] = person;
    this.setState( {persons: persons} );
};
```

1.event와 id 2개의 argument를 받아 persons array 중 넘겨받은 id값을 만족하는 요소의 index를 personIndex에 저장한다.

2.person에 persons array 복사본의 personIndex에 해당하는 요소를 저장한다

3.person의 이름을 input으로 입력받은 값으로 변경한다

4.setState에 사용하기 위해 기존 persons array의 복사본 persons를 만든다

5.새로운 persons의 해당 index에 name이 input 값으로 업데이트된 person을 넣어준다

6.setState로 persons를 업데이트한다



이제 input이 입력될 때마다 nameChangedHandler이 실행되면서 변경된 배열요소만 re-rendering 될 것임!



### 60)

1. content를 conditional 하게 output 하는 방법을 배웠다. JS 문법을 이용해서! 사전에 변수에 null을 할당해두고, if 문 내부에 JSX variable을 해당 변수에 할당해 if 조건문이 참이면 변수에 JSX가 할당되고, 아니면 null로 남아있도록!
2. List를 동적으로 output 하는 방법. map function은 현재 함수를 실행하는 원소도 argument로 제공하지만, 그 원소의 index도 두번째 argument로 제공한다는 점! 이 index를 이용해 remove 를 구현했었다.
3. List의 경우 react가 효과적으로 update를 할 수 있도록 key prop을 꼭 추가해줘야 한다는 점
4. List 원소 중 무언가 event가 일어나는 친구에게만 특정 함수를 실행시키는 법에 대해서도 배웠다. (nameChangedHandler) 

