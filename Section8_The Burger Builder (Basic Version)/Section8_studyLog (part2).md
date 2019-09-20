## Section8_ A Real App: The Burger Builder (Basic Version)
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



### 168. Adding a Custom Button Component

