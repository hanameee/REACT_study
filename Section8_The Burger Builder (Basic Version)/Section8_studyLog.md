## Section8_ A Real App: The Burger Builder (Basic Version)



###147) Module introduction

재료를 추가하고, 버거를 만들고, 구매하는 실제 application을 만들 것임. 배운 이론을 바탕으로 실제 어플을 만들어 볼 것!

앱을 기획하는 것부터 시작.



### 148) 리액트 앱 기획하기 1 - Core Steps

#### 1. Planning Component Tree / Component Structure

디자이너로부터 디자인을 받거나, 직접 앱 디자인을 했을때 - 이걸 React component로 쪼개야 한다. 마지막 결과물이 초기의 component tree와 다를 수 있지만 (흔하게 그러하고), 처음에 component에 대한 그림을 그리는 것은 아주 중요!

#### 2. Application State (Data)

Application state 란 = 내가 application에서 사용하고 조작할 data!

예를 들어 우리의 burger app에서는 사용자가 추가한 Ingredients에 대한 정보를 트래킹해야한다. 그 정보를 바탕으로 우리가 render 할 정보들과 유저가 마지막에 지불해야할 값을 결정하기 때문에.

#### 3. Components vs Containers

우리 앱 컴포넌트들 중 어떤게 stateless이고, 어떤게 stateful 이 될건지 판단해야 한다. 



### 149. 리액트 앱 기획하기 2 - Layout and Component Tree

![image-20190908214759885](/Users/hanameee/Library/Application Support/typora-user-images/image-20190908214759885.png)

이렇게 root App component에서 시작해 Layout을 짜고, component tree를 구성한다!



### 150. 리액트 앱 기획하기 3 - State 기획

State를 짜야 어떤게 container이고 어떤게 component인지, 또 어떤게 stateless이고 어떤게 stateful component인지 알 수가 있어용



현재 우리가 필요한 state 정보들이 뭐가 있을까?

- ingredients
  - ex) { meat : 2 , cheese : 2 }
- purchased
  - ex) true
- total price
  - ex) 12.99



이 state들을 어디서 관리할까? `Burger builder` 에서 관리할 것임
--> 왜냐면 이 정보들은 App 전체에 영향을 미치는 state들이 아니고, burger에만 영향을 미친다. 따라서 궂이 전체 App에서 알아야 할 필요 없이, burger builder에서만 알고 있으면 된다.

따라서 burger builder app 만 container이고, App을 포함한 나머지 애들은 다 dumb component이면 되겠다. 이 정보를 가지고 project를 만들어보자.



### 151. 프로젝트 세팅

```
yarn create react-app burger-builder
```

`create react-app` 을 통해 만들자!

