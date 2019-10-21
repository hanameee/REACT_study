import React, { Component } from "react";
import Posts from './Posts/Posts';
import { Route, NavLink, Switch, Redirect} from 'react-router-dom';
import "./Blog.css";
import NewPost from './NewPost/NewPost';
import FullPost from './FullPost/FullPost'

class Blog extends Component {
    state = {
        auth : false
    }

    render() {

        return (
            <div className = 'Blog'>
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to = '/posts' exact activeClassName = 'active' activeStyle = {{color : '#fa923f', textDecoration: 'underline'}}>Posts</NavLink></li>
                            <li><NavLink to = {{
                                pathname: '/new-post',
                                hash: '#submit',
                                search: '?/quick-submit=true'
                            }}>New Post</NavLink></li>
                        </ul>
                    </nav>
                </header>
                <Switch>
                    {this.state.auth ? <Route path = '/new-post' component = {NewPost}/> : null}
                    <Route path = '/posts' component = {Posts} />
                    <Route render = {() => <h1 style = {{textAlign : "center"}}>NOT FOUND</h1>}/>
                    {/* <Redirect from = '/' to = '/posts'/> */}
                    {/* <Route path = '/posts/:post_id' component = {FullPost}/> */}
                </Switch>
                 {/* <section>
                    <FullPost id = {this.state.selectedPostId}/>
                </section>
                <section>
                    <NewPost />
                </section> */}
            </div>
        );
    }
}

export default Blog;
