import { useEffect, useState } from "react";
import { getGroup } from "../api";
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No services yet</div>
                    )}
                </>
            )}
        </div>
    );
};

export default Group;
