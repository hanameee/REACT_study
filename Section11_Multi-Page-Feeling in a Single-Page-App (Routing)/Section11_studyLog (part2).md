## Section11_ Multi-Page-Feeling in a Single-Page-App: Routing



### 234. Navigating Programmatically

앞서서 Post를 클릭했을 때 해당 ID에 맞는 FullPost가 load되기 위한 방법으로, 

- Post 전체를 Link로 감싸고
- 그 Link에 맞는 Route를 Blog에 추가해주는

방법을 사용했지.

이번엔 Post에 있는 handler을 사용해서 Programmatically하게 Navigate 하는 방법을 알아보자.

아까 봤던 history prop에

![image-20191011183150530](../images/image-20191011183150530.png)

- goBack (뒤로가기 버튼과 같은 역할)
- goForward (앞으로가기 버튼과 같은 역할)
- Push 

등의 다양한 methods 들이 있었지! 우린 이 중 `Push` 를 활용해 볼 것임.

Push 는 **Stack of pages** (Navigation은 사실 그냥 stack of pages 임) 에 새로운 page를 push하는 메소드이다!

`Posts.js`

```jsx
postSelectedHandler = (id) => {
  // Push 다음에는 Link to 를 쓸 때처럼 동일하게 적어주면 된다! object 또는 string 무방!
  this.props.history.push({pathname: '/' + id});
  // this.props.history.push('/'+id);
};

render() {
  let posts = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
  if(!this.state.errorState){
    posts = this.state.posts.map(post => {
      return (
        //아까 사용했던 Link는 주석처리 해주시고~!
        //<Link to = {'/' + post.id} key = {post.id}>
        <Post title={post.title}
          author={post.author} 
          key={post.id} 
          clicked = {() => this.postSelectedHandler(post.id)}/>
        //{</Link>}
      );
    });
  }
```

이렇게 써주면 Link로 감쌌을 때와 동일하게 작동하는 것을 알 수 있다.

Link 가 아니라 handler을 이용해 이렇게 programatically 하게 navigate하는 방식은 어떤 operation이 끝나고 나서 navigate 해야 하는 경우에 사용하면 좋다!



### 236. Understanding Nested Routes

지금은 blog 컴포넌트 안에서 routing을 통해 컴포넌트들을 불러오고 있다. (**one-level routing**)
하지만, 그 component 안에서 또 certain component나 content를 라우팅을 통해 return하고 싶을 수도 있지!  (**Nested Routing**)

이제 각각의 개별 Post 들을 Blog 말고 Posts 에서 return 해보자.

`Posts.js`

```react
import Route from 'react-route-dom'
...

return (
  //div로 감싸고
  <div>
    <section className="Posts">
      {posts}
    </section>
    {/* posts 밑에 원래 Blog에 있던 post 라우팅 코드를 넣어준다! */}
    <Route path = '/:post_id' component = {FullPost}/>
  </div>
)
```

또한, 링크를 dynamic 하게 바꿔주기 위해 현재 있는 url 값을 가지고 있는 `this.props.match.url` 을 사용한다.

```react
<Route path = {this.props.match.url + '/:post_id'} component = {FullPost}/>
```



### 237. Creating Dynamic Nested Routes

지금 다른 post 클릭해도 URL만 바뀌고 component 로드가 안된다. 왜일까?

React router 의 작동 방식 때문인데, 이미 내가 있는 component 는 다시 load하지 않는다. 이미 만들어져있는데 왜 다시 reload를 하겠슈...? `FullPost` 의 componentDidMount 자체가 실행되지 않는거야!

component 자체는 바뀐게 없으니까 re-load가 안되고, 따라서 서버에 요청도 다시 안가고. 그런거지.

그래서 우리가 써야 하는건 `componentDidUpdate` hook이다! 이건 실행이 되니깐.
기존에 웹서버에 요청하는 axios 코드를 loadData라는 함수로 분리하고, 이걸 componentDidMount와 componentDidUpdate에서 둘다 실행한다.

