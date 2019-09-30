Section8_ A Real App: The Burger Builder (Basic Version)

### 163) Displaying and Updating the Burger Price
햄버거 가격을 업데이트하고 보여주는 기능을 추가해보자.

햄버거 높이는 재료 갯수에 따라 유동적이므로, build controls 바로 위에 가격이 나타나도록!

`BuildControls.js`
```jsx
const buildControls = ( props ) => {
    <div className = {styles.BuildControls}>
     <p>Current Price: {props.price}</p>
    </div>
} 
```

Price는 BurgerBuilder의 totalPrice state에서 관리된다.

`BurgerBuilder.js`

```jsx
...
return (
    <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
            ...
            price={this.state.totalPrice} />
    </Aux>
);
...
```
이렇게 price props로 BuildControls에게 넘겨준다.

- 개선사항1) 스타일링 수정
- 개선사항2) 소수점 자리 고정 (toFixed 사용)
`BuildControls.js`
```jsx
const buildControls = ( props ) => {
    <div className = {classes.BuildControls}>
     <p><strong>Current Price: </strong>{props.price.toFixed(2)}</p>
    </div>
} 
```



### 164) Adding the Order Button

계산 버튼을 만들고, 해당 버튼을 누르면 주문 내역을 보여주는 modal 창을 뜨게 만들어보자!

계산 버튼은 BuildControls 밑에 들어가면 되겠지?

`BuildControls.js`

```jsx
  const buildControls = ( props ) => (
    <div className = {styles.BuildControls}>
      ...
      {/* buildControls 맨 밑에 추가해준다 */}
      <button className = {styles.OrderButton}>ORDER NOW</button>
    </div>
```

css 파일은 첨부파일 확인!

재료를 추가하지 않았으면 버튼이 눌리지 않게끔 하고싶다. 재료 갯수를 state로 관리하는 부분은 burger builder!

`BurgerBuilder`

```jsx
 class BurgerBuilder extends Component {
   ...
      	//재료 갯수에 따라 구매가능 여부를 tracking할 state 변수를 만들어주자
        purchasable: false
    }
```

그리고 재료 갯수에 따라 purchasable을 업데이트 해줄 handler도 만들어준다! 이 handler은 ingredient 갯수 변경에 관여하는 핸들러들 (addIngredientHandler, removeIngredientHandler) 이 실행될 때마다, 그 마지막에 updatedIngredient를 argument로 받아 실행될 것임.

```jsx
updatePurchaseState (ingredients) {
  // 재료-갯수 형태의 ingredient 객체를 Object.keys로 key만 받아오고
  const sum = Object.keys(ingredients).map(igKey => {
    // map을 통해 각 재료들의 갯수들만 array로 리턴하고
    ingredients[igKey]
    // reduce를 통해 array 원소들의 합을 (갯수 총합) flatten 해 더한다.
  }).reduce((sum,el) => {
    return sum+el;
  }, 0);
  this.setState({ purchasable : sum > 0})
}

addIngredientHandler = (type) => {
  ...
  //맨 마지막에 updatePurchaseState 실행
  this.updatePurchaseState(updatedIngredients);
}

removeIngredientHandler = (type) => {
  ...
  //맨 마지막에 updatePurchaseState 실행
  this.updatePurchaseState(updatedIngredients);
}
```



### 165. Creating the Order Summary Modal

이제 order 버튼을 클릭하면 modal이 뜨도록 하고 싶다. (1)modal (2)backdrop=배경막 (3)주문서 이렇게 3개가 필요함!

`components/UI/Modal/Modal.js`

```jsx
import React from 'react';
import styles from './Modal.module.css';

const modal = ( props ) => (
    <div className = {styles.Modal}>
        {props.children}
    </div>
)

export default modal;
```

modal은 결과적으로 특정 원소를 감싸는 div여야 한다. 이 modal을 어디에 추가할 것인가? 실제로 Modal을 띄우고, Modal에 필요한 state와 method를 가지고 있는 BurgerBuilder에서! 

