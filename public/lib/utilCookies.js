var cookieMaxAge = 365 * 24 * 60 * 60 * 1000;

function setCookie(cname, cvalue) {
    if (!cvalue) {
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } else {
        var d = new Date();
        d.setTime(d.getTime() + cookieMaxAge);
        var expires = "expires=" + d.toUTCString();
        document.cookie = "wolforce." + cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function getCookie(cname) {
    var name = "wolforce." + cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

if (!getCookie("agreement")) {
    alert("By clicking OK and using this website you agree to our use of cookies to deliver a better website and gaming experience.");
    setCookie("agreement", true);
}