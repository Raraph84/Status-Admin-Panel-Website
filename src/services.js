import { Component } from "react";
import { Link } from "react-router-dom";
import { LinkedTr } from "./utils";
import { getServices } from "./api";

export default class Services extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getServices()
            .then((services) => this.setState({ loading: false, services }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return <div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div><Link to="/services/create">Create service</Link></div>
            <br />

            {this.state.services && <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Disabled</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.services.map((service) => <LinkedTr key={service.id} to={"/services/" + service.id}>
                        <td>{service.name}</td>
                        <td>{{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[service.type]}</td>
                        <td>{service.disabled ? "Yes" : "No"}</td>
                    </LinkedTr>)}
                </tbody>
            </table>}

        </div>;
    }
}
