import { Component } from "react";
import { Link } from "react-router-dom";
import { LinkedTr } from "../utils";
import { getCheckers } from "../api";

export default class Checkers extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false, info: null, checkers: null };
    }

    componentDidMount() {
        this.setState({ loading: true });
        getCheckers()
            .then((checkers) => this.setState({ loading: false, checkers }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return (
            <div>
                <div className="title">Checkers</div>

                {this.state.loading && <div className="state">Loading...</div>}
                {this.state.info && <div className="state">{this.state.info}</div>}

                <div>
                    <Link to="/checkers/create">Create checker</Link>
                </div>
                <br />

                {this.state.checkers && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.checkers.map((checker) => (
                                <LinkedTr key={checker.id} to={"/checkers/" + checker.id}>
                                    <td>{checker.name}</td>
                                    <td>{checker.location}</td>
                                    <td>{checker.description}</td>
                                </LinkedTr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}
