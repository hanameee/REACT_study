import React, { Component } from "react";
import Posts from './Posts/Posts';
import { Route, NavLink } from 'react-router-dom';
import "./Blog.css";
import NewPost from './NewPost/NewPost';
import FullPost from './FullPost/FullPost'

class Blog extends Component {

    render() {

        return (
            <div className = 'Blog'>
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to = '/' exact activeClassName = 'active' activeStyle = {{color : '#fa923f', textDecoration: 'underline'}}>Home</NavLink></li>
                            <li><NavLink to = {{
                                pathname: '/new-post',
                                hash: '#submit',
                                search: '?/quick-submit=true'
                            }}>New Post</NavLink></li>
                        </ul>
                    </nav>
                </header>
                <Route path = '/' exact component = {Posts} />
                <Route path = '/new-post' component = {NewPost}/>
                <Route path = '/:post_id' component = {FullPost}/>
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
