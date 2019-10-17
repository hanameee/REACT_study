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
        // if (this.props.id && (!this.state.loadedPost || this.props.id !== this.state.loadedPost.id))
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

    render() {
        let post = <p style={{ textAlign: "center" }}>Please select a Post!</p>;
        if (this.props.match.params.id) {
            post = <p style={{ textAlign: "center"}}>LOADING...</p>;
        }
        if (this.state.loadedPost) {
            post = (
                <div className="FullPost">
                    <h1>{this.state.loadedPost.title}</h1>
                    <p>{this.state.loadedPost.body}</p>
                    <div className="Edit">
                        <button className="Delete" onClick = {() => this.deletePostHandler()}>Delete</button>
                    </div>
                </div>
            );
        }
        return post;
    }
}

export default FullPost;
