import React, { Component, Fragment } from "react";
import Button from "../../UI/Button/Button";
class OrderSummary extends Component {

    componentDidUpdate(){
        console.log('[OrderSummary]Updated!')
    }
    
    render() {
        const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: "capitalize" }}>{igKey}</span>
                    :{this.props.ingredients[igKey]}
                </li>
            );
        });

        return (
            <Fragment>
                <h3>Your order</h3>
                <p>A delicious burger with the following ingredients:</p>
                <ul>{ingredientSummary}</ul>
                <p>
                    <strong>Total Price : {this.props.price.toFixed(2)}</strong>
                </p>
                <p>continue to Checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancelled}>
                    CANCLE
                </Button>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>
                    CONTINUE
                </Button>
            </Fragment>
        );
    }
}
export default OrderSummary;
