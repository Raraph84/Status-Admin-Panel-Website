import { Component, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../api";

class CreateGroup extends Component {
    constructor(props) {
        super(props);

        this.nameInputRef = createRef();

        this.state = { loading: false, info: null };
    }

    render() {
        const handleCreateGroup = () => {
            this.setState({ loading: true, info: null });
            createGroup(this.nameInputRef.current.value)
                .then((groupId) => this.props.navigate("/groups/" + groupId))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return (
            <div>
                <div className="title">Create group</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                <div className="input-field">
                    <div>Name:</div>
                    <input
                        ref={this.nameInputRef}
                        disabled={this.state.loading}
                        autoFocus
                        onKeyDown={(event) => event.key === "Enter" && handleCreateGroup()}
                    />
                </div>

                <div className="buttons">
                    <button disabled={this.state.loading} onClick={handleCreateGroup}>
                        Create group
                    </button>
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line
export default (props) => <CreateGroup {...props} navigate={useNavigate()} />;
