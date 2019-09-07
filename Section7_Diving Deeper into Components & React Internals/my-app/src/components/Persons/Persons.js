import React, { Fragment, PureComponent } from "react";
import Person from "./Person/Person";
class Persons extends PureComponent {

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
                // <Fragment>
                    <Person
                        click={() => this.props.clicked(index)}
                        name={person.name}
                        age={person.age}
                        changed={event => this.props.changed(event, person.id)}
                        key={person.id}
                    />
                // </Fragment>
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
