import { Component } from "react";
import { useParams } from "react-router-dom";
import { getChecker } from "../api";

import "./checker.scss";

class Checker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            info: null,
            checker: null
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        getChecker(this.props.params.checkerId)
            .then((checker) => this.setState({ loading: false, checker }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return (
            <div className="checker-page">
                <div className="title">Checker</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                <div>Name: {this.state.checker?.name}</div>
                <div>Description: {this.state.checker?.description}</div>
                <div>Location: {this.state.checker?.location}</div>
                <div>Check second: {this.state.checker?.checkSecond}</div>
            </div>
        );
    }
}

// eslint-disable-next-line
export default (props) => <Checker {...props} params={useParams()} />;
