## Section11_ Multi-Page-Feeling in a Single-Page-App: Routing



### 215. Module Introduction

Routing 에 대해 알아볼 것



### 216. Routing and SPAs

SPA & Multi page

- 목적 : To give user a normal web using experience

- How : Show the user different pages for different URLs

React에서는 여러개의 html 파일을 가지고 있는 것이 아니라, 각자 다른 path에서 각자 다른 pages 를 render 해주기 위해 Javascript를 사용한다.

이걸 위해서 우리는 3자 Router package를 사용할 것임

1. Parse URL/Path
2. Read Config
3. Render(Load) appropreate JSX/component



### 217. Setting up links

`Blog.js` 에 Nav로 link를 추가해주자

```js
return (
  <div className = 'Blog'>
    <header>
      <nav>
        <ul>
          <li><a href = '/'>Home</a></li>
          <li><a href = '/new-post'>New Post</a></li>
        </ul>
      </nav>
    </header>
```

이렇게 추가를 해줘도 URL만 바뀔 뿐 항상 같은 페이지를 return 한다. 그 이유는?

서버에서 항상 index.html 파일만 리턴하고 다른 루트가 없기 때문에. (there is only one single file 
it has return all the time)



### 218. Setting up the router package

위에서 링크를 setup 했으니 이제 router 패키지를 깔아보자.

```bash
npm install --save react-router react-router-dom 
```

+) 사실 기술적으로는 react-router-dom 만 쓰고, react-router은 그냥 dependency라서 omit 해도 된다!

지금은 Blog.js 에서 1) Posts 2)Fullpost 3)Newpost 를 다 보여주고 있는데, 지금 root 루트에서 Posts만 보이도록 수정하고 싶다면?

root URL (/) 일 때 posts만 보이도록 수정해줘야한다.

이런 routing이 가능하도록 하기 위해서는 react-router-dom에서 BrowserRouter을 import해오고 routing을 하고 싶은 앱을 wrap 해주면 된다.

```jsx
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Blog from './containers/Blog/Blog';

class App extends Component {
  render() {
    return (
      // 이제 Blog에서 routing을 사용할 수 있다!
      <BrowserRouter>
        <div className="App">
          <Blog />
        </div>
      </BrowserRouter>
    );
  }
}
```

기존에 Blog만 container이고 나머지는 다 component 였는데, 이제 각각의 component들이 (Fullpost, Newport) 다 subcomponents들에게 state를 분배하는 distinct pages가 될 것이기에 얘들을 다 container로 바꿔주자.



### 220. Preparing the Project For Routing

Blog.js 에 있던 Posts 관련 코드들을 다 새롭게 만든 Posts container에 옮겨준다!

`Posts.js`

```jsx
import React, { Component } from 'react';
// our own axios
import axios from '../../../axios';
import Post from '../../../components/Post/Post';
import './Posts.css';

class Posts extends Component {
    state = {
        posts: [],
    };
    componentDidMount() {
        axios
            .get('/posts')
            .then(response => {
                const posts = response.data.slice(0, 4);
                const updatedPosts = posts.map(post => {
                    return {
                        ...post,
                        author: "Hannah"
                    };
                });
                this.setState({ posts: updatedPosts });
            })
            .catch(error => {
                console.log(error)
            });
    };
    postSelectedHandler = (id) => {
        this.setState({
            selectedPostId : id
        })
    };
    render() {
        let posts = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
        if(!this.state.errorState){
            posts = this.state.posts.map(post => {
                return (
                    <Post title={post.title}
                        author={post.author} 
                        key={post.id} 
                        clicked = {() => this.postSelectedHandler(post.id)}/>
                );
            });
        }
        return (
            <section className="Posts">
                {posts}
            </section>
        )
    }
}


export default Posts;
```

이제 ./로 가면 Posts들이 보임! 다음 강의에서 라우팅을 추가해볼 것



### 221. Setting Up and Rendering Routes

Routing을 위해선 react-route-dom 에서 Route object를 import 해와야 한다.
⚠️주의 : 이게 가능한건 상위 컴포넌트인 App.js에서 (혹은 Index.js) Blog를 <BrowserRouter>로 감싸줬기 때문!

`Blog.js`

```jsx
import { Route } from 'react-router-dom';
```

이 Route Object는 아래와 같은 config가 필요하고, 특정 route를 만족했을 때 특정 component로 변환된다고 이해하면 편하다

