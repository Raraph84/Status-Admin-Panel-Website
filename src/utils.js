import { Component } from "react";
import { Link } from "react-router-dom";

export class LinkedTr extends Component {
    render() {
        const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
        return (
            <tr className="linked">
                {children.map((child, index) => (
                    <td key={index}>
                        <Link to={this.props.to}>{child.props.children}</Link>
                    </td>
                ))}
            </tr>
        );
    }
}
