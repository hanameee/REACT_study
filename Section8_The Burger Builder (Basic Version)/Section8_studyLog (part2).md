## Section8_ A Real App: The Burger Builder (Basic Version)
## 163) Displaying and Updating the Burger Price
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