`BurgerBuilder.js`

```jsx
return(
  <Fragment>
    <Modal/>
    <Burger ingredients = {this.state.ingredients}/>
```

이제 ingredients state를 바탕으로 Modal의 props.child로 들어갈 OrderSummary를 만들어내야 하는데, 이미 BurgerBuilder이 포화상태고 최대한 outsource해서 granular, focused components를 만드는 것이 좋으니 OrderSummary를 분리하자!

`components/Burger/OrderSummary/OrderSummary.js`

 BurgerBuilder 로부터 instruction을 받아, 주문 내용을 보여주기! 여러 jsx를 리턴해야하므로 Fragment hoc를 사용한다.

```jsx
import React, {Fragment} from react;

const orderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients).map(
    igKey => {
      return (
      	<li key = {igKey}>
          <span style={{textTransform:"capitalize"}}>{igKey}</span>:{props.ingredients[igKey]}
        </li>
      )
    }
  )
  return (
    <Fragment>
      <h3>Your order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p>continue to Checkout?</p>
    </Fragment>
  )
}

export default orderSummary;
```

이렇게 OrderSummary를 완성해주고, 이걸 BurgerBuild에서 사용하자!

`BurgerBuilder.js`

```jsx
...
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
return(
  <Fragment>
    {/* 이렇게 Modal 안의 child로 OrderSummary를 넣어주기 */}
    <Modal><OrderSummary ingredients={this.state.ingredients}/></Modal>
    ...
```



###166. Showing & Hiding the Modal

지금은 modal 이 항상 보이고 있는데, 이걸 order button이 clicked 되었을 때만 보이도록 바꾸자.
(1) state에 `purchasing` 을 추가하고 (default : false)
(2) purchaseHandler을 통해 관리하자

`BurgerBuilder`

```jsx
class BurgerBuilder extends Component {

    state = {
      	...
        purchasing: false
    }

		// this 바인딩 조심 - 더 공부
    purchaseHandler = (props) => {
        this.setState({purchasing : true});
    }
```

Order button은 BuildControls에 있으니까, BuildControls의 prop으로 전달해준다!

```jsx
return(
  <Fragment>
    <Modal><OrderSummary ingredients={this.state.ingredients}/></Modal>
    <Burger ingredients = {this.state.ingredients}/>
    <BuildControls
      ...
      ordered = {this.purchaseHandler}
      ...
  </Fragment>
);
```

그리고 BuildControls의 button에다가 onClick 으로 주면 되겠지!

`BuildControls`

```jsx
<button 
  disabled = {!props.purchasable} 
  className = {styles.OrderButton}
  {/* 이렇게 주면 됩니당 */}
  onClick = {props.ordered}>
  ORDER NOW
</button>
```



이제 purchasing state의 상태에 따라 Modal을 conditionally render 하면 되겠지!
그런데 이번에는 사라지고 나타날 때 animation을 주고 싶으니, css를 바꾸는 식으로 해볼 것.

`BurgerBuilder.js`

```jsx
{/* Modal에 show prop을 pass 해주고 purchasing state를 bind 해주자 */}
<Modal show = {this.state.purchasing}>
```

`Modal.js`

이제 show property에 따라 Modal을 바꿔볼 것임

`Modal.js`

```jsx
const modal = ( props ) => (
    <div 
    className = {styles.Modal}
    // 첫번째 bracelet은 dynamic을 위해, 두번째 bracelet은 JS object쓰려고
    style = {{
      	// props.show가 true면 보이고, false면 안보임 - transform 공부
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity : props.show ? '1':'0'
    }}>
```

이렇게 주면 끝!



###167. Implementing the Backdrop Component

모달 뜰때 뒤에 깔리는 Backdrop을 만들어보자.

`UI/Backdrop/Backdrop.js`

