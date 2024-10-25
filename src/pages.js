import { Component } from "react";
import { Link } from "react-router-dom";
import { getPages } from "./api";
import { LinkedTr } from "./utils";

export default class Pages extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, pages: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getPages()
            .then((pages) => this.setState({ loading: false, pages }))
            .catch((error) => this.setState({ loading: false, info: error }));
    }

    render() {
        return <div>

            <div className="title">Pages</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div><Link to="/pages/create">Create page</Link></div>
            <br />

            {this.state.pages && <table>
                <thead>
                    <tr>
                        <th>Short name</th>
                        <th>Title</th>
                        <th>Domain</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.pages.map((page) => <LinkedTr key={page.id} to={"/pages/" + page.id}>
                        <td>{page.shortName}</td>
                        <td>{page.title}</td>
                        <td>{page.domain ?? "N/A"}</td>
                    </LinkedTr>)}
                </tbody>
            </table>}

        </div>;
    }
}