```js
componentDidMount() {
  this.loadData();
}

componentDidUpdate() {
  console.log("FullPost: update!")
  this.loadData();
}

loadData() {
  if(this.props.match.params.id) {
    if(!this.state.loadedPost || (this.state.loadedPost && (this.props.match.params.id != this.state.loadedPost.id))) {
      console.log(this.props.match.params.id + "이고요");
      axios
        .get(
        "/posts/" +
        this.props.match.params.id
      )
        .then(response => {
        const post = response.data;
        console.log("[Fullpost] New post Loaded!")
        this.setState({
          loadedPost: post
        });
        console.log(this.state.loadedPost.id + "입니다")
      });
    }
  }
}

deletePostHandler = () => {
  axios
    .delete("/posts/" + this.props.match.params.id)
    .then(response => {
    console.log(response);
  })
}
```



**🤔QUESTION🤔**
아니 대체 왜 loadData 에서

```js
if(!this.state.loadedPost || (this.state.loadedPost && (this.props.match.params.id != this.state.loadedPost.id)))
```

`=!` 로 안하고 `==!` 로 하면 (강의에서는 ==! 씀) 무한 요청이 가는거지? 엉엉...울고 싶다...
는 강의를 조금 더 들으면 답이 나온답니다! 짜잔! 좋은 삽질이었다!

