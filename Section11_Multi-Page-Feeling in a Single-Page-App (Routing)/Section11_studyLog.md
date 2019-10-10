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
          hash: '#submit',
          search: '?/quick-submit=true'
        }}>Home</Link></li>
  </ul>
</nav>
```

`Link` object는 `to` 라는 property를 가진다.

to는 간단하게는 1. string을 받거나 2. Javascript object를 받는다.

이렇게 고치고 나면 링크를 클릭해도 아까처럼 페이지 전체가 re-load 되지 않는다! 👍 이렇게 Link component를 활용해서 App 내에서 navigate가 가능하다.

