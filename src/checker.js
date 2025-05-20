import { Component } from "react";
import { Link, useParams } from "react-router-dom";
import { getChecker, getCheckerServices, removeCheckerService, getServices, addCheckerService } from "./api";

import "./styles/checker.scss";

class Checker extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, checker: null, checkerServices: null, addService: false, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        Promise.all([
            getChecker(this.props.params.checkerId)
                .then((checker) => this.setState({ checker }))
                .catch((error) => this.setState({ info: error })),
            getCheckerServices(this.props.params.checkerId, ["service"])
                .then((checkerServices) => this.setState({ checkerServices }))
                .catch((error) => this.setState({ info: error }))
        ]).then(() => this.setState({ loading: false }));
    }

    render() {

        const toggleAddServices = () => {

            if (this.state.addService) {
                this.setState({ addService: !this.state.addService, services: null });
                return;
            }

            this.setState({ loading: true, info: null });
            getServices()
                .then((services) => this.setState({ loading: false, addService: true, services }))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        const addServiceHandler = (service) => {
            this.setState({ loading: true, info: null });
            addCheckerService(this.state.checker.id, service.id).then(() => {
                this.setState({ loading: false, checkerServices: this.state.checkerServices.concat({ checker: this.state.checker.id, service }).sort((a, b) => a.service.id - b.service.id) });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const removeServiceHandler = (checkerService) => {
            this.setState({ loading: true, info: null });
            removeCheckerService(this.state.checker.id, checkerService.service.id).then(() => {
                this.setState({ loading: false, checkerServices: this.state.checkerServices.filter((service) => service.service.id !== checkerService.service.id) });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const nonAddedServices = this.state.services?.filter((service) => !this.state.checkerServices?.some((checkerService) => checkerService.service.id === service.id));

        return <div className="checker-page">

            <div className="title">Checker</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div>Name: {this.state.checker?.name}</div>
            <div>Description: {this.state.checker?.description}</div>
            <div>Location: {this.state.checker?.location}</div>
            <div>Check second: {this.state.checker?.checkSecond}</div>
            <br />

            <div>Services:</div>
            {!!this.state.checkerServices?.length && <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.checkerServices?.map((service) => <tr key={service.service.id}>
                        <td><Link to={"/services/" + service.service.id}>{service.service.name}</Link></td>
                        <td>{{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[service.service.type]}</td>
                        <td><button disabled={this.state.loading} onClick={() => removeServiceHandler(service)}>Remove</button></td>
                    </tr>)}
                </tbody>
            </table>}
            {!this.state.checkerServices?.length && <div>No services yet</div>}

            <button disabled={this.state.loading} onClick={toggleAddServices}>Add services</button>
            {this.state.addService && <>
                <div>Non added services:</div>
                {!!nonAddedServices?.length && <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nonAddedServices?.map((service) => <tr key={service.id}>
                            <td><Link to={"/services/" + service.id}>{service.name}</Link></td>
                            <td>{{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[service.type]}</td>
                            <td><button disabled={this.state.loading} onClick={() => addServiceHandler(service)}>Add</button></td>
                        </tr>)}
                    </tbody>
                </table>}
                {!nonAddedServices?.length && <div>No services not added</div>}
            </>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Checker {...props} params={useParams()} />;
