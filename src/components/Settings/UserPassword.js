import React, { useState } from 'react';
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserPassword(props){
    const { user, setShowModal, setTitleModal, setContentModal } = props;
    const onEdit = ()=>{
        setTitleModal("Actualizar Password");
        setContentModal(<ChangeDisplayPassword setShowModal={setShowModal} />)
        setShowModal(true);
    }

    return(
        <div className="user-password">
            <h3>Contraseña:  *** *** *** ***</h3>
            <Button circular onClick={onEdit}>
                Actualizar
            </Button>
        </div>
    )
}

function ChangeDisplayPassword (props){
    const { setShowModal} = props
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState(defaultPassword());
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmit = ()=>{
        if(!formData.currentPassword || !formData.newPassword || !formData.repeatPassword){
            toast.warning("Ingrese todos campos requeridos")
        }else if(formData.currentPassword === formData.newPassword){
            toast.warning("La nueva contraseña no puede ser igual que el actual")
        }else if(formData.newPassword !== formData.repeatPassword){
            toast.warning("Las nuevas contraseñas no son iguales")
        }else if(formData.newPassword.length<6){
            toast.warning("La contraseña tiene que tener como minimo 6 caracteres")
        }else{
            setIsLoading(true)
            reauthenticate(formData.currentPassword).then(()=>{
                const currentUser = firebase.auth().currentUser;
                currentUser.updatePassword(formData.newPassword).then(()=>{
                    toast.success("La contraseña a sido cambiada");
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                }).then((err)=>{
                    alertErrors(err?.code);
                    setIsLoading(false)
                })
            }).catch(err=>{
                toast.error(alertErrors(err?.code))
                setIsLoading(false)
            })
        }
    }
    return(
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input
                    placeholder ="Contraseña Actual"
                    type={!showPass?"password":"text"}
                    onChange={e=>setFormData({...formData,currentPassword:e.target.value})}
                    icon={ <Icon name={!showPass?"eye":"eye slash outline"} link onClick={()=>setShowPass(!showPass)} /> }
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder ="Nueva contraseña"
                    type={!showPass?"password":"text"}
                    onChange={e=>setFormData({...formData, newPassword:e.target.value})}
                    icon={ <Icon name={!showPass?"eye":"eye slash outline"} link onClick={()=>setShowPass(!showPass)} /> }
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="Confirmar contraseña"
                    type={!showPass?"password":"text"}
                    onChange={e=>setFormData({...formData, repeatPassword: e.target.value})}
                    icon={ <Icon name={!showPass?"eye":"eye slash outline"} link onClick={()=>setShowPass(!showPass)} /> }
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Actualizar
            </Button>
        </Form>
    )
}
function defaultPassword(){
    return(
        {
            currentPassword: "",
            newPassword: "",
            repeatPassword: ""
        }
    )
}