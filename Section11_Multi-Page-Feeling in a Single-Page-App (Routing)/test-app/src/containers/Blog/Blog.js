import React, { Component } from "react";
// import axios from "axios";
import axios from '../../axios'

import "./Blog.css";

class Blog extends Component {
    state = {
        posts: [],
        selectedPostId: null,
        errorState: false
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
                this.setState({
                    errorState: true
                })
            });
    };

    postSelectedHandler = (id) => {
        this.setState({
            selectedPostId : id
        })
    };
   
    render() {
        let posts = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
        // if(!this.state.errorState){
        //     posts = this.state.posts.map(post => {
        //         return (
        //             <Post title={post.title}
        //                 author={post.author} 
        //                 key={post.id} 
        //                 clicked = {() => this.postSelectedHandler(post.id)}/>
        //         );
        //     });
        // }
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
                <section className="Posts">{posts}</section>
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
