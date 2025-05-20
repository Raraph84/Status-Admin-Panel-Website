import { Component, createRef } from "react";
import { useParams } from "react-router-dom";
import { getService, updateService } from "../api";

class Service extends Component {

    constructor(props) {

        super(props);

        this.nameInputRef = createRef();
        this.typeSelectRef = createRef();
        this.hostInputRef = createRef();
        this.protocolSelectRef = createRef();
        this.alertInputRef = createRef();
        this.disabledInputRef = createRef();

        this.state = { loading: false, info: null, service: null, editing: false };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getService(this.props.params.serviceId)
            .then((service) => this.setState({ loading: false, service }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {

        const editHandler = () => {

            const updates = {};
            if (this.nameInputRef.current.value.trim() !== this.state.service.name) updates.name = this.nameInputRef.current.value.trim();
            if (this.typeSelectRef.current.value !== this.state.service.type) updates.type = this.typeSelectRef.current.value;
            if (this.hostInputRef.current.value.trim() !== this.state.service.host) updates.host = this.hostInputRef.current.value.trim();
            if (parseInt(this.protocolSelectRef.current.value) !== this.state.service.protocol) updates.protocol = parseInt(this.protocolSelectRef.current.value);
            if (this.alertInputRef.current.checked !== this.state.service.alert) updates.alert = this.alertInputRef.current.checked;
            if (this.disabledInputRef.current.checked !== this.state.service.disabled) updates.disabled = this.disabledInputRef.current.checked;

            if (!Object.keys(updates).length) {
                this.setState({ editing: false });
                return;
            }

            this.setState({ loading: true, info: null });
            updateService(this.state.service.id, updates)
                .then(() => this.setState({ loading: false, editing: false, service: { ...this.state.service, ...updates } }))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return <div>

            <div className="title">Service</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {!this.state.editing ? <>

                <div>Name: {this.state.service?.name}</div>
                <div>Type: {{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[this.state.service?.type]}</div>
                <div>Host: {this.state.service?.host}</div>
                <div>Protocol: {{ 0: "IPv6 or IPv4", 4: "IPv4", 6: "IPv6" }[this.state.service?.protocol]}</div>
                <div>Alert: {this.state.service?.alert ? "Yes" : "No"}</div>
                <div>Disabled: {this.state.service?.disabled ? "Yes" : "No"}</div>

                <div className="buttons"><button disabled={this.state.loading} onClick={() => this.setState({ editing: true })}>Edit</button></div>

            </> : <>

                <div className="input-field">
                    <div>Name:</div>
                    <input ref={this.nameInputRef} defaultValue={this.state.service.name} disabled={this.state.loading} autoFocus
                        onKeyDown={(event) => event.key === "Enter" && this.hostInputRef.current.focus()} />
                </div>
                <div className="input-field">
                    <div>Type:</div>
                    <select ref={this.typeSelectRef} defaultValue={this.state.service.type} disabled={this.state.loading} >
                        <option value="website">Website</option>
                        <option value="api">API</option>
                        <option value="gateway">Gateway</option>
                        <option value="minecraft">Minecraft</option>
                        <option value="server">Server</option>
                    </select>
                </div>
                <div className="input-field">
                    <div>Host:</div>
                    <input ref={this.hostInputRef} defaultValue={this.state.service.host} disabled={this.state.loading}
                        onKeyDown={(event) => event.key === "Enter" && editHandler()} />
                </div>
                <div className="input-field">
                    <div>Protocol:</div>
                    <select ref={this.protocolSelectRef} defaultValue={this.state.service.protocol} disabled={this.state.loading} >
                        <option value={0}>IPv6 or IPv4</option>
                        <option value={4}>IPv4</option>
                        <option value={6}>IPv6</option>
                    </select>
                </div>
                <div className="input-field">
                    <div>Alert:</div>
                    <input ref={this.alertInputRef} type="checkbox" defaultChecked={this.state.service.alert} alert={this.state.loading} />
                </div>
                <div className="input-field">
                    <div>Disabled:</div>
                    <input ref={this.disabledInputRef} type="checkbox" defaultChecked={this.state.service.disabled} disabled={this.state.loading} />
                </div>

                <div className="buttons">
                    <button disabled={this.state.loading} onClick={editHandler}>Save</button>
                    <button disabled={this.state.loading} onClick={() => this.setState({ editing: false })}>Cancel</button>
                </div>

            </>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Service {...props} params={useParams()} />;
