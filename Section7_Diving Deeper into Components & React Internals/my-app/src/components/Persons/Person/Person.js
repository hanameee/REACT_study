import React, { Component, Fragment } from "react";
import styles from "./Person.module.css";

import Aux from "../../../hoc/Aux";
import AuthContext from "../../../context/auth-context";
import PropTypes from "prop-types"
import withClass from "../../../hoc/WithClass";
//우리는 component를 extends 한 class를 만드는게 아니라 그냥 function을 만들거라서 App.js 에서처럼 component를 Import 해올 필요가 없음

//props는 제한되지 않은 숫자의 arguments 를 받을 수 있다.

class Person extends Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.inputElement.current.focus();
    }

    render() {
        console.log("[Person.js]] rendering");
        return (
            <Fragment>
                {this.context.authenticated ? <p>Authenticated!</p> : <p>You need to login</p>}
                <p onClick={this.props.click}>
                    I'm {this.props.name} and I am {this.props.age} years old!
                </p>
                <p>{this.props.children}</p>
                <input
                    // ref={(inputEl)=>{this.inputElement = inputEl}}
                    ref={this.inputElement}
                    type="text"
                    onChange={this.props.changed}
                    value={this.props.name}
                />
            </Fragment>
        );
    }
}

Person.propTypes = {
    click : PropTypes.func,
    name : PropTypes.string,
    age : PropTypes.number,
    changed : PropTypes.func
}
// export default person;
export default withClass(Person,styles.Person);
