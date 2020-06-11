import React from 'react';
import "./AuthOption.scss"

export default function AuthOption(props){
    const {setSelectedForm}=props;
    return(
        <div className="auth-options">
            <h2>Millones de canciones en un solo lugar, Soundfy</h2>
            <button className="btn register" onClick={()=>setSelectedForm("register")}>Registrarse</button>
            <button className="btn login" onClick={()=>setSelectedForm("login")} >Iniciar Sesión</button>
        </div>
    )
}