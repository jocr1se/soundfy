import { toast } from "react-toastify";

export default function alertErrors(type){
    switch (type) {
        case "auth/wrong-password":
            toast.error("La contraseña ingresada es incorrecta");
            break;
        case "auth/email-already-in-use":
            toast.error("El email ingresado ya existe");
            break;
        default:
            toast.warning("Error de servicio");
            break;
    }
}