import React , { Component, Fragment } from 'react'; 
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'

const INGREDIENT_PRICES = {
    salad : 0.5,
    bacon : 0.7,
    cheese : 0.4,
    meat : 0.3
}
class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad : 0,
            bacon : 0,
            cheese : 0,
            meat : 0
        },
        totalPrice: 4
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice: updatedPrice,
            ingredients: updatedIngredients
        })
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice: updatedPrice,
            ingredients: updatedIngredients
        })

        // Q. 얘는 왜 안되는 걸까?
        // if(updatedCount<0) {
        //     alert(`There is no ${type} to remove!`);
        // }else {
        //     this.setState({
        //         totalPrice: updatedPrice,
        //         ingredient: updatedIngredients
        //     })
        // }
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for(let key in disableInfo){
            disableInfo[key]= (disableInfo[key]<=0)
            //{salad:true, meat:false ...}
        }
        return(
            <Fragment>
                <Burger ingredients = {this.state.ingredients}/>
                <BuildControls
                    disabled = {disableInfo}
                    price = {this.state.totalPrice}
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    ingredient = {this.state.ingredients}/>
            </Fragment>
        );
    }
}

export default BurgerBuilder;