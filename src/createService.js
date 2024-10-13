import { Component, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "./api";

import "./styles/service.scss";

class CreateService extends Component {

    constructor(props) {

        super(props);

        this.nameInputRef = createRef();
        this.typeSelectRef = createRef();
        this.hostInputRef = createRef();
        this.disabledInputRef = createRef();

        this.state = { loading: false, info: null };
    }

    render() {

        const processCreateService = () => {

            this.setState({ loading: true, info: null });
            createService(this.nameInputRef.current.value, this.typeSelectRef.current.value, this.hostInputRef.current.value, this.disabledInputRef.current.checked)
                .then((serviceId) => this.props.navigate("/services/" + serviceId))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return <div className="create-service-page">

            <div className="title">Create service</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div>Name:</div>
            <input ref={this.nameInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && this.hostInputRef.current.focus()} />
            <div>Type:</div>
            <select ref={this.typeSelectRef} disabled={this.state.loading}>
                <option value="website">Website</option>
                <option value="api">API</option>
                <option value="gateway">Gateway</option>
                <option value="minecraft">Minecraft</option>
                <option value="server">Server</option>
            </select>
            <div>Host:</div>
            <input ref={this.hostInputRef} disabled={this.state.loading} onKeyDown={(event) => event.key === "Enter" && processCreateService()} />
            <div>Disabled:</div>
            <input ref={this.disabledInputRef} type="checkbox" disabled={this.state.loading} />

            <div><button disabled={this.state.loading} onClick={processCreateService}>Create page</button></div>

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <CreateService {...props} navigate={useNavigate()} />;
