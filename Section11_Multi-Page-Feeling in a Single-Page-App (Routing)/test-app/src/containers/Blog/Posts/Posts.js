import React, { Component } from 'react';
// our own axios
import axios from '../../../axios';
import Post from '../../../components/Post/Post';
import { Link, Route } from 'react-router-dom';
import FullPost from '../FullPost/FullPost';

import './Posts.css';

class Posts extends Component {
    state = {
        posts: [],
    };
    componentDidMount() {
        console.log(this.props);
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
                // this.setState({
                //     errorState: true
                // })
            });
    };
    postSelectedHandler = (id) => {
        this.props.history.push({pathname: '/posts/' + id});
        // this.props.history.push('/posts/'+id);
    };
    
    render() {
        let posts = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
        if(!this.state.errorState){
            posts = this.state.posts.map(post => {
                return (
                    //<Link to = {'/posts/' + post.id} key = {post.id}>
                        <Post title={post.title}
                            author={post.author} 
                            key={post.id} 
                            clicked = {() => this.postSelectedHandler(post.id)}/>
                    //{</Link>}
                );
            });
        }
        return (
            <div>
                <section className="Posts">
                    {posts}
                </section>
                <Route path = {this.props.match.url + '/:post_id'} component = {FullPost}/>
            </div>
        )
    }
}


export default Posts;