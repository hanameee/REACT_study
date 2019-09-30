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

`내가 한 방식`

`Toolbar.js`

```jsx
import React from "react";
import styles from "./Toolbar.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../../Navigation/NavigationItems/NavigationItems";
import Button from "../../UI/Button/Button";

const toolbar = props => {
    return(
        <header className={styles.Toolbar}>
            <div className = {styles.DesktopOnly}>MENU</div>
            <div className={styles.MobileOnly}>
              <Button clicked={props.openSideDrawer}>MENU</Button>
        		</div>
        ...
        </header>
    );
}
export default toolbar;
```

이전에 mobile page에서 media query 를 사용한 DesktopOnly 클래스로 conditional하게 nav를 보여줬던 것에 착안해 MobileOnly를 만들고, MobileOnly에만 클릭되었을 때 openSideDrawer props를 넘겨줌

`Layout.js`

```jsx
import React, { Fragment, Component } from "react";
import styles from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
    state = {
        showSideDrawer: false
    };

    sideDrawerOpenHandler = () => {
        this.setState({ showSideDrawer: true });
    };

    sideDrawerClosedHandler = () => {
        console.log("clicked!")
        this.setState(prevState => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    };

    render() {
        return (
            <Fragment>
                <Toolbar DrawerToggleClicked={this.sideDrawerClosedHandler} />
                <SideDrawer
                    closed={this.sideDrawerClosedHandler}
                    isOpened={this.state.showSideDrawer}
                />
                <main className={styles.Content}>{this.props.children}</main>
            </Fragment>
        );
    }
}
```



`선생님이 하신 방식`



###180. Improving the App

이제 얼추 앱의 기능을 만들었으니, 몇가지 들을 improve 해볼 것임
7강에서 배웠던 Prop types, Pure components, LifeCycle methods... ect



### 181. Prop type validation

지금은 BurgerIngredient 에서 prop type validation을 하고 있다. 자유롭게 추가해봐라 😯?! 띠용?!

Proptype 복습!

Functional & Class based component 모두에서 사용할 수 있고, component declaration 다음에 사용하면 된다.

ex)

1. 설치 `npm install --save prop-types`

```jsx
// 2. import 해오기 -  대문자 권장
import PropTypes from "prop-types"

class Person extends Component {
    render() {
        console.log("[Person.js]] rendering");
        return (
          ...
    }
}
//위처럼 class definition 후나 function setup 뒤 변수에 할당한 후에 component에 접근 할 수 있다.

//3. component 선언문 이후에 사용하기
//이 propTypes는 반드시 소문자 p로 시작되어야 함 (special property = it will be a JS object from now on. React는 development mode에서 내가 incorrect props를 넘기면 warning을 줄 것임)
Person.propTypes = {
    click : PropTypes.func,
    name : PropTypes.string,
    age : PropTypes.number,
  	changed : PropTypes.func 
}
//위처럼 key-value pair로 [prop name - PropTypes.자료형] 을 정의
```



### 182. Improving Performance

`PureComponents` 랑 `ShouldComponentUpdate` 를 쓰고 있나? 써야 하는데 안쓰고 있진 않나?
우리 App을 Anaylize 해보자. re-rendering이 필요 없는데도 렌더링을 발생시키는 state나 prop change들이 있나? 

Modal과 그 안에 포함된 OrderSummary의 경우, BurgerBuilder이 변경될때마다 재로딩될 필요가 없다. Order 버튼을 눌렀을 때만 돌아가면 되는 코드잖아!

1) class baed component 로 변경해서 shouldComponentUpdate 사용
2) functional component 로 변경해서 React.memo 사용

지금 코드는 강의에서 한 2번 방법

`OrderSummary.js` 랑 `Modal.js` 를 class based component로 변경해서

`OrderSummary.js` 

```jsx
class OrderSummary extends Component {
    componentDidUpdate(){
        console.log('[OrderSummary]Updated!')
    } 
  ...
```

 `Modal.js` 

```jsx
import React, { Component, Fragment } from "react";
import styles from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {

    componentDidUpdate(){
        console.log('[Modal]Updated!')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.show !== this.props.show) {
            return true;
        } else {
            return false;
        }
    }
```

**🔑 KEY TAKEAWAYS 🔑**

wrapping element 는wrapped element의 updating 을 control 한다!
(우리 예제의 경우, modal이 orderSummary의 update를 control한다.)

🤨 **QUESTION**🤨

OrderSummary 랑 Modal을  classed based component로 바꾸지 않고, 그냥 React.memo를 사용해서 optimize하면 console.log로 하듯이 그렇게 단계별 렌더링 여부를 확인할 수 없나?