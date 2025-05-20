import { useEffect, useState } from "react";
import {
    getGroup,
    removeGroupService,
    removeGroupChecker,
    getServices,
    addGroupService,
    getCheckers,
    addGroupChecker
} from "../api";
import { Link, useParams } from "react-router-dom";

const Group = () => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(null);
    const [group, setGroup] = useState(null);
    const [services, setServices] = useState(null);
    const [checkers, setCheckers] = useState(null);
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

    const toggleAddServices = () => {
        if (services) {
            setServices(null);
            return;
        }
        setLoading(true);
        setInfo(null);
        getServices()
            .then((services) => {
                setLoading(false);
                setServices(services);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    };

    const toggleAddCheckers = () => {
        if (checkers) {
            setCheckers(null);
            return;
        }
        setLoading(true);
        setInfo(null);
        getCheckers()
            .then((checkers) => {
                setLoading(false);
                setCheckers(checkers);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    };

    const addServiceHandler = (service) => {
        setLoading(true);
        setInfo(null);
        addGroupService(group.id, service.id)
            .then(() => {
                setGroup({
                    ...group,
                    services: group.services
                        .concat({ group: group.id, service })
                        .sort((a, b) => a.service.id - b.service.id)
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    };

    const addCheckerHandler = (checker) => {
        setLoading(true);
        setInfo(null);
        addGroupChecker(group.id, checker.id)
            .then(() => {
                setGroup({
                    ...group,
                    checkers: group.checkers
                        .concat({ group: group.id, checker })
                        .sort((a, b) => a.checker.id - b.checker.id)
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    };

    const nonAddedServices = services?.filter(
        (service) => !group?.services?.some((gs) => gs.service.id === service.id)
    );

    const nonAddedCheckers = checkers?.filter(
        (checker) => !group?.checkers?.some((gc) => gc.checker.id === checker.id)
    );

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
                    <br />

                    <button disabled={loading} onClick={toggleAddServices}>
                        Add services
                    </button>
                    <button disabled={loading} onClick={toggleAddCheckers}>
                        Add checkers
                    </button>

                    {services && (
                        <>
                            <div>Non added services:</div>
                            {nonAddedServices?.length ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Service</th>
                                            <th>Type</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nonAddedServices.map((service) => (
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
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => addServiceHandler(service)}
                                                    >
                                                        Add
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>No services not added</div>
                            )}
                        </>
                    )}

                    {checkers && (
                        <>
                            <div>Non added checkers:</div>
                            {nonAddedCheckers?.length ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Checker</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nonAddedCheckers.map((checker) => (
                                            <tr key={checker.id}>
                                                <td>
                                                    <Link to={"/checkers/" + checker.id}>{checker.name}</Link>
                                                </td>
                                                <td>
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => addCheckerHandler(checker)}
                                                    >
                                                        Add
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>No checkers not added</div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Group;
