import React, { useEffect, useRef } from "react";
import styles from "./Cockpit.module.css"
import AuthContext from "../../context/auth-context";

const Cockpit = (props) => {

    const toggleBtnRef = useRef();
    useEffect(() => {
        console.log("[Cockpit.js] useEffect");
        toggleBtnRef.current.click();
        return() => {
            console.log("[Cockpit.js] clean up work in useEffect");
        }
    }, [] );

    useEffect(() => {
        console.log("[Cockpit.js] 2nd useEffect");
        return() => {
            console.log("[Cockpit.js] clean up work in 2nd useEffect");
        }
    },);

    const classes = [];

    let btnClass = "";

    if (props.showPersons) {
        btnClass = styles.Red;
    }

    if (props.personsLength <= 2) {
        classes.push(styles.red);
    }

    if (props.personsLength <= 1) {
        classes.push(styles.bold);
    }

    return (
        <div className = {styles.Cockpit}>
            <h1>{props.title}</h1>
            <p className={classes.join(" ")}>
                I change my class depending on persons array length!
            </p>
            <button ref={toggleBtnRef} onClick={props.clicked} className={btnClass}>
                Toggle Namecard
            </button>
            <AuthContext.Consumer>
                {(context) => <button onClick={context.login}>Log in</button>}
            </AuthContext.Consumer>
        </div>
    );
};

export default React.memo(Cockpit);