```jsx
import React from 'react';
import styles from './Backdrop.module.css'

// prop을 받아 show가 true면 Backdrop class와 onClick event를 가진 div를 리턴하고, 아니면 null을 리턴
const backdrop = (props) => (
   props.show ? <div className = {styles.Backdrop} onClick = {props.clicked}></div> : null
);

export default backdrop;
```

`Backdrop.module.css`

```css
.Backdrop {
    width: 100%;
    height: 100%;
    position: fixed;
    /* above other element, but below modal */
    z-index: 100;
  	/* 좌측상단부터 시작 */
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
```



이 Backdrop은 모달이 뜰때 뒤에 깔리는 거니까, Modal에 추가해주자!

`Modal.js`

```jsx
import React, { Fragment } from "react";
import styles from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";
const modal = props => (
    <Fragment>
  			{/*Backdrop을 modal과 나란히 놓아야하니까 hoc = Fragment 사용*/} 
        <Backdrop show={props.show}/>
        <div
```



또,  Backdrop을 누르면 Modal이 꺼지도록! 아까 Backdrop component에 줬던 `onClick = {props.clicked}` 을 Backdrop을 사용하는 Modal에서 활용하자

```jsx
const modal = props => (
    <Fragment>
  			{/*clicked prop에 props.modalClosed를 바인딩*/} 
        <Backdrop show={props.show} clicked={props.modalClosed}/>
        <div
```

여기서의 prop은 `BurgerBuilder` 로부터 왔으므로

```jsx
purchaseCancleHandler = () => {
  // 주문을 취소하는거니까 purchasing state를 다시 false로 해준다
  this.setState({ purchasing: false }); 
};

...

<Modal
  show={this.state.purchasing}
  {/*modalClosed에 purchaseCancleHandler을 엮어준다*/}
  modalClosed={this.purchaseCancleHandler}
  >
```

이렇게 해주면 backdrop을 클릭했을때 backdrop도 null이 되고 (show가 false가 되므로), modal도 css style이 변경되어 보이지 않게 된다. (with animation)



###   168. Adding a Custom Button Component

계속 주문하기 (continue), 주문 취소하기(candle) 버튼을 만들어보자!
이건 Modal 안의 orderSummary에서 관리해야겠지.

`OrderSummary`

```jsx
<Fragment>
  ...
  <p>continue to Checkout?</p>
  <button>CANCLE</button>
  <button>CONTINUE</button>
</Fragment>
```

일단 지금은 두 버튼 모두 backdrop을 클릭했을때 모달이 닫히는 거랑 유사하게 작동해야 함. continue를 만드려면 주문을 서버에 보내고 그런 작업이 필요하니까! 이건 차차 할 것임.

버튼 스타일링을 재사용 할 수 있도록 outsource 해보자.

`UI/Button/Button.js`

```jsx
import React from "react";
import styles from "./Button.module.css"
const button = props => (
    <button onClick={props.clicked}
    className={[styles.Button, styles[props.btnType]].join(' ')}>{props.children}</button>
);

export default button;
```

`UI/Button/Button.module.css`
강의에서 준 파일 사용

`OrderSummary`

```jsx
<Fragment>
  ...
  <Button btnType='Danger' clicked={props.purchaseCancelled}>CANCLE</Button>
  <Button btnType='Success' clicked={props.purchaseContinued}>CONTINUE</Button>
```

Button 에 btnType과 clicked를 주고, clicked에서는 OrderSummary를 사용하는 BurgerBuilder에서

`BurgerBuilder`

```jsx
purchaseCancleHandler = () => {
  this.setState({ purchasing: false });
};

purchaseContinueHandler = () => {
  alert("You continue!");
};

...

<OrderSummary
  ingredients={this.state.ingredients}
  purchaseCancelled={this.purchaseCancleHandler}
  purchaseContinued={this.purchaseContinueHandler}
  />
```

이렇게  purchaseCancleHandler과 purchaseCoutinueHandler을 만들어 준다.



