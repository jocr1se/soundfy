import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";

import  alertErrors  from "../../utils/AlertErrors"
import firebase from "../../utils/Firebase";
import { reauthenticate } from "../../utils/Api"
import "firebase/auth";

export default function UpdateEmail(props) {
  const { user, setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Actualizar Email");
    setContentModal(
      <ChangeDisplayEmailFor email={user.email} setShowModal={setShowModal} />
    );
    setShowModal(true);
  };
  return (
    <div className="update-email">
      <h3>Email : {user.email}</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}
function ChangeDisplayEmailFor(props) {
  const { email, setShowModal } = props;
  const [formData, setFormData] = useState({ email: "", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    
  const onSubmit = () => {
    
    if(!formData.email || formData.email===email){
      toast.warning("El email es el mismo");
      setShowModal(false);
    }else{
      reauthenticate(formData.password).then(()=>{
        setIsLoading(true)
        const currentUser = firebase.auth().currentUser;
        currentUser.updateEmail(formData.email).then(()=>{
          toast.success("Emai actualizado");
          setIsLoading(false);
          setShowModal(false);
          currentUser.sendEmailVerification().then(()=>{
            firebase.auth().signOut();
          })
          
        }).catch(err=>{
          alertErrors(err?.code)
        })
        
        
      }).catch(err=>{
        alertErrors(err.code)
        console.log(err)
      })
    }
    
  };

  return (
    <Form onSubmit={onSubmit} >
      <Form.Field>
        <Input
          defaultValue={email}
          type = "text"
          onChange={e=>setFormData({...formData,email:e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder = "Ingrese su contraseña"
          type = {showPass?"text":"password"}
          onChange={e=>setFormData({...formData,password:e.target.value})}
          icon = {
              <Icon
                name={showPass?"eye slash outline":"eye"}
                link
                onClick={()=>setShowPass(!showPass)}
              />
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar email
      </Button>
    </Form>
  );
}
