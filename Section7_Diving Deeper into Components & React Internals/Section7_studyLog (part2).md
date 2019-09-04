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

