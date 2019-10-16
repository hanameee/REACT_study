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

