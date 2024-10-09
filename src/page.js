import { Component } from "react";
import { Link, useParams } from "react-router-dom";
import { getPage, getPageServices, getServices, addPageService, removePageService } from "./api";

import "./styles/page.scss";

class Page extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, page: null, pageServices: null, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getPage(this.props.params.pageId, ["subPages", "subPages.subPage"]).then((page) => {
            this.setState({ loading: false, page });
        }).catch((error) => this.setState({ loading: false, info: error }));

        this.setState({ loading: true });
        getPageServices(this.props.params.pageId, ["service"]).then((pageServices) => {
            this.setState({ loading: false, pageServices });
        }).catch((error) => this.setState({ loading: false, info: error }));

        this.setState({ loading: true });
        getServices().then((services) => {
            this.setState({ loading: false, services });
        }).catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {

        const processAddPageService = (service) => {
            this.setState({ loading: true, info: null });
            addPageService(this.state.page.id, service.id).then(() => {
                this.setState({ loading: false, pageServices: this.state.pageServices.concat({ page: this.state.page.id, service, position: this.state.pageServices.length + 1, displayName: null }).sort((a, b) => a.service.id - b.service.id) });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const processRemovePageService = (pageService) => {
            this.setState({ loading: true, info: null });
            removePageService(this.state.page.id, pageService.service.id).then(() => {
                this.setState({ loading: false, pageServices: this.state.pageServices.filter((service) => service.service.id !== pageService.service.id).map((service) => ({ ...service, position: service.position > pageService.position ? service.position - 1 : service.position })) });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const nonAddedServices = this.state.services?.filter((service) => !this.state.pageServices?.some((pageService) => pageService.service.id === service.id));

        return <div className="page-page">

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.page && <div>

                <div>Short name: {this.state.page.shortName}</div>
                <div>Title: {this.state.page.title}</div>
                <div>URL: <a href={this.state.page.url} target="_blank" rel="noreferrer">{this.state.page.url}</a></div>
                <div>Logo URL: <a href={this.state.page.logoUrl} target="_blank" rel="noreferrer">{this.state.page.logoUrl}</a></div>
                <div>Domain: {this.state.page.domain ? <a href={"https://" + this.state.page.domain} target="_blank" rel="noreferrer">{this.state.page.domain}</a> : "N/A"}</div>
                <br />

                <div>Sub pages:</div>
                {this.state.page.subPages.map((subPage) => <div key={subPage.subPage.id}>- {subPage.subPage.title}</div>)}
                {!this.state.page.subPages.length && <div>No sub pages yet</div>}
                <br />

                <div>Services:</div>
                {!!this.state.pageServices?.length && <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Display name</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pageServices?.sort((a, b) => a.position - b.position).map((service) => <tr key={service.service.id}>
                            <td><Link to={"/services/" + service.service.id}>{service.service.name}</Link></td>
                            <td>{service.displayName ?? "N/A"}</td>
                            <td>{service.position}</td>
                            <td><button disabled={this.state.loading} onClick={() => processRemovePageService(service)}>Remove</button></td>
                        </tr>)}
                    </tbody>
                </table>}
                {!this.state.pageServices?.length && <div>No services yet</div>}
                <br />

                <div>Non added services:</div>
                <div>{nonAddedServices?.map((service) =>
                    <div key={service.id}>- <a href={"/services/" + service.id}>{service.name}</a> <button disabled={this.state.loading}
                        onClick={() => processAddPageService(service)}>Add</button></div>)}</div>
                <div>{!nonAddedServices?.length && <div>No services not added</div>}</div>

            </div>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Page {...props} params={useParams()} />;
