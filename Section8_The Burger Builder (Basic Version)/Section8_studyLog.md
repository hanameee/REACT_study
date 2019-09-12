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

Css module 사용해주고, [google web font](https://fonts.google.com/) import 해오기 (customize)



### 152. Layout Component 만들기

`components` , `containers` 디렉토리 만들기

- Containers : stateful components (state를 사용하는 class based component나 useState를 사용하는 functional component) 가 들어간다

- Components : dumb / presentational components (어떻게 만들어졌건 상관없이 state를 manage 하지 않는 component) 가 들어간다

  

Layout은 state를 manage 하지 않으니, Component에 /Layout/Layout.js 를 만들어준다

`Layout.js`

```javascript
import React , { Fragment } from "react";
// 참고로 import {  React , Fragment } from "react"; 이케 하면 에러남 ;_;

const layout = ( props ) => (
    <Fragment>
        <div>Toolbar, SideDrawer, Backdrop</div>
        <main>
            {props.children}
        </main>
    </Fragment>
)

export default layout;
```

그리고 `App.js` 에서

```jsx
import React from 'react';
import styles from './App.module.css';
import Layout from './components/Layout/Layout'

function App() {
  return (
    <div className = {styles.App}>
      //props.childeren 으로 이 Layout 태그 안에 있는 놈들을 가져와 렌더링한다
      <Layout>
        <p>say ho~~~~~</p>
      </Layout>
    </div>
  );
}

export default App;

```



###153. Burger Builder Container 만들기

Burger과 Build Controls 2개를 가지는 container을 만들어보자.
: 왜 container 인가? state를 관리할 것이기 때문에!

`containers/BurgerBuilder/BurgerBuilder.js`

```javascript
import React , { Component, Fragment } from 'react'; 
class BurgerBuilder extends Component {
    render() {
        return(
            <Fragment>
                <div>Burger</div>
                <div>Build Controls</div>
            </Fragment>
        );
    }
}

export default BurgerBuilder;
```

`Layout.module.css` 에서 main element에다가 margin top을 주자!



### 154. Adding a Dynamic Ingredient Component

`Component/Burger` 폴더를 만들자.

component들이 늘어나면 비단 stateless / stateful 로 폴더를 구분하는 것 외에도, 이렇게 Component 폴더 안에서도 Burger 폴더를 만드는 것처럼 **Feature** area로 나눠서 folder directory를 관리하는게 좋다.

그래야 manageable 하기 때문에 :)

![image-20190913000424317](/Users/hanameee/Library/Application Support/typora-user-images/image-20190913000424317.png)

이렇게 디렉토리를 구성해주고, css는 강의에 있는 코드를 복사!

`BurgerIngredient.js`


```javascript
import React from "react";
import styles from "./burgerIngredient.module.css";
const burgerIngredient = (props) => {
    let ingredient = null;
  	//switch 문을 통해 특정 경우일 때 ingredient를 정의해준다
    switch (props.type) {
        case "bread-bottom":
            ingredient = <div className={styles.BreadBottom}></div>;
            break;
        case "bread-top":
            ingredient = (
                <div className={styles.BreadTop}>
                    <div className={styles.Seeds1}></div>
                    <div className={styles.Seeds1}></div>
                </div>
            );
            break;
        case "meat":
            ingredient = <div className={styles.Meat}></div>;
            break;
        case "cheese":
            ingredient = <div className={styles.Cheese}></div>;
            break;
        case "salad":
            ingredient = <div className={styles.Salad}></div>;
            break;
        case "bacon":
            ingredient = <div className={styles.Bacon}></div>;
            break;
        default:
            ingredient = null;
    }

    return ingredient;
};

export default burgerIngredient;

```

