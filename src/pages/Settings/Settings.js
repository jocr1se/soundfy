import React, { useState } from "react";
import UploadAvatar from "../../components/Settings/UploadAvatar";
import UserName from "../../components/Settings/UserName";
import BasicModal from "../../components/Modal/BasicModal";
import UpdateEmail from "../../components/Settings/UpdateEmail";
import UserPassword from "../../components/Settings/UserPassword";

import "./Settings.scss";

export default function Settings(props) {
  const { user, setReloadApp } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [contentModal, setContentModal] = useState(null);

  return (
    <div className="settings">
      <h1> Configuraciòn</h1>
      <div className="avatar-home">
        <UploadAvatar user={user} setReloadApp={setReloadApp} />
        <UserName
          user ={user}
          setShowModal = {setShowModal}
          setTitleModal={setTitleModal}
          setContentModal={setContentModal}
          setReloadApp = {setReloadApp}
        />
        
      </div>
      <UpdateEmail 
        user={user}
        setShowModal={setShowModal}
        setTitleModal={setTitleModal}
        setContentModal={setContentModal}
      />
      <UserPassword
        user={user} 
        setShowModal={setShowModal}
        setTitleModal={setTitleModal}
        setContentModal={setContentModal}
      />
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
          {contentModal}
      </BasicModal>
    </div>
  );
}