- path 

  ` path = '/'` 와 같이 쓰이며, URL이 '/' 로 시작할 때 (접두어마냥) render가 hold하고 있는 jsx를 리턴한다.

-  render

  `render = {() => <Component>}` 와 같이 쓰이며, 특정 URL에서 return 하고 싶은 jsx를 리턴하는 익명함수를 hold한다.

- exact

  boolean 값을 가지며 (exact 라고만 써도 ok) path와 같이 쓰였을 때 특정 URL로 시작하는 것이 아니라, 전체 URL이 path와 정확하게 일치할 때 render가 hold하고 있는 jsx를 리턴한다.

전체 사용 예시를 보면

```jsx
<Route path = '/' exact render = {() => <h1>home</h1>}
```

full path가 '/' 일때 home h1 tag를 리턴!



###222. Rendering Components for Routes

이제 '/' 일때 Posts component를 리턴하도록 해보자.
이번에는 jsx를 리턴하고 싶은게 아니라, component를 리턴하고 싶은 거니까 component 라는 config를 쓸 것임.

- component

  `component = {Posts}` 처럼 쓰이며, 특정 URL 에서 리턴하고 싶은 function or class 에 대한 reference를 hold한다.

```jsx
<Route path = '/' exact component = {Posts}/>
```

이렇게!

근데 render을 써서 아래처럼 작성해도 무방한 듯

```jsx
<Route path = '/' exact render = {() => <Posts/>}/>
```

component 를 가장 많이 쓰긴 하겠지만, render config 역시 짧은 info message를 렌더할때는 많이 쓰일 수 있다.



### 223.  Switching Between Pages

NewPost 를 클릭했을 때 NewPost 가 뜨도록 수정해보자!

```jsx
<Route path = '/new-post' component = {NewPost}/>
```

이렇게 수정해준다. 그런데 지금은 링크를 클릭할 때마다 전체 페이지가 통째로 re-load 된다! 그럼 state도 잃게 된다. 

이건 우리가 리액트에서 원하는 게 아니지. 바뀌는 부분만 re-render 하고 싶잖아!

이걸 다음 강의에서 해보자.



### 224. Using Links to Switch Pages

지금은 링크를 위해 Anchor HTML 태그를 사용하는데, react route에서는 이거 대신 Link 컴포넌트를 제공한다 :)

```jsx
import { Route, Link } from 'react-router-dom';

<nav>
  <ul>
    {/* 1. to 가 string을 받는 경우 */}
    <li><Link to = "/">Home</Link></li>
    {/* 2. to 가 object를 받는 경우 - 좀 더 복잡한 config가 가능*/}
    <li><Link to = {{
          pathname: '/new-post',
          // hash 이용하면 특정 page의 part로 이동하거나, scroll하는게 가능
          hash: '#submit',
          // query params를 파싱할때 사용 가능
          search: '?/quick-submit=true'
        }}>Home</Link></li>
  </ul>
</nav>
```

`Link` object는 `to` 라는 property를 가진다.

to는 간단하게는 1. string을 받거나 2. Javascript object를 받는다.

이렇게 고치고 나면 링크를 클릭해도 아까처럼 페이지 전체가 re-load 되지 않는다! 👍 이렇게 Link component를 활용해서 App 내에서 navigate가 가능하다.



### 225. Using Routing-Related Props

Router은 props로 loaded route 에 대한 extra information을 넘겨준다. 이걸 확인해보기 위해 Posts의 componentDidMount 안에다가 console을 찍어보자!

`Posts.js`

```jsx
class Posts extends Component {
    state = {
        posts: [],
    };

		// 이렇게 찍어줘보자!
    componentDidMount() {
        console.log(this.props);
```

그리고 나서  콘솔창을 보면

![image-20191010220115701](../images/image-20191010220115701.png)

이렇게 여러 값들이 props들로 전달된 것을 볼 수 있다.

이 Props들을 가지고 query params 를 추출하거나, hash fragment로 이동하거나 기타등등에 사용할 수 있다.



### 226. The "withRouter" HOC & Route Props

Routing related props는 component tree를 타고 전달 되지 않는다.
즉, 직접적으로 Route를 써서 render 된 Posts나 NewPosts의 경우 위에서 본 것 처럼 history, location, match 등의 다양한 prop들과 method들이 전달되지만, Posts 에 포함된 `Post`에 console.log(props) 를 찍어보면 해당 prop들이 전달되지 않는걸 볼 수 있다!

