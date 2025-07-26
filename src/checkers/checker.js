import { Component, createRef } from "react";
import { useParams } from "react-router-dom";
import { getChecker, updateChecker } from "../api";

import "./checker.scss";

class Checker extends Component {
    constructor(props) {
        super(props);

        this.nameInputRef = createRef();
        this.descriptionInputRef = createRef();
        this.locationInputRef = createRef();
        this.checkSecondInputRef = createRef();

        this.state = {
            loading: false,
            info: null,
            checker: null,
            editing: false
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        getChecker(this.props.params.checkerId)
            .then((checker) => this.setState({ loading: false, checker }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        const editHandler = () => {
            const updates = {};
            if (this.nameInputRef.current.value.trim() !== this.state.checker.name)
                updates.name = this.nameInputRef.current.value;
            if (this.descriptionInputRef.current.value.trim() !== this.state.checker.description)
                updates.description = this.descriptionInputRef.current.value;
            if (this.locationInputRef.current.value.trim() !== this.state.checker.location)
                updates.location = this.locationInputRef.current.value;
            if (parseInt(this.checkSecondInputRef.current.value) !== this.state.checker.checkSecond)
                updates.checkSecond = parseInt(this.checkSecondInputRef.current.value);

            if (!Object.keys(updates).length) {
                this.setState({ editing: false });
                return;
            }

            this.setState({ loading: true, info: null });
            updateChecker(this.state.checker.id, updates)
                .then(() =>
                    this.setState({ loading: false, editing: false, checker: { ...this.state.checker, ...updates } })
                )
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        return (
            <div className="checker-page">
                <div className="title">Checker</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                {!this.state.editing ? (
                    <>
                        <div>Name: {this.state.checker?.name}</div>
                        <div>Description: {this.state.checker?.description}</div>
                        <div>Location: {this.state.checker?.location}</div>
                        <div>Check second: {this.state.checker?.checkSecond}</div>

                        <div className="buttons">
                            <button disabled={this.state.loading} onClick={() => this.setState({ editing: true })}>
                                Edit
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-field">
                            <div>Name:</div>
                            <input
                                ref={this.nameInputRef}
                                defaultValue={this.state.checker.name}
                                disabled={this.state.loading}
                                autoFocus
                                onKeyDown={(event) => event.key === "Enter" && this.descriptionInputRef.current.focus()}
                            />
                        </div>
                        <div className="input-field">
                            <div>Description:</div>
                            <input
                                ref={this.descriptionInputRef}
                                defaultValue={this.state.checker.description}
                                disabled={this.state.loading}
                                onKeyDown={(event) => event.key === "Enter" && this.locationInputRef.current.focus()}
                            />
                        </div>
                        <div className="input-field">
                            <div>Location:</div>
                            <input
                                ref={this.locationInputRef}
                                defaultValue={this.state.checker.location}
                                disabled={this.state.loading}
                                onKeyDown={(event) => event.key === "Enter" && this.checkSecondInputRef.current.focus()}
                            />
                        </div>
                        <div className="input-field">
                            <div>Check second:</div>
                            <input
                                ref={this.checkSecondInputRef}
                                type="number"
                                min="0"
                                max="59"
                                defaultValue={this.state.checker.checkSecond}
                                disabled={this.state.loading}
                                onKeyDown={(event) => event.key === "Enter" && editHandler()}
                            />
                        </div>

                        <div className="buttons">
                            <button disabled={this.state.loading} onClick={editHandler}>
                                Save
                            </button>
                            <button disabled={this.state.loading} onClick={() => this.setState({ editing: false })}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

// eslint-disable-next-line
export default (props) => <Checker {...props} params={useParams()} />;
