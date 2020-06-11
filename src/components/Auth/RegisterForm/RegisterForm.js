import React,{useState} from 'react';
import {Button, Icon, Form, Input} from "semantic-ui-react";
import {toast} from "react-toastify"
import firebase from "../../../utils/Firebase";
import { validarEmail } from "../../../utils/Validation"
import "firebase/auth"
import "./RegisterForm.scss"

function RegisterForm(props){
    const { setSelectedForm }=props;
    const [formData, setformData] = useState(defaultValueForm());
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handlerShowPassword = ()=>{
        setShowPassword(!showPassword);
    }

    const onChange = e=>{
        setformData({
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
        if(!formData.username){
            errors.username=true;
            formOk=false;
        }
        
        setFormError(errors);
        if(formOk){
            setIsLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
                .then(()=>{
                    changeUserName();
                    sendEmailVerification();
                }).catch(()=>{
                    toast.error("Error al registrar usuario")
                }).finally(()=>{
                    setIsLoading(false);
                    setSelectedForm(null);
                })
        }   
    }
    const changeUserName = ()=>{
        firebase
        .auth()
        .currentUser.updateProfile({
            displayName: formData.username
        })
        .catch(()=>{
            toast.error("Ocurrió un error alasignar nombre de usuario")     
        })
    }
    const sendEmailVerification = ()=>{
        firebase.auth().currentUser.sendEmailVerification()
            .then(()=>{
                toast.success("Email enviado, por favor revise su correo")
            })
            .catch(()=>{
                toast.error("Ocurrio un problema al enviar el correo de verificación")
            })
    }
    return(
        <div className="register-form">
            <h1>Empieza a escuchar con una cuenta de Soundfy</h1>
            <Form onSubmit={onSubmit} onChange={onChange} >
                <Form.Field>
                    <Input 
                    type="email" 
                    name="email" 
                    placeholder="Correo electronico"
                    icon="mail outline"
                    
                    error={formError.email}
                    />
                    {
                       formError.email && (
                           <span className="error-text">
                               Por favor, ingrese un correo valido
                           </span>
                       )
                    }
                </Form.Field>
                <Form.Field>
                    <Input 
                    type={showPassword? "text":"password"} 
                    name="password" 
                    placeholder="Ingrese una contraseña"
                    icon={
                        showPassword?(
                            <Icon name="eye slash outline" link onClick={handlerShowPassword} />
                        ) :(
                            <Icon name="eye" link onClick={handlerShowPassword} />
                        )
                    }
                    error={formError.password}
                    />
                    {
                        formError.password && (
                            <span className="error-text">
                                La cantraseña debe de tener 6 digitos como minimo
                            </span>
                        )
                    }
                </Form.Field>
                <Form.Field>
                    <Input 
                    type="text" 
                    name="username" 
                    placeholder="Nombre de usuario"
                    icon="user circle outline"
                    error={formError.username}
                    />
                    {
                        formError.username && (
                            <span className="error-text">
                                Escriba un nombre de usuario
                            </span>
                        )
                    }
                </Form.Field>
                <Button type="submit" loading={isLoading}>Continuar</Button>
            </Form>
            <div className="register-form__options">
                <p onClick={()=>setSelectedForm(null)}>Volver</p>
                <p>
                    Ya tienes Soundfy?><span onClick={()=>setSelectedForm("login")}>Iniciar sesión</span>
                </p>
            </div>
        </div>
    )
}
export default RegisterForm;

function defaultValueForm(){
    return {
        email : "",
        password : "",
        username : ""
    }
}