### 171. Adding a Toolbar

 `components/Navigation/Toolbar/Toolbar.js`

```jsx
import React from 'react';
import styles from "./Toolbar.module.css";

const toolbar = (props) => (
    <header className = {styles.Toolbar}>
        <div>MENU</div>
        <div>LOGO</div>
        <nav>
            ...
        </nav>
    </header>
)
export default toolbar;
```

상응하는 css도 추가.

그럼 이 toolbar을 어디에 추가할까? BurgerBuilder 외에도, 우리가 Load하는 모든 page에다가 toolbar을 추가하고 싶으니까 Layout에 추가하면 좋겠지 :)

`Layout.js`

```jsx
...
import Toolbar from '../Navigation/Toolbar/Toolbar'
const layout = ( props ) => (
    <Fragment>
        <Toolbar/>
    		...
)

export default layout;
```

이렇게 추가를 해줍니다!



### 172. Using a Logo in our Application

Logo를 navigation에 추가하는 것이 아니라, **component로 추가**해 줄것임. 이후 Application의 어디에서도 사용할 수 있기 때문에!

`components/Logo/Logo.js`

```jsx
import React from 'react';
import styles from './Logo.module.css'
import burgerLogo from '../../assets/images/burger-logo.png';
const logo = (props) => (
    <div className = {styles.Logo}>
        {/* 결국 webpack이 모든 파일을 bundle할것이기에 src에 주소를 주면 안되고 import해서 가져와야 한다. 이렇게 해야 webpack이 내가 해당 이미지를 사용하는 것을 알 수 있다. */}
        <img src={burgerLogo} alt="MyBurger"/>
    </div>
);

export default logo;
```

이렇게 해주고, Toolbar에 추가해준다!

`Toolbar.js`

```jsx
...
import Logo from '../../Logo/Logo'
...
const toolbar = (props) => (
    <header className = {styles.Toolbar}>
        <div>MENU</div>
        <Logo/>
    		...
export default toolbar;
```



**🔑 KEY TAKEAWAYS 🔑**

`Logo.js` 에서 src/assets/images 에 있는 png 파일을 가져올 때, `<img src = ... >` jsx 태그 안에  png 파일의 상대경로를 입력하면 작동하지 않는다.

왜일까?😯

React의 build workflow가 set up 되는 과정을 생각해보면, webpack이 모든 파일을 가져가다 bundle하고, 새로운 output folder을 만들 것임. 이 과정들은 메모리 상에서 일어나기에 development 할 때는 알 수 없지만, 이후 앱을 배포하고 나면 우리는 optimized, compiled, bundled 된 assets들이 들어있는 새로운 폴더가 생기게 된다.

따라서 `../../assets/images/burger-logo.png` 이 위치에 있는 assets들은 실제 서버에 전달되지 않는다. 애초에 전체 src 폴더가 서버로 전달되지 않는다!

그렇다면 해결방법은? 😯 

아래처럼 `import` 를 사용해서 우리가 Image를 여기서 가져다 쓴다고 webpack에게 알려줘야 함.

```js
import burgerLogo from '../../assets/images/burger-logo.png';
```

이렇게 알려주면 웹팩은 이 이미지를 special plug-in or a special module (that was added to webpack, to its config) 을 사용해 handle 할 것임.

이미지를 새롭게 생성된 destination directory 에 복사하고, (only in memory during development) 최적화도 할 것임!

```jsx
<img src={burgerLogo} alt="MyBurger"/>
```

src에 상대경로가 아니라 이렇게 dynamic 하게 가져오게 되면 이건 path where webpack stored the optimized and copied image 를 의미한다 :)



### 173. Adding Reusable Navigation Items

Navigation item들도 나중에 sidebar에서 재활용 할 거라서 따로 outsource 하자!
또한, 각 item들도 꽤나 스타일링을 많이 해줄거니까, item으로 따로 빼서 관리하자.

`components/Navigation/NavigationItems/NavigationItems.js`

