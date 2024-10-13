export const createService = (name, type, host, disabled) => postProp("/services", { name, type, host, disabled }, "id");
export const getServices = () => getProp("/services", "services");
export const getService = (serviceId, includes = []) => get(withIncludes("/services/" + serviceId, includes));

export const createPage = (shortName, title, url, logoUrl, domain = null) => postProp("/pages", { shortName, title, url, logoUrl, domain }, "id");
export const getPages = () => getProp("/pages", "pages");
export const getPage = (pageId, includes) => get(withIncludes("/pages/" + pageId, includes));

export const getPageServices = (pageId, includes) => getProp(withIncludes("/pages/" + pageId + "/services", includes), "services");
export const addPageService = (pageId, serviceId) => postNoContent("/pages/" + pageId + "/services/" + serviceId);
export const removePageService = (pageId, serviceId) => deleteNoContent("/pages/" + pageId + "/services/" + serviceId);

export const getCheckers = () => getProp("/checkers", "checkers");
export const getChecker = (checkerId, includes) => get(withIncludes("/checkers/" + checkerId, includes));

export const getCheckerServices = (checkerId, includes) => getProp(withIncludes("/checkers/" + checkerId + "/services", includes), "services");
export const addCheckerService = (checkerId, serviceId) => postNoContent("/checkers/" + checkerId + "/services/" + serviceId);
export const removeCheckerService = (checkerId, serviceId) => deleteNoContent("/checkers/" + checkerId + "/services/" + serviceId);

const request = (url, method, body = null, auth = true) => new Promise((resolve, reject) => {
    fetch(process.env.REACT_APP_API_HOST + url, {
        method,
        headers: {
            ...(auth ? { "Authorization": process.env.REACT_APP_API_KEY } : {}),
            ...(body ? { "Content-Type": "application/json" } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    }).then((res) => {
        if (res.ok) resolve(res);
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error.toString()));
    }).catch((error) => reject(error.toString()));
});

const requestJson = (...args) => new Promise((resolve, reject) => {
    request(...args).then((res) => {
        res.json().then((res) => { delete res.code; resolve(res); }).catch((error) => reject(error.toString()));
    }).catch((error) => reject(error));
});

const get = (url) => requestJson(url, "GET");
const getProp = (url, name) => requestJson(url, "GET").then((res) => res[name]);

//const post = (url, body) => requestJson(url, "POST", body);
const postProp = (url, body, name) => requestJson(url, "POST", body).then((res) => res[name]);
const postNoContent = (url, body) => request(url, "POST", body).then(() => undefined);

const deleteNoContent = (url) => request(url, "DELETE").then(() => undefined);

const withIncludes = (url, includes = []) => {
    const params = new URLSearchParams();
    if (includes.length) params.set("includes", includes.join(","));
    return url + (params.size ? "?" + params : "");
};
