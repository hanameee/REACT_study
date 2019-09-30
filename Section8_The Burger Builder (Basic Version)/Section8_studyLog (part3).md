#Section8_ A Real App: The Burger Builder (Basic Version )

### 176) Reusing the Backdrop

SideBar에 backdrop과 toggle button을 추가해 봅시다.

BackDrop은 이미 별개의 UI component로 분리되어 있으니, sidebar에서 가져만 오면 된다.

```jsx
import styles from "./SideDrawer.module.css";
import BackDrop from "../../UI/Backdrop/Backdrop";
const sideDrawer = props => {
    return (
        <Fragment>
            <BackDrop show/>
            <div className={styles.SideDrawer}>
```



Backdrop을 누르면 SideDrawer이 사라지고 Backdrop이 사라지게, 또 toggle 버튼도 만들어야 함!
이를 위해 Layout을 stateful한 친구로 변경하자!

```jsx
import React, { Fragment, Component } from "react";
import styles from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends Component {

    state = {
        showSideDrawer: true
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

//naming convention 지켜야 하니 대문자로!
export default Layout;
```



### 178. Adding a SideDrawer toggle button



 