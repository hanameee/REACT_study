import React from "react";
import styles from "./Toolbar.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../../Navigation/NavigationItems/NavigationItems";
import Button from "../../UI/Button/Button";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle"

const toolbar = props => {
    return(
        <header className={styles.Toolbar}>
            <div className = {styles.MobileOnly}>
            <DrawerToggle clicked = {props.DrawerToggleClicked}/>
            </div>
            {/* <div className = {styles.DesktopOnly}>MENU</div>
            <div className={styles.MobileOnly}><Button clicked={props.openSideDrawer}>MENU</Button></div> */}
            <div className={styles.Logo}>
                <Logo />
            </div>
            <nav className={styles.DesktopOnly}>
                <NavigationItems />
            </nav>
        </header>
    );
}
export default toolbar;
