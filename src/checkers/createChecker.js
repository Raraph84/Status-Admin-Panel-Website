import { Component, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { createChecker } from "../api";

class CreateChecker extends Component {
    constructor(props) {
        super(props);

        this.nameInputRef = createRef();
        this.descriptionInputRef = createRef();
        this.locationInputRef = createRef();
        this.checkSecondInputRef = createRef();

        this.state = { loading: false, info: null };
    }

    render() {
        const handleCreateChecker = () => {
            this.setState({ loading: true, info: null });
            createChecker(
                this.nameInputRef.current.value,
                this.descriptionInputRef.current.value,
                this.locationInputRef.current.value,
                parseInt(this.checkSecondInputRef.current.value)
            )
                .then((checkerId) => this.props.navigate("/checkers/" + checkerId))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return (
            <div>
                <div className="title">Create checker</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                <div className="input-field">
                    <div>Name:</div>
                    <input
                        ref={this.nameInputRef}
                        disabled={this.state.loading}
                        autoFocus
                        onKeyDown={(event) => event.key === "Enter" && this.descriptionInputRef.current.focus()}
                    />
                </div>
                <div className="input-field">
                    <div>Description:</div>
                    <input
                        ref={this.descriptionInputRef}
                        disabled={this.state.loading}
                        onKeyDown={(event) => event.key === "Enter" && this.locationInputRef.current.focus()}
                    />
                </div>
                <div className="input-field">
                    <div>Location:</div>
                    <input
                        ref={this.locationInputRef}
                        disabled={this.state.loading}
                        onKeyDown={(event) => event.key === "Enter" && this.checkSecondInputRef.current.focus()}
                    />
                </div>
                <div className="input-field">
                    <div>Check Second:</div>
                    <input
                        ref={this.checkSecondInputRef}
                        type="number"
                        min="0"
                        max="59"
                        defaultValue="0"
                        disabled={this.state.loading}
                        onKeyDown={(event) => event.key === "Enter" && handleCreateChecker()}
                    />
                </div>

                <div className="buttons">
                    <button disabled={this.state.loading} onClick={handleCreateChecker}>
                        Create checker
                    </button>
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line
export default (props) => <CreateChecker {...props} navigate={useNavigate()} />;
