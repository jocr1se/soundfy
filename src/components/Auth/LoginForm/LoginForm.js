import React,{useState} from 'react';
import {Button, Icon, Form, Input} from "semantic-ui-react"
import { toast } from "react-toastify";
import { validarEmail } from "../../../utils/Validation";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "./LoginForm.scss";


export default function LoginForm(props) {
    const { setSelectedForm } = props;
    const [formData, setFormData] = useState(defaultValueForm());
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userActive, setUserActive] = useState(true);
    const [user, setUser] = useState(null);

    const handlerPassword = ()=>{
        setShowPassword(!showPassword)
    }
    const onChange = e=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = ()=>{
        setFormError({});
        let errors = {};
        let formOk = true;
        if(!validarEmail(formData.email)){
            errors.email = true;
            formOk = false;
        }
        if(formData.password.length<6){
            errors.password=true;
            formOk = false;
        }
        setFormError(errors);
        if(formOk){
            setIsLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
                .then(response=>{
                    setUser(response.user)
                    setUserActive(response.user.emailVerified)
                }).catch(err=>{
                   handlerErrors(err.code)
                }).finally(()=>{
                    setIsLoading(false)
                })
        }
    }
    return (
        <div className="login-form">
            <h1>Música para todos</h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Ingrese su correo electronico"
                        icon="mail outline"
                        error = {formError.email}
                    />
                    {
                        formError.email && (
                            <span className="error-text">
                                Introduce un correo electronico válido
                            </span>
                        )
                    }
                </Form.Field>
                <Form.Field>
                    <Input 
                        type={showPassword?"text":"password"}
                        name="password"
                        placeholder="Ingrese su contraseña"
                        icon={
                            showPassword?(
                                <Icon name="eye slash outline" link onClick={handlerPassword} />
                            ):(
                                <Icon name="eye" link onClick={handlerPassword} />
                            )
                        }
                        error={formError.password}
                    />
                    {
                        formError.password && (
                            <span className="error-text">
                                Ingresa una contraseña valida
                            </span>
                        )
                    }
                </Form.Field>
                <Button type="submit" loading={isLoading}>Iniciar Sesión</Button>
            </Form>
            
            {!userActive && (
                <ButtonResetSendEmailVerification
                    user={user}
                    setIsLoading={setIsLoading}
                    setUserActive={setUserActive}
                />
            )}
            <div className="login-form__options">
                <p onClick={()=>{
                    setSelectedForm(null)
                }}>
                    Volver
                </p>
                <p>
                    ¿No tienes una cuenta? 
                    <span onClick={()=>{
                        setSelectedForm("register")
                    }}>Regístrate</span>
                </p>
            </div>
        </div>
    )
    function ButtonResetSendEmailVerification(props){
        const { user, setIsLoading, setUserActive } = props;
        const resendVerificationEmail=()=>{
            
            user.sendEmailVerification()
                .then(()=>{
                    toast.success("Se ha enviado el email de verificacion")
                }).catch((err)=>{
                    console.log(err)
                    handlerErrors(err.code);
                }).finally(()=>{
                    setIsLoading(false);
                    setUserActive(true);
                })
        }
        return(
            <div className="resend-email-verification">
                <p>
                    Si no has recibido el email de verificacion puedes hacer click 
                    <span onClick={resendVerificationEmail}>AQUI</span>
                </p>
            </div>
        )
    }
    function handlerErrors(code){
        switch(code){
            case "auth/wrong-password":
                toast.warning("El usuario o la contraseña es incorrecto")
                break;
            case "auth/too-many-requests":
                toast.warning("Has enviado demasiadas solicitudes de reenvio")
                break;
            case"auth/user-not-found":
                toast.warning("Tu nombre de usuario o contraseña son incorrectos")
                break;
            default:
                break;
        }
    }
    function defaultValueForm(){
        return{
            email:"",
            password:""
        }
    }
}
