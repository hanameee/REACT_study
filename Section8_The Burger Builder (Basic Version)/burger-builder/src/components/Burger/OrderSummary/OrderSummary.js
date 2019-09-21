import React, { Fragment } from "react";
import Button from '../../UI/Button/Button'
const OrderSummary = ( props ) => {
    const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
        return (      
        <li key={igKey}>
            <span style={{ textTransform: "capitalize" }}>{igKey}</span>:
            {props.ingredients[igKey]}
        </li>
        )
    });
    return (
        <Fragment>
            <h3>Your order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>continue to Checkout?</p>
            <Button btnType='Danger' clicked={props.purchaseCancelled}>CANCLE</Button>
            <Button btnType='Success' clicked={props.purchaseContinued}>CONTINUE</Button>
        </Fragment>
    );
};

export default OrderSummary;
