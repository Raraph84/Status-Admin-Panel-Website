import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LinkedTr } from "../utils";
import { getGroups } from "../api";

const Groups = () => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(null);
    const [groups, setGroups] = useState(null);

    useEffect(() => {
        setLoading(true);
        getGroups()
            .then((groups) => {
                setLoading(false);
                setGroups(groups);
            })
            .catch((error) => {
                setLoading(false);
                setInfo(error);
            });
    }, []);

    return (
        <div>
            <div className="title">Groups</div>

            {loading && <div className="state">Loading...</div>}
            {info && <div className="state">{info}</div>}

            <div>
                <Link to="/groups/create">Create group</Link>
            </div>
            <br />

            {groups && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <LinkedTr key={group.id} to={"/groups/" + group.id}>
                                <td>{group.name}</td>
                            </LinkedTr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Groups;
