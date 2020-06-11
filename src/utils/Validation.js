export function validarEmail(email){
    // eslint-disable-next-line no-useless-escape
    var regex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    return regex.test(String(email).toLowerCase());
}