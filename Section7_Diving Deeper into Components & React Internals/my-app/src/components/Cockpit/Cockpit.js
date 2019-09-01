import React from "react";
import styles from "./Cockpit.module.css"

const cockpit = (props) => {
    const classes = [];
    let btnClass = "";

    if (props.showPersons) {
        btnClass = styles.Red;
    }

    if (props.persons.length <= 2) {
        classes.push(styles.red);
    }

    if (props.persons.length <= 1) {
        classes.push(styles.bold);
    }
    return (
        <div className = {styles.Cockpit}>
            <p className={classes.join(" ")}>
                I change my class depending on persons array length!
            </p>
            <button onClick={props.clicked} className={btnClass}>
                Toggle Namecard
            </button>
        </div>
    );
};

export default cockpit;
