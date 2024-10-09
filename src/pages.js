import { Component } from "react";
import { Link } from "react-router-dom";
import { getPages } from "./api";

export default class Pages extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, pages: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        getPages().then((pages) => {
            this.setState({ loading: false, pages });
        }).catch(() => {
            this.setState({ loading: false, info: "An error occurred" });
        });
    }

    render() {
        return <div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div><Link to="/pages/create">Create page</Link></div>
            <br />

            {this.state.pages && <div>{this.state.pages.map((page) => <div key={page.id}>- <Link to={"/pages/" + page.id}>{page.title}</Link></div>)}</div>}

        </div>;
    }
}