얘들한테까지 prop을 전달해주려면 2가지 방법이 있다.

1. 상위 컴포넌트에서 ...props로 전달해주기

   `Posts.js`

   ```jsx
   return <Post
            match = {...this.props.match}
   ```

2. withRouter HOC 사용하기

   `Post.js`

   ```jsx
   import {withRouter} from 'react-router-dom';
   ...
   export default withRouter(post);
   ```

   이렇게 withRouter로 wrap해주게 되면 nearest loaded route의 prop information을 받게 된다.

![image-20191011132803623](../images/image-20191011132803623.png)

위의 사진처럼 각각의 post 컴포넌트들도 posts와 마찬가지로 route prop을 받는 것을 알 수 있다.



### 227. Absolute vs Relative Paths

React-route-dom 의 `Link` component를 통해 설정한 path는 항상 **absolute path** 로 간주된다.
즉, 내가 지금 어떤 URL에 있던지와 상관 없이 base URL 의 끝에 append 된다는 것!

ex) Base URL : example.com이고 내가 현재 있는 URL이 example.com/posts 라면?

```jsx
<Link to = '/new-post'>New post</Link>
```

위의 링크를 클릭하면 `example.com/posts/new-post` 로 가는게  아니라, `example.com/new-post` 로 간다는 것! 무조건 Base URL에 append 된다.

만약 위의 방식처럼 absolute path가 아니라, 내 현재 path에 append 되게 하고 싶다면?
--> 그때는 **route relative props** 를 통해 dynamic 하게 path를 설정해야 한다.

```jsx
<Link to = {{
    pathname : this.props.match.url + '/new-post'
  }}>New post</Link>
```

`this.props.match.url` 은 현재 내가 있는 path에 대한 정보를 가지고 있다. 따라서 저렇게 써주면 relative path로 사용할 수 있다 :)

root domain 뒤에 append되는 것이 아니라 (absolute path) current path 뒤에 append 되게 하고 싶다면 위처럼 this.props.match.url 을 사용해야 한다!

Object를 사용하지 않는다면 간단하게는 아래처럼 사용도 가능하다.

```jsx
<Link to={props.match.url + '/new'}>
```



### 229. Styling the Active Route

지금 Active한 Link에게 추가적인 스타일링을 주고 싶다면? 

기존에 사용했던 `Link` 대신, 추가적인 prop을 주는 `NavLink` 를 사용하자!

`Blog.js`

```jsx
// Link 대신 NavLink를 추가해주고
import { Route, NavLink } from 'react-router-dom';
...
  <nav>
  <ul>
    {/* 여기도 바꿔주자! */}
    <li><NavLink to = '/'>Home</NavLink></li>
    <li><NavLink to = {{
          pathname: '/new-post',
            hash: '#submit',
              search: '?/quick-submit=true'
        }}>New Post</NavLink></li>
  </ul>
</nav>
```

이렇게 Link를 NavLink로 수정해주면, 아래처럼 추가적인 prop들이 생긴 것을 볼 수 있고 특히 `class="active"` 가 생겼다!

![image-20191011141441907](../images/image-20191011141441907.png)

이걸 바탕으로 active한 녀석한테 styling을 줄 수 있겠지.

`Blog.css`

```css
.Blog a:hover,
.Blog a:active,
.Blog a.active {
    color: #fa923f;
}
```

⚠️ **조심!** 단, 위처럼 하면 home과 new post 모두에 styling이 입혀지는데, 이건 앞서 말했듯 Link to 에 `exact` 값을 true로 주지 않으면 해당 path가 prefix인 모든 link에 대해 속성이 해당되기 때문!

따라서 정확한 path가 root일때만 styling을 주고 싶다면 아래처럼 exact를 꼭 써줘야 한다.

```jsx
<li><NavLink to = '/' exact>Home</NavLink></li>
```

- activeClassName

추가적으로, 만약 class 이름을 default인 active가 아니라 내 맘대로 커스텀해서 주고 싶다면?

```jsx
<ul>
  {/* 여기도 바꿔주자! */}
  <li><NavLink to = '/' exact activeClassName = 'my-active'>Home</NavLink></li>
```

이렇게 activeClassName 을 활용하면 됨.

