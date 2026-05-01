const AUTH_KEY  = 'calcol_sesion';
const TOKEN_KEY = 'calcol_token';

function getSession() {
    return (
        JSON.parse(sessionStorage.getItem(AUTH_KEY)) ||
        JSON.parse(localStorage.getItem(AUTH_KEY)) ||
        null
    );
}

function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) ||
           localStorage.getItem(TOKEN_KEY)   ||
           null;
}

function setSession(data) {
    const usuario = data.usuario || data;
    const token   = data.token   || null;

    const json = JSON.stringify(usuario);
    sessionStorage.setItem(AUTH_KEY, json);
    localStorage.setItem(AUTH_KEY, json);

    if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_KEY, token);
    }
}

function clearSession() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

function requireSession(redirectPath = '../login.html') {
    if (!getSession()) {
        window.location.href = redirectPath;
        return null;
    }
    return getSession();
}