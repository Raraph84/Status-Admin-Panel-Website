import { Component, useEffect, useState } from "react";
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

export const useRequestState = () => {
    const [state, setState] = useState({ requests: 0, info: null });
    const [pendingCallbacks, setPendingCallbacks] = useState([]);

    useEffect(() => {
        if (pendingCallbacks.length) {
            for (const callback of pendingCallbacks) callback();
            setPendingCallbacks([]);
        }
    }, [pendingCallbacks]);

    const requestState = (
        <>
            {state.requests > 0 && <div className="state">Loading...</div>}
            {state.info && <div className="state">{state.info}</div>}
        </>
    );

    const incrementRequest = (cb = null) => {
        setState((prev) => ({ requests: prev.requests + 1, info: prev.requests ? prev.info : null }));
        if (cb) setPendingCallbacks((prev) => [...prev, cb]);
    };
    const decrementRequest = (info = null, cb = null) => {
        setState((prev) => ({ requests: prev.requests - 1, info: info ?? prev.info }));
        if (cb) setPendingCallbacks((prev) => [...prev, cb]);
    };

    return [requestState, state.requests > 0, incrementRequest, decrementRequest];
};
