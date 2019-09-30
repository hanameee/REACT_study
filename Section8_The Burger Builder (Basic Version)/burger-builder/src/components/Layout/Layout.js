import React, { Fragment, Component } from "react";
import styles from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    render() {
        return (
            <Fragment>
                <Toolbar />
                <SideDrawer closed = {this.sideDrawerClosedHandler} isOpened = {this.state.showSideDrawer}/>
                <main className={styles.Content}>{this.props.children}</main>
            </Fragment>
        );
    }
}
// const layout = ( props ) => (
//     <Fragment>
//         <Toolbar />
//         <SideDrawer />
//         <main className = {styles.Content}>
//             {props.children}
//         </main>
//     </Fragment>
// )

export default Layout;
