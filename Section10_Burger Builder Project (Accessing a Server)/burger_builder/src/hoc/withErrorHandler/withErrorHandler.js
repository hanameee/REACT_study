import React, {Fragment, Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';


const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = ({
            error : null
        })
        constructor(){
            super();

            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({
                    error: null
                });
                return req;
            })

            this.resInterceptor = axios.interceptors.response.use(res => res , error => {
                this.setState({
                    error: error
                })
            })
        }

        // To prevent memory leaks when we reuse withErrorHandler in other components
        componentWillUnmount = () => {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({
                error : null
            })
        }
        render(){
            return (
            <Fragment>
                <Modal show = {this.state.error} modalClosed = {this.errorConfirmedHandler}>
                    {this.state.error? this.state.error.message : null}
                </Modal>
                <WrappedComponent {...this.props} />
            </Fragment>
            )
        }
    }
}

export default withErrorHandler;