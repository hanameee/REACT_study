import React, { Component, Fragment } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from '../../axios-order'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 0.3
};
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('/ingredients.json')
        .then(response => {
            this.setState({
                ingredients: response.data
            })
        })
        .catch(error => {
            this.setState({
                error: true
            })
        })
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    };

    purchaseCancleHandler = () => {
        this.setState({ purchasing: false });
    };

    purchaseContinueHandler = () => {
        this.setState({
            loading: true
        });
        // alert("You continue!");
        const order = {
            ingredient : this.state.ingredients,
            price : this.state.totalPrice,
            customer : {
                name : 'Hannah',
                address : {
                    street : 'Anam',
                    zipCode : '111',
                    country : 'South Korea'
                },
                email : 'test@test.com',
            },
            deliveryMethod : 'fastest'
        }
        axios.post('/orders.json', order)
        .then(response => {
            this.setState({
                loading: false,
                purchasing: false
            });
        })
        .catch(error => {          
            this.setState({
                loading: false,
                purchasing: false
            });
            console.log(error);
        });
    };

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchasable: sum > 0 });
    }

    addIngredientHandler = type => {
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
        });

        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
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
        });

        this.updatePurchaseState(updatedIngredients);

        // Q. 얘는 왜 안되는 걸까?
        // if(updatedCount<0) {
        //     alert(`There is no ${type} to remove!`);
        // }else {
        //     this.setState({
        //         totalPrice: updatedPrice,
        //         ingredient: updatedIngredients
        //     })
        // }
    };

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
            //{salad:true, meat:false ...}
        }

        let burger = this.state.error ? <h2>Ingredient's can't be loaded!</h2> : <Spinner/>;
        let orderSummary = null;

        if(this.state.ingredients) {
            burger = 
            <Fragment>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    disabled={disableInfo}
                    ordered={this.purchaseHandler}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    ingredient={this.state.ingredients}
                />
            </Fragment>

            orderSummary = 
            <OrderSummary
            ingredients={this.state.ingredients}
            purchaseCancelled={this.purchaseCancleHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice}
            />    
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }
        
        return (
            <Fragment>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancleHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Fragment>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios) ;