```jsx
import React from 'react';

const navigationItems = (props) => (
    <ul>
        <li><a href = "">A Link</a></li>
    </ul>
);

export default navigationItems;
```

`components/Navigation/NavigationItems/NavigationItem/NavigationItem.js`

이친구는 individual navigation item을 들고 있는것임!



### 174.  Creating a Responsive Sidedrawer

Navigation 안에 포함될 SideDrawer을 만들어보자.

`/Navigation/Sidedrawer/SideDrawer.js`

```jsx
import React from 'react';
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems';
import styles from './SideDrawer.module.css'
const sideDrawer = (props) => {
    return (
        <div className = {styles.SideDrawer}>
            <Logo />
            <nav>
                <NavigationItems />
            </nav>
        </div>
    );
};

export default sideDrawer;
```

`SideDrawer.module.css`

```css
.SideDrawer {
    position: fixed;
    width: 280px;
    max-width: 70%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 200;
    background-color: white;
    padding: 32px 16px;
    box-sizing: border-box;
    transform: transform 0.3s ease-out;
}

@media (min-width: 500px) {
    .SideDrawer {
        display: none;
    }
}

.Open {
    transform: translateX(0)
}

.Closed {
    transform: translateX(-100%)
}
```

미디어 쿼리를 이용해서 500px 이상일때는 안보이게, 500px 이하일때는 보이게 한다!

다만 지금은 Logo나 NavigationItem을 반응형에 맞게 조절해주지 않은 상태이므로 몬생김. 이걸 수정해주자!



### 175. Working on Responsive Adjustments

반응형을 위해 Logo와 NavigationItems 고치기!

Logo 먼저 고쳐보자. 지금은 height:80%로 되어있는데, 이건 부모 높이의 80%를 의미한다. 지금 Logo는 `Toolbar` 과 `Sidedrawer` 에 있는데 Sidebar의 80%를 차지해버리니까 로고가 너무 커진거지!



**🔑 KEY TAKEAWAYS 🔑**

media query를 줘서 작은화면(Sidebar)과 큰화면에 각각 다르게 height %를 줄 수도 있지만, 좀 더 reusable한 Logo를 위해서는, Logo 자체에서 크기를 조정하는 것이 아니라, **Logo를 가져다 쓰는 상위 Component에서 크기를 조정**하는 것이 좋다!

`방법1`: 어떻게? Logo로 height property 값을 props로 pass해주고, Logo component에서는 inline style로 할당해주기

`Logo.js`

```jsx
const logo = (props) => (
	<div className = {styles.Logo} style = {{height : props.height}};
)
```

`SideDrawer.js`

```jsx
<Logo height = "11%"/>
```

이렇게 해주면 Dynamic 하게 inline styles를 줄 수가 있음.

`방법2` : 어떻게? Logo를 div component로 감싸고, 이 div가 height를 control 하도록 하기. div에게 inline styles를 주거나, css classes를 쓰거나 해서!

`SideDrawer.js` & `Toolbar.js`

```jsx
<div className={styles.Logo}>
  <Logo />
</div>
```

이렇게 Logo style을 준 div로 감싸고 (css module 덕분에 가능함!)

`~.module.css`

```css
.Logo {
    height:80%;
    display: flex;
    align-items: center;
}
```

이렇게 줍니다.





### 175. More about Responsive Adjustments

Navigation Items도 Logo처럼 responsive하게 바꿔보자.

기존에 존재하던 CSS를 media query안으로 놓고,  base classes를 mobile에 맞도록 수정하면 된다. 이 때 Mobile에 있는 base classes는 자동으로 Desktop에 merged 되므로 중복해서 선언해줄 필요가 없으니 삭제해주기.

나아가, media query를 써서 발생하는 몇가지 css issue들 (sideDrawer이 켜져도 toolbar의 navigation items가 계속해서 보이는 문제라던가)을 수정해주면 끝!

