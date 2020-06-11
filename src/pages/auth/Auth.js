import React, {useState} from 'react';
import AuthOption from '../../components/Auth/AuthOption';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import BackgroundAuth from '../../assets/jpg/backgroundAuth.jpg';
import LogoNameWhite from '../../assets/png/logo-name-white.png';
import "./Auth.scss";

export default function Auth(){
    const [selectedForm, setSelectedForm] = useState(null);
    const handlerForm = ()=>{
        switch(selectedForm){
            case "login":
                return <LoginForm setSelectedForm={setSelectedForm} />;
            case "register":
                return <RegisterForm setSelectedForm={setSelectedForm} />;
            default:
                return <AuthOption setSelectedForm={setSelectedForm} />;
        }
    }
    return(
        <div className="auth"style={{backgroundImage: `url(${BackgroundAuth})`}} >
            <div className="auth__dark" />
            <div className="auth__box">
                <div className="auth__box-logo">
                    <img src={LogoNameWhite} alt="soundfy" />
                </div>
                {handlerForm()};
            </div>
        </div>
    )
}