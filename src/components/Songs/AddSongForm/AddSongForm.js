import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Dropdown, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [file, setFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState(defaultValue());
  const [isLoading, setIsLoading] = useState(false);

  const uploadSong = (fileName) => {
    const ref = firebase
      .storage()
      .ref()
      .child("songs/" + fileName);

    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning("Tiene que llenar los campos requeridos");
    } else if (!file) {
      toast.warning("No ha subido ningun archivo");
    } else {
      setIsLoading(true);
      let fileName = uuidv4();
      uploadSong(fileName)
        .then(() => {
          db.collection("songs")
            .add({ name: formData.name, album: formData.album, song: fileName })
            .then(() => {
              toast.success("Canción subida correctamente");
              resetValues();
              setIsLoading(false);
              setShowModal(false)
            }).catch(()=>{
              toast.error("Ocurrio un eror a subir la canción")
              setIsLoading(false);
              setShowModal(false);
            });
        })
        .catch(() => {
          toast.error("Ocurrio un error al subir el archivo");
        });
    }
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];

    setFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,

    onDrop,
  });

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((res) => {
        const arrayAlbum = [];
        for (let i = 0; i < res.docs.length; i++) {
          const data = res.docs[i].data();
          arrayAlbum.push({
            key: res.docs[i].id,
            value: res.docs[i].id,
            text: data.name,
          });
        }

        setAlbums(arrayAlbum);
      });
  }, []);
  const resetValues=()=>{
    setFormData(defaultValue());
    setFile(null);
  }

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la canción"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Dropdown
          placeholder="La cancion pertenece a"
          fluid
          search
          selection
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastre su canción o haz click <span>AQUI</span>
            </p>
            {file && (
              <p>
                canción subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir canción
      </Button>
    </Form>
  );
}
function defaultValue() {
  return {
    name: "",
    album: "",
  };
}
