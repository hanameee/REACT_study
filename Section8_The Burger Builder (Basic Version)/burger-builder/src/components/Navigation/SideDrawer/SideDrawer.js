import React, { Fragment } from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import styles from "./SideDrawer.module.css";
import BackDrop from "../../UI/Backdrop/Backdrop";
const sideDrawer = props => {
    let attachClasses = [styles.SideDrawer, styles.Closed];
    if(props.isOpened) {
        attachClasses = [styles.SideDrawer, styles.Open];
    }
    console.log(attachClasses);
    return (
        <Fragment>
            <BackDrop show={props.isOpened} clicked={props.closed}/>
            <div className={attachClasses.join(' ')}>
                <div className={styles.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Fragment>
    );
};

export default sideDrawer;
