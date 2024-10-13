import { Component } from "react";
import { useParams } from "react-router-dom";
import { getService } from "./api";

class Service extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, service: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getService(this.props.params.serviceId)
            .then((service) => this.setState({ loading: false, service }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return <div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.service && <div>

                <div>Name: {this.state.service.name}</div>
                <div>Type: {this.state.service.type}</div>
                <div>Host: {this.state.service.host}</div>
                <div>Disabled: {this.state.service.disabled ? "Yes" : "No"}</div>

            </div>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Service {...props} params={useParams()} />;
