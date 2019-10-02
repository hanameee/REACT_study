import React, { Component } from "react";
import axios from "axios";
import "./FullPost.css";

class FullPost extends Component {

    state = {
        loadedPost: null
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(!this.props.id && nextProps.id !== this.props.id ){
    //         console.log("[FullPost] Component should Update")
    //         return true;
    //     } else {
    //         console.log("[FullPost] Component should NOT Update")
    //         return false;
    //     }
    // }

    componentDidMount() {
        console.log('[FullPost] componentDidMount!!')
    }

    componentDidUpdate() {
        console.log('[FullPost] componentDidUpdate!!')
        // if (this.props.id && (!this.state.loadedPost || this.props.id !== this.state.loadedPost.id))
        if(this.props.id && (!this.state.loadedPost || this.props.id !== this.state.loadedPost.id)) {
            axios
                .get(
                    "https://jsonplaceholder.typicode.com/posts/" +
                        this.props.id
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
    render() {
        let post = <p style={{ textAlign: "center" }}>Please select a Post!</p>;
        if (this.props.id) {
            post = <p style={{ textAlign: "center"}}>LOADING...</p>;
        }
        if (this.state.loadedPost) {
            post = (
                <div className="FullPost">
                    <h1>{this.state.loadedPost.title}</h1>
                    <p>{this.state.loadedPost.body}</p>
                    <div className="Edit">
                        <button className="Delete">Delete</button>
                    </div>
                </div>
            );
        }
        return post;
    }
}

export default FullPost;
