## Section11_ Multi-Page-Feeling in a Single-Page-App: Routing



### 215. Module Introduction

Routing 에 대해 알아볼 것



### 216. Routing and SPAs

SPA & Multi page

- 목적 : To give user a normal web using experience

- How : Show the user different pages for different URLs

React에서는 여러개의 html 파일을 가지고 있는 것이 아니라, 각자 다른 path에서 각자 다른 pages 를 render 해주기 위해 Javascript를 사용한다.

이걸 위해서 우리는 3자 Router package를 사용할 것임

1. Parse URL/Path
2. Read Config
3. Render(Load) appropreate JSX/component