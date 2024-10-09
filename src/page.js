import { Component } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "./api";

import "./styles/page.scss";

class Page extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, page: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getPage(this.props.params.pageId, ["subPages", "subPages.subPage", "services", "services.service"]).then((page) => {
            this.setState({ loading: false, page });
        }).catch(() => {
            this.setState({ loading: false, info: "An error occurred" });
        });
    }

    render() {
        return <div className="page-page">

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.page && <div>

                <div>Title: {this.state.page.title}</div>
                <div>Short name: {this.state.page.shortName}</div>
                <div>URL: <a href={this.state.page.url} target="_blank" rel="noreferrer">{this.state.page.url}</a></div>
                <div>Logo URL: <a href={this.state.page.logoUrl} target="_blank" rel="noreferrer">{this.state.page.logoUrl}</a></div>
                <div>Domain: {this.state.page.domain ? <a href={"https://" + this.state.page.domain} target="_blank" rel="noreferrer">{this.state.page.domain}</a> : "N/A"}</div>
                <br />

                <div>Sub pages:</div>
                {this.state.page.subPages.map((subPage) => <div key={subPage.subPage.id}>- {subPage.subPage.title}</div>)}
                {!this.state.page.subPages.length && <div>No sub pages yet</div>}
                <br />

                <div>Services:</div>
                <div className="services">
                    <span>{this.state.page.services.sort((a, b) => a.position - b.position).map((service) => <div key={service.service.id}>- <a href={"/services/" + service.service.id}>{service.service.name}</a></div>)}</span>
                    <span>{this.state.page.services.sort((a, b) => a.position - b.position).map((service) => <div key={service.service.id}>Display name: {service.displayName ?? "N/A"}</div>)}</span>
                    <span>{this.state.page.services.sort((a, b) => a.position - b.position).map((service) => <div key={service.service.id}>Position: {service.position}</div>)}</span>
                </div>
                {!this.state.page.services.length && <div>No services yet</div>}

            </div>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Page {...props} params={useParams()} />;
