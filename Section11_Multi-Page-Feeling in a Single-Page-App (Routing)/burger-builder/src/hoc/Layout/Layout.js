import React, { Fragment, Component } from "react";
import styles from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    };
    
    sideDrawerToggleHandler = () => {
        this.setState(prevState => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    };

    render() {
        return (
            <Fragment>
                <Toolbar DrawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    closed={this.sideDrawerClosedHandler}
                    isOpened={this.state.showSideDrawer}
                />
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
