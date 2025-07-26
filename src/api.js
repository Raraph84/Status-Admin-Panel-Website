export const createService = (name, type, host, protocol, alert, disabled) =>
    postProp("/services", { name, type, host, protocol, alert, disabled }, "id");
export const getServices = () => getProp("/services", "services");
export const getService = (serviceId, includes = []) => get(withIncludes("/services/" + serviceId, includes));
export const updateService = (serviceId, updates) => patchNoContent("/services/" + serviceId, updates);

export const createPage = (shortName, title, url, logoUrl, domain = null) =>
    postProp("/pages", { shortName, title, url, logoUrl, domain }, "id");
export const getPages = () => getProp("/pages", "pages");
export const getPage = (pageId, includes) => get(withIncludes("/pages/" + pageId, includes));
export const updatePage = (pageId, updates) => patchNoContent("/pages/" + pageId, updates);

export const getPageServices = (pageId, includes) =>
    getProp(withIncludes("/pages/" + pageId + "/services", includes), "services");
export const addPageService = (pageId, serviceId) => postNoContent("/pages/" + pageId + "/services/" + serviceId);
export const updatePageService = (pageId, serviceId, updates) =>
    patchNoContent("/pages/" + pageId + "/services/" + serviceId, updates);
export const removePageService = (pageId, serviceId) => deleteNoContent("/pages/" + pageId + "/services/" + serviceId);

export const createChecker = (name, description, location, checkSecond) =>
    postProp("/checkers", { name, description, location, checkSecond }, "id");
export const getCheckers = () => getProp("/checkers", "checkers");
export const getChecker = (checkerId, includes) => get(withIncludes("/checkers/" + checkerId, includes));
export const updateChecker = (checkerId, updates) => patchNoContent("/checkers/" + checkerId, updates);

export const createGroup = (name) => postProp("/groups", { name }, "id");
export const getGroups = (includes) => getProp(withIncludes("/groups", includes), "groups");
export const getGroup = (groupId, includes) => get(withIncludes("/groups/" + groupId, includes));

export const addGroupService = (groupId, serviceId) => putNoContent("/groups/" + groupId + "/services/" + serviceId);
export const removeGroupService = (groupId, serviceId) =>
    deleteNoContent("/groups/" + groupId + "/services/" + serviceId);

export const addGroupChecker = (groupId, checkerId) => putNoContent("/groups/" + groupId + "/checkers/" + checkerId);
export const removeGroupChecker = (groupId, checkerId) =>
    deleteNoContent("/groups/" + groupId + "/checkers/" + checkerId);

const request = (url, method, body = null, auth = true) =>
    new Promise((resolve, reject) => {
        fetch(process.env.REACT_APP_API_HOST + url, {
            method,
            headers: {
                ...(auth ? { Authorization: process.env.REACT_APP_API_KEY } : {}),
                ...(body ? { "Content-Type": "application/json" } : {})
            },
            ...(body ? { body: JSON.stringify(body) } : {})
        })
            .then((res) => {
                if (res.ok) resolve(res);
                else
                    res.json()
                        .then((res) => reject(res.message))
                        .catch((error) => reject(error.toString()));
            })
            .catch((error) => reject(error.toString()));
    });

const requestJson = (...args) =>
    new Promise((resolve, reject) => {
        request(...args)
            .then((res) => {
                res.json()
                    .then((res) => {
                        delete res.code;
                        resolve(res);
                    })
                    .catch((error) => reject(error.toString()));
            })
            .catch((error) => reject(error));
    });

const get = (url) => requestJson(url, "GET");
const getProp = (url, name) => requestJson(url, "GET").then((res) => res[name]);

const postProp = (url, body, name) => requestJson(url, "POST", body).then((res) => res[name]);
const postNoContent = (url, body) => request(url, "POST", body).then(() => undefined);
const putNoContent = (url, body) => request(url, "PUT", body).then(() => undefined);
const patchNoContent = (url, body) => request(url, "PATCH", body).then(() => undefined);
const deleteNoContent = (url) => request(url, "DELETE").then(() => undefined);

const withIncludes = (url, includes = []) => {
    const params = new URLSearchParams();
    if (includes.length) params.set("includes", includes.join(","));
    return url + (params.size ? "?" + params : "");
};
