import React, { Component, Fragment } from "react";
import styles from "./Person.module.css";
import Aux from "../../../hoc/Aux";
import withClass from "../../../hoc/WithClass";
//우리는 component를 extends 한 class를 만드는게 아니라 그냥 function을 만들거라서 App.js 에서처럼 component를 Import 해올 필요가 없음

//props는 제한되지 않은 숫자의 arguments 를 받을 수 있다.

class Person extends Component {
    render() {
        console.log("[Person.js]] rendering");
        // return (
        //     <div className = {styles.Person}>
        //         <p onClick={this.props.click}>
        //             I'm {this.props.name} and I am {this.props.age} years old!
        //         </p>
        //         <p>{this.props.children}</p>
        //         <input type="text" onChange={this.props.changed} value={this.props.name} />
        //         {/* <input type="text" onChange={props.changed}/> */}
        //     </div>
        // );
        return (

        );
    }
}
// const person = props => {
//     console.log("[Person.js]] rendering");
//     return (
//         <div className = {styles.Person}>
//             <p onClick={props.click}>
//                 I'm {props.name} and I am {props.age} years old!
//             </p>
//             <p>{props.children}</p>
//             <input type="text" onChange={props.changed} value={props.name} />
//             {/* <input type="text" onChange={props.changed}/> */}
//         </div>
//     );
// };

// export default person;
export default withClass(Person,styles.Person);
