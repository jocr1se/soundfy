import React, { useCallback, useState, useEffect } from "react";
import { Form, Input, Button, Dropdown, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import noImage from "../../../assets/png/original.png";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";

import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

export default function AddAlbumForm(props) {
  const { setShowModal } = props;
  const [bannerImage, setBannerImage] = useState(null);
  const [file, setFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValue());

  const uploadImage = (filename) => {
    const ref = firebase
      .storage()
      .ref()
      .child("albums/" + filename);

    return ref.put(file);
  };
  useEffect(() => {
    db.collection("artists")
      .get()
      .then((res) => {
        const arrayArtists = [];
        for (let i = 0; i < res.docs.length; i++) {
          const data = res?.docs[i].data();
          arrayArtists.push({
            key: res.docs[i].id,
            value: res.docs[i].id,
            text: data.name,
          });
        }

        setArtists(arrayArtists);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setBannerImage(URL.createObjectURL(file));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,

    onDrop,
  });
  const onSubmit = () => {
    if (!formData.name || !formData.artist) {
      toast.warning("Ingrese los campos requeridos");
    } else if (!file) {
      toast.warning("Ingrese una imagen para el album");
    } else {
      setIsLoading(true)
      const filename = uuidv4();
      uploadImage(filename)
        .then(() => {
          db.collection("albums")
            .add({ name: formData.name, artist: formData.artist, banner:filename })
            .then(() => {
              toast.success("El album ha sido subido correctamente");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            }).catch((err)=>{
              toast.error("Ocurrió un error al subir el album")
              setIsLoading(false)
              setShowModal(false)
              
            });
        })
        .catch(() => {
          toast.error("Ocurrio un error a subir la imagen");
        });
    }
    
  };
  const resetForm = ()=>{
    setFormData(defaultValue());
    setFile(null);
    setBannerImage(null);
  }
  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar">
          <div
            className="avatar"
            {...getRootProps()}
            style={{ backgroundImage: `url('${bannerImage}')` }}
          />
          <input {...getInputProps()} />
          {!bannerImage && <Image src={noImage} />}
        </Form.Field>
        <Form.Field className="album-inputs">
          <Input
            placeholder="Nombre del album"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="El álbum pertenece a "
            fluid
            search
            selection
            options={artists}
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Crear Album
      </Button>
    </Form>
  );
}
function defaultValue() {
  return {
    name: "",
    artist: "",
  };
}
