import { Component } from "react";
import { Link } from "react-router-dom";
import { getServices } from "./api";

export default class Services extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getServices().then((services) => {
            this.setState({ loading: false, services });
        }).catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return <div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div><Link to="/services/create">Create service</Link></div>
            <br />

            {this.state.services && <div>{this.state.services.map((service) => <div key={service.id}>- <Link to={"/services/" + service.id}>{service.name}</Link></div>)}</div>}

        </div>;
    }
}
