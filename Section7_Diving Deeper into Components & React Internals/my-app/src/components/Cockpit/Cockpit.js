import React from "react";
import "./Cockpit.css"

const cockpit = (props) => {
    const classes = [];
    let btnClass = "";

    if (props.showPersons) {
        btnClass = "red";
    }

    if (props.persons.length <= 2) {
        classes.push("red");
    }

    if (props.persons.length <= 1) {
        classes.push("bold");
    }
    return (
        <div className = "Cockpit">
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
