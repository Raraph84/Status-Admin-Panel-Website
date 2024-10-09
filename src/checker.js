import { Component } from "react";
import { useParams } from "react-router-dom";
import { getChecker, getCheckerServices, getServices, addCheckerService, removeCheckerService } from "./api";

import "./styles/checker.scss";

class Checker extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, checker: null, checkerServices: null, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getChecker(this.props.params.checkerId).then((checker) => {
            this.setState({ loading: false, checker });
        }).catch(() => {
            this.setState({ loading: false, info: "An error occurred" });
        });

        this.setState({ loading: true });
        getCheckerServices(this.props.params.checkerId, ["service"]).then((checkerServices) => {
            this.setState({ loading: false, checkerServices });
        }).catch(() => {
            this.setState({ loading: false, info: "An error occurred" });
        });

        this.setState({ loading: true });
        getServices().then((services) => {
            this.setState({ loading: false, services });
        }).catch(() => {
            this.setState({ loading: false, info: "An error occurred" });
        });
    }

    render() {

        const processAddCheckerService = (service) => {
            this.setState({ loading: true, info: null });
            addCheckerService(this.state.checker.id, service.id).then(() => {
                this.setState({ loading: false, checkerServices: this.state.checkerServices.concat({ checker: this.state.checker.id, service }).sort((a, b) => a.service.id - b.service.id) });
            }).catch(() => {
                this.setState({ loading: false, info: "An error occurred" });
            });
        };

        const processRemoveCheckerService = (serviceId) => {
            this.setState({ loading: true, info: null });
            removeCheckerService(this.state.checker.id, serviceId).then(() => {
                this.setState({ loading: false, checkerServices: this.state.checkerServices.filter((service) => service.service.id !== serviceId) });
            }).catch(() => {
                this.setState({ loading: false, info: "An error occurred" });
            });
        };

        const nonAddedServices = this.state.services?.filter((service) => !this.state.checkerServices?.some((checkerService) => checkerService.service.id === service.id));

        return <div className="checker-page">

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.checker && <div>

                <div>Name: {this.state.checker.name}</div>
                <div>Description: {this.state.checker.description}</div>
                <div>Location: {this.state.checker.location}</div>
                <div>Check second: {this.state.checker.checkSecond}</div>
                <div>Hidden: {this.state.checker.hidden ? "Yes" : "No"}</div>
                <br />

                <div>Services:</div>
                <div>{this.state.checkerServices?.map((service) =>
                    <div key={service.service.id}>- <a href={"/services/" + service.service.id}>{service.service.name}</a> <button disabled={this.state.loading}
                        onClick={() => processRemoveCheckerService(service.service.id)}>Remove</button></div>
                )}</div>
                {!this.state.checkerServices?.length && <div>No services yet</div>}
                <br />

                <div>Non added services:</div>
                <div>{nonAddedServices?.map((service) =>
                    <div key={service.id}>- <a href={"/services/" + service.id}>{service.name}</a> <button disabled={this.state.loading}
                        onClick={() => processAddCheckerService(service)}>Add</button></div>)}</div>
                <div>{!nonAddedServices?.length && <div>No services not added</div>}</div>

            </div>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Checker {...props} params={useParams()} />;
