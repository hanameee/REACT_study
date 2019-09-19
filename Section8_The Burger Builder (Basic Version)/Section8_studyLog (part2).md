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



### 165.Creating the Order Summary Modal

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

```jsx

```



`components/UI/Backdrop/Backdrop.js`