- activeStyle

activeStyle 을 활용한 lnline styling 도 가능함!

```jsx
<li><NavLink to = '/' 
      			 exact 
      			 activeClassName = 'active'
      			 activeStyle = {{
      					color : '#fa923f', 
                textDecoration: 'underline'}}>Home</NavLink></li>

```



### 230. Passing Route Parameters

이제 개별 post를 클릭하면 해당 Post의 상세페이지(= FullPost) 가 뜨도록 수정해보자!

`Posts.js`

```jsx
return (
  <Post title={post.title}
    author={post.author} 
    key={post.id} 
    clicked = {() => this.postSelectedHandler(post.id)}/>
);
```

Post는 각각 id를 가지고 있다. 이 id를 파라미터로 받아서 URL로 넘겨줘서 알맞은 post를 렌더링하면 되지 않을까!

Route에게 dynamic parameter을 넘겨주기 위해선 `:어쩌고` 를 사용하면 된다. 이게 바로 Route Parameter!

```jsx
<Route path = '/:post_id' component = {Posts} />
```

`Post.js`

개별 Post를 클릭했을 때 해당 id로 URL을 넘겨주기 위해서는 Post component를 Link 태그로 감싸주면 된다!

```jsx
if(!this.state.errorState){
  posts = this.state.posts.map(post => {
    return (
      <Link to = {'/' + post.id} key = {post.id}>
        <Post title={post.title}
          author={post.author} 
          key={post.id} 
          clicked = {() => this.postSelectedHandler(post.id)}/>
      </Link>
```



### 231. Extracting Route Parameters

아까 route path를 활용해 dynamic하게 post_id를 넘겼다. 이걸 확인하기 위해 개발자도구를 보면

![image-20191011170530519](../images/image-20191011170530519.png)

이렇게 match의 params로 post_id가 넘어오고 있는 것을 볼 수 있다!
그럼 `this.props.match.params.post_id` 로 id 값에 접근할 수 있겠지 :)

`FullPost.js`

componentDidMount를 아래처럼 수정해줍시다.

```react
componentDidMount() {
  if(this.props.match.params.post_id && (!this.state.loadedPost || this.props.match.params.post_id !== this.state.loadedPost.id)) {
    axios
      .get(
      "/posts/" +
      this.props.match.params.post_id
    )
      .then(response => {
      const post = response.data;
      console.log("[Fullpost] New post Loaded!")
      this.setState({
        loadedPost: post
      });
    });
  }
}
```

이제 Post를 클릭하면 정상적으로 FullPost가 뜬다! 근데 NewPost를 클릭해도 밑에 FullPost가 뜨고 난리다! 이건 왜이럴까? :)



### 232. Parsing Query Parameters & the Fragment

You learned how to extract route parameters (=> `:id`  etc). 

But how do you extract **search** (also referred to as "**query**") **parameters** (=> `?something=somevalue`  at the end of the URL)? How do you extract the **fragment** (=> `#something`  at the end of the URL)?

#### **Query Params:**

You can pass them easily like this:

```
<Link to="/my-path?start=5">Go to Start</Link>
```

or

```jsx
<Link 
    to={{
        pathname: '/my-path',
        search: '?start=5'
    }}
    >Go to Start</Link>
```

React router makes it easy to get access to the search string: `props.location.search` .

But that will only give you something like `?start=5` 

You probably want to get the key-value pair, without the `?`  and the `=` . Here's a snippet which allows you to easily extract that information:

```jsx
componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
        console.log(param); // yields ['start', '5']
    }
}
```

`URLSearchParams`  is a built-in object, shipping with vanilla JavaScript. It returns an object, which exposes the `entries()`  method. `entries()`  returns an Iterator - basically a construct which can be used in a `for...of...`  loop (as shown above).

When looping through `query.entries()` , you get **arrays** where the first element is the **key name** (e.g. `start` ) and the second element is the assigned **value** (e.g. `5` ).

#### **Fragment:**

You can pass it easily like this:

```
<Link to="/my-path#start-position">Go to Start</Link>
```

or

```
<Link 
    to={{
        pathname: '/my-path',
        hash: 'start-position'
    }}
    >Go to Start</Link>
```

React router makes it easy to extract the fragment. You can simply access `props.location.hash` .



### 233. Using Switch to Load a Single Route

231에서 발생한 issue를 수정해보자!

