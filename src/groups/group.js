import { useEffect, useState } from "react";
import { getGroup, removeGroupService, removeGroupChecker } from "../api";
import { Link, useParams } from "react-router-dom";

const Group = () => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(null);
    const [group, setGroup] = useState(null);
    const { groupId } = useParams();

    useEffect(() => {
        setLoading(true);
        getGroup(groupId, ["services", "services.service", "checkers", "checkers.checker"])
            .then((group) => {
                setLoading(false);
                setGroup(group);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    }, [groupId]);

    const removeServiceHandler = (service) => {
        setLoading(true);
        setInfo(null);
        removeGroupService(group.id, service.id)
            .then(() => {
                setGroup({
                    ...group,
                    services: group.services.filter((s) => s.service.id !== service.id)
                });
                setLoading(false);
            })
            .catch((error) => {
                setInfo(error);
                setLoading(false);
            });
    };

    const removeCheckerHandler = (checker) => {
        setLoading(true);
        setInfo(null);
        removeGroupChecker(group.id, checker.id)
            .then(() => {
                setGroup({
                    ...group,
                    checkers: group.checkers.filter((c) => c.checker.id !== checker.id)
                });
                setLoading(false);
            })
            .catch((error) => {
                setInfo(error);
                setLoading(false);
            });
    };

    return (
        <div>
            <div className="title">Group {group?.name}</div>

            {loading && <div className="state">Loading...</div>}
            {info && <div className="state">{info}</div>}

            {group && (
                <>
                    <div>Name: {group.name}</div>
                    <br />

                    <div>Services:</div>
                    {group.services?.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.services.map(({ service }) => (
                                    <tr key={service.id}>
                                        <td>
                                            <Link to={"/services/" + service.id}>{service.name}</Link>
                                        </td>
                                        <td>
                                            {{
                                                website: "Website",
                                                api: "API",
                                                gateway: "Gateway",
                                                minecraft: "Minecraft",
                                                server: "Server"
                                            }[service.type] || service.type}
                                        </td>
                                        <td>
                                            <button disabled={loading} onClick={() => removeServiceHandler(service)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No services yet</div>
                    )}

                    <br />

                    <div>Checkers:</div>
                    {group.checkers?.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Checker</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.checkers.map(({ checker }) => (
                                    <tr key={checker.id}>
                                        <td>
                                            <Link to={"/checkers/" + checker.id}>{checker.name}</Link>
                                        </td>
                                        <td>
                                            <button disabled={loading} onClick={() => removeCheckerHandler(checker)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No checkers yet</div>
                    )}
                </>
            )}
        </div>
    );
};

export default Group;
