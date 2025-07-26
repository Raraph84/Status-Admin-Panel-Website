import { Component, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "../api";

class CreateService extends Component {
    constructor(props) {
        super(props);

        this.nameInputRef = createRef();
        this.typeSelectRef = createRef();
        this.hostInputRef = createRef();
        this.protocolSelectRef = createRef();
        this.alertInputRef = createRef();
        this.disabledInputRef = createRef();

        this.state = { loading: false, info: null };
    }

    render() {
        const processCreateService = () => {
            this.setState({ loading: true, info: null });
            createService(
                this.nameInputRef.current.value,
                this.typeSelectRef.current.value,
                this.hostInputRef.current.value,
                parseInt(this.protocolSelectRef.current.value),
                this.alertInputRef.current.checked,
                this.disabledInputRef.current.checked
            )
                .then((serviceId) => this.props.navigate("/services/" + serviceId))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return (
            <div>
                <div className="title">Create service</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                <div className="input-field">
                    <div>Name:</div>
                    <input
                        ref={this.nameInputRef}
                        disabled={this.state.loading}
                        autoFocus
                        onKeyDown={(event) => event.key === "Enter" && this.hostInputRef.current.focus()}
                    />
                </div>
                <div className="input-field">
                    <div>Type:</div>
                    <select ref={this.typeSelectRef} disabled={this.state.loading}>
                        <option value="website">Website</option>
                        <option value="api">API</option>
                        <option value="gateway">Gateway</option>
                        <option value="minecraft">Minecraft</option>
                        <option value="server">Server</option>
                    </select>
                </div>
                <div className="input-field">
                    <div>Host:</div>
                    <input
                        ref={this.hostInputRef}
                        disabled={this.state.loading}
                        onKeyDown={(event) => event.key === "Enter" && processCreateService()}
                    />
                </div>
                <div className="input-field">
                    <div>Protocol:</div>
                    <select ref={this.protocolSelectRef} defaultValue={4} disabled={this.state.loading}>
                        <option value={0}>IPv6 or IPv4</option>
                        <option value={4}>IPv4</option>
                        <option value={6}>IPv6</option>
                    </select>
                </div>
                <div className="input-field">
                    <div>Alert:</div>
                    <input ref={this.alertInputRef} type="checkbox" defaultChecked disabled={this.state.loading} />
                </div>
                <div className="input-field">
                    <div>Disabled:</div>
                    <input ref={this.disabledInputRef} type="checkbox" disabled={this.state.loading} />
                </div>

                <div className="buttons">
                    <button disabled={this.state.loading} onClick={processCreateService}>
                        Create service
                    </button>
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line
export default (props) => <CreateService {...props} navigate={useNavigate()} />;
