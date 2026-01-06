import { useEffect, useState } from "react";
import { getGroups, getServices, addGroupService, removeGroupService } from "../api";
import { useRequestState } from "../utils";

const Matrix = () => {
    const [requestState, loading, incrementRequest, decrementRequest] = useRequestState();
    const [services, setServices] = useState(null);
    const [groups, setGroups] = useState(null);

    useEffect(() => {
        incrementRequest();
        getGroups(["services", "services.service"])
            .then((groups) => {
                decrementRequest();
                setGroups(groups);
            })
            .catch((error) => decrementRequest(error));
        incrementRequest();
        getServices()
            .then((services) => {
                decrementRequest();
                setServices(services.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)));
            })
            .catch((error) => decrementRequest(error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddService = (group, service) => {
        incrementRequest();
        addGroupService(group.id, service.id)
            .then(() => {
                setGroups(
                    groups.map((g) =>
                        g.id === group.id ? { ...g, services: g.services.concat({ group: g.id, service }) } : g
                    )
                );
                decrementRequest();
            })
            .catch((error) => decrementRequest(error));
    };

    const handleRemoveService = (group, service) => {
        incrementRequest();
        removeGroupService(group.id, service.id)
            .then(() => {
                setGroups(
                    groups.map((g) =>
                        g.id === group.id
                            ? { ...g, services: g.services.filter((s) => s.service.id !== service.id) }
                            : g
                    )
                );
                decrementRequest();
            })
            .catch((error) => decrementRequest(error));
    };

    return (
        <div>
            <div className="title">Matrix Groups - Services</div>

            {requestState}

            {groups && services && (
                <table className="matrix">
                    <thead>
                        <tr>
                            <th>Service / Group</th>
                            {groups.map((group) => (
                                <th key={group.id}>{group.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                {groups.map((group) => (
                                    <td key={group.id}>
                                        {group.services.some((s) => s.service.id === service.id) ? (
                                            <input
                                                type="checkbox"
                                                disabled={loading}
                                                checked={true}
                                                onChange={() => handleRemoveService(group, service)}
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                disabled={loading}
                                                checked={false}
                                                onChange={() => handleAddService(group, service)}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Matrix;