![이용대 짜잔](http://bizon.kookmin.ac.kr/files/editor/1442382140703.png)

`this.props.match.params.id` 얘의 자료형은 **STRING** 문자열이고, `this.state.loadedPost` 의 자료형은 **NUMBER** 이기 때문이다!

`!==` 은 값 뿐만 아니라 type equality까지 check하기에 당연히 false를 리턴하고 매번 loadData() 가 실행되어 무한 request가 갔던 것.

**🔑SOLUTION🔑**

string을 ID로 바꾸거나 (matching 식에 쓰일때 앞에 +를 붙여서), 연산자를  `!=` 로 바꿔서 값만 check 하거나!



### 238. Redirecting Requests

redirect 시키고 싶을 때가 있지. 만약 `/` URL로 접속했을 때 자동으로 `/posts` 로 redirect 시키고 싶다면?

물론 아래처럼 기존의 rule대로 Route를 추가해주는 방법도 있지만

```jsx
<Route path = '/' component = {Posts} />
```

react-router-dom이 제공하는 **Redirect** 컴포넌트를 사용하는 방법도 있다!

```jsx
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
...
  <Switch>
  <Route path = '/new-post' component = {NewPost}/>
  <Route path = '/posts' component = {Posts} />
  {/* /경로로 접속하면 /posts로 리다이렉트! */}
  <Redirect from = '/' to = '/posts'/>
</Switch>
```

단, 이렇게 from을 명시해주는 것은 Switch 문 안에서만 가능하고 Switch 문 밖에서는 conditional redirect 를 사용해야 한다. 이건 다음 강의에서!



### 239. Conditional Redirects

`NewPost.js` 에서 새로운 포스트 작성 버튼 누르고 나서 Redirect를 시켜보자!

⚠️ Redirect를 `<Switch>` 안에서 쓰는 것이 아니라면 `from` 속성을 쓸 수 없다! **to 만 쓸 수 있음**.

아래와 같은 Redirection code를 추가하되, 이것도 어디까지나 하나의 컴포넌트에 불과하므로 이걸 conditional 하게만 리턴하면 되지롱!

```jsx
<Redirect to = "/posts"/>
```

`NewPost.js`

```jsx
state = {
  title: '',
  content: '',
  author: 'Max',
  // state에 submitted 를 추가해주고
  submitted: false
}

...

    postDataHandler = () => {
        const post = {
            title : this.state.title,
            body : this.state.content,
            author : this.state.author
        }
        axios.post('/posts',post)
        .then(response => {
            console.log("포스팅 되었따");
          	// HTTP 요청을 보내고 나서 submitted state를 true로 바꿔준다!
            this.setState({
                submitted: true
            })
        });
    }

    render () {
      	// 처음에 redirect 변수를 null로 정의
        let redirect = null;
      	// submitted가 true라면
        if (this.state.submitted) {
          	// redirect는 해당 jsx (Redirect하는 코드)
            redirect =  <Redirect to = "/posts"/>;
        }
        return (
            <div className="NewPost">
            		{/* 얘는 null 아니면 redirection code겠지! */}
                {redirect}
```

page를 떠나기 위해 Redirect component를 render 하는 느낌!



### 240. Using the History Prop to Redirect (Replace)

직전 강의에서 NewPost 를 direct 하던 방식 (this.setState를 사용해 component를 redirect 하는 방법 보다, BrowserRouter이 제공하는 history prop을 사용하는 것이 조금 더 많이 쓰이는 방법!

`App.js`

```react
<BrowserRouter>
  <div className = "App">
  	<Blog />
  </div>
</BrowserRouter>
```

Blog 역시 BrowserRouter 안에 감싸져 있고, NewPost는 당연히 Blog를 통해 rendering 되니 `match` `location` `history` 와 같은 prop들을 사용할 수 있다.

특히, history prop은 여러 method들을 가지고 있는데 대표적으로는

- replacing the current route
- pushing a new route

들이 있다. 이걸 사용해보자!

`NewPost.js`

```react
    postDataHandler = () => {
        const post = {
            title : this.state.title,
            body : this.state.content,
            author : this.state.author
        }
        axios.post('/posts',post)
        .then(response => {
            console.log("포스팅 되었따");
          	// 이렇게 적어준당
            this.props.history.push('/posts')
        });
    }
```

push는 new page를 stack에 집어넣는다. 따라서 back 버튼을 누르면 직전 페이지인 new post로 되돌아간다.
하지만 redirect는 현재 page를 new post로 replace한다. 따라서 back 버튼을 누른다고 new post로 되돌아가지지 않는다!

```react
    postDataHandler = () => {
        const post = {
            title : this.state.title,
            body : this.state.content,
            author : this.state.author
        }
        axios.post('/posts',post)
        .then(response => {
            console.log("포스팅 되었따");
          	this.props.history.replace('/posts');
          	// replace를 사용하면 setState로 redirect를 렌더하던 이전 코드와 동일!
        });
    }
```



정리하자면, 어떤 연산이 끝난 후 page를 변경하고 싶다면 2가지 방법이 있다!

(1) Redirect component를 조건적으로 rendering하고 싶으면 239에서 배운 방법을
(2) 그게 아니라면 history prop의 replace나 push method를 쓸 수 있다!



### 241.  Working with Guards

Navigation Guards 에 대해 알아보자!

Application에서 특정 route의 경우, authenticated 된 user만 visit 할 수 있게 하고 싶을 수 있다. 이럴때 쓰이는게 navigation guard.

React router에서는 요 guard를 조금 다르게 생각해야 함니다. 2가지 방법이 있다.

1. Auth state에 따라 해당 route 페이지를 conditional 하게 render 하기
2. guarded 된 페이지의 componentDidMount에서 unauth라면 redirect 하기

[방법 1의 경우]

`Blog.js`

```jsx
class Blog extends Component {
    state = {
      	// auth state를 추가해주고!
        auth : false
    }

...

  <Switch>
  {/* auth state에 따라 conditional 하게 new-post를 렌더링! */}
  {this.state.auth ? <Route path = '/new-post' component = {NewPost}/> : null}
  <Route path = '/posts' component = {Posts} />
  {/* auth false인 상태라면 /new-post 를 눌러도 / prefix에 걸려서 redirect 될 것임*/}
  <Redirect from = '/' to = '/posts'/>
</Switch>
```

[방법 2의 경우]

`NewPost.js`

```jsx
componentDidMount() {
  // if unAuth => this.props.history.replace('/posts')
  console.log(this.props);
}
```

요런 로직을 넣어줄 수 있겠지 :)

**🔑KEY TAKEAWAY🔑**

방법 1에서, `Route path = '/new-post'`  라는 정의가 rendered 되지 않았으므로, 이 route definition에 연결된 component는 더더욱 rendered 될 수 없는 것. 

중요하다!

