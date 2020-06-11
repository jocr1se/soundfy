import React, { useState, useCallback } from "react";
import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import firebase from "../../utils/Firebase";
import "firebase/storage";
import "firebase/auth";

import NoAvatar from "../../assets/png/user.png";

export default function UploadAvatar(props) {
  const { user, setReloadApp } = props;
  let blob = "";
  //console.log(props);
  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    blob = URL.createObjectURL(file);
    setAvatarUrl(blob);
    upLoadImage(file).then(() => {
      updateUserAvatar();
    });
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,

    onDrop,
  });
  const upLoadImage = (file) => {
    const ref = firebase
      .storage()
      .ref()
      .child("avatars/" + user.uid);
    return ref.put(file);
  };
  const updateUserAvatar = () => {
    firebase
      .storage()
      .ref("avatars/" + user.uid)
      .getDownloadURL()
      .then(async res => {
        await firebase.auth().currentUser.updateProfile({photoURL : res});
        setReloadApp(prevState=>!prevState);
      }).catch(()=>{
        toast.error("Error al actualizar el avatar");
      });
  };

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatarUrl ? avatarUrl : NoAvatar} />
      )}
    </div>
  );
}
