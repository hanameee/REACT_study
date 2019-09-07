import React, { Fragment, PureComponent } from "react";
import Person from "./Person/Person";
import AuthContext from "../../context/auth-context"
class Persons extends PureComponent {
    // static getDerivedStateFromProps(props,state){
    //     console.log("[Person.js] getDerivedStateFromProps");
    //     return state;
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (
    //         nextProps.persons !== this.props.persons ||
    //         nextProps.changed !== this.props.changed ||
    //         nextProps.clicked !== this.props.clicked
    //     ) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log("[Persons.js] getSnapshotBeforeUpdate");
        return { message: "snapshot!" };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("[Persons.js] componentDidUpdate");
        console.log(snapshot);
    }

    componentWillUnmount() {
        console.log("[Persons.js] componentWillUnmount");
    }

    render() {
        console.log("[Persons.js]] rendering");
        return this.props.persons.map((person, index) => {
            return (
                <Fragment>
                    <Person
                        click={() => this.props.clicked(index)}
                        name={person.name}
                        age={person.age}
                        changed={event => this.props.changed(event, person.id)}
                        key={person.id}
                        isAuth={this.props.isAuth}
                    />
                </Fragment>
            );
        });
    }
}
// const persons = (props) => {
//     console.log("[Persons.js]] rendering");
//     return props.persons.map((person,index) => {
//         return(
//             <Person
//                 click = {() => props.clicked(index)}
//                 name = {person.name}
//                 age = {person.age}
//                 changed = {event => props.changed(event, person.id)}
//                 key = {person.id}
//             />
//         );
//     });
// };

// export default persons;
export default Persons;
