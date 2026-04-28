const AUTH_KEY = 'calcol_sesion';

function getSession() {
    return (
        JSON.parse(sessionStorage.getItem(AUTH_KEY)) ||
        JSON.parse(localStorage.getItem(AUTH_KEY)) ||
        null
    );
}

function setSession(data) {
    const json = JSON.stringify(data);
    sessionStorage.setItem(AUTH_KEY, json);
    localStorage.setItem(AUTH_KEY, json);
}

function clearSession() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
}

function requireSession(redirectPath = '../login.html') {
    if (!getSession()) {
        window.location.href = redirectPath;
        return null;
    }
    return getSession();
}