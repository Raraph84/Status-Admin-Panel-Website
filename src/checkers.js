import { Component } from "react";
import { Link } from "react-router-dom";
import { getCheckers } from "./api";

export default class Checkers extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, checkers: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getCheckers().then((checkers) => {
            this.setState({ loading: false, checkers });
        }).catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return <div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.checkers && <div>{this.state.checkers.map((checker) => <div key={checker.id}>- <Link to={"/checkers/" + checker.id}>{checker.name} {checker.location}</Link></div>)}</div>}

        </div>;
    }
}
