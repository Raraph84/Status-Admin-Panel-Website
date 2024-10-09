import { Component, createRef } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/page.scss";

class CreatePage extends Component {

    constructor(props) {

        super(props);

        this.titleInputRef = createRef();
        this.shortNameInputRef = createRef();
        this.urlInputRef = createRef();
        this.logoUrlInputRef = createRef();
        this.domainInputRef = createRef();

        this.state = { loading: false, info: null };
    }

    render() {

        const processCreatePage = () => {

        };

        return <div className="create-page-page">

            <div className="title">Create page</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div>Title:</div>
            <input ref={this.titleInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && this.shortNameInputRef.current.focus()} />
            <div>Short name:</div>
            <input ref={this.shortNameInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && this.urlInputRef.current.focus()} />
            <div>URL:</div>
            <input ref={this.urlInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && this.logoUrlInputRef.current.focus()} />
            <div>Logo URL:</div>
            <input ref={this.logoUrlInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && this.domainInputRef.current.focus()} />
            <div>Domain (not required):</div>
            <input ref={this.domainInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && processCreatePage()} />

            <div><button disabled={this.state.loading} onClick={processCreatePage}>Create page</button></div>

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <CreatePage {...props} navigate={useNavigate()} />;
