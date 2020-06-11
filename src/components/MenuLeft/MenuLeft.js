import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../Modal/BasicModal";
import AddArtistForm from "../Artist/AddArtistForm";
import AddAlbumForm from "../Albums/AddAlbumForm";
import AddSongForm from "../Songs/AddSongForm";

import "./MenuLeft.scss";

function MenuLeft(props) {
  const { user, location } = props;
  const [menuActive, setMenuActive] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  const handlerModal = (type) => {
    switch (type) {
      case "artist":
        setShowModal(true);
        setTitleModal("Nuevo Artista");
        setContentModal(<AddArtistForm setShowModal={setShowModal} />);
        break;
      case "song":
        setShowModal(true);
        setTitleModal("Nueva Canción");
        setContentModal(<AddSongForm setShowModal={setShowModal} />);
        break;
      case "album":
        setShowModal(true);
        setTitleModal("Nuevo Album");
        setContentModal(<AddAlbumForm setShowModal={setShowModal} />);
        break;
      default:
        setShowModal(false);
        setTitleModal(null);
        setContentModal(null);
        break;
    }
  };
  useEffect(() => {
    setMenuActive(location.pathname);
  }, [location]);

  useEffect(() => {
    isUserAdmin(user.uid).then((res) => {
      setUserAdmin(res);
    });
  }, [user]);

  const handlerMenu = (e, menu) => {
    setMenuActive(menu.to);
  };
  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Menu.Item
            as={Link}
            to="/"
            name="home"
            active={menuActive === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Inicio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            name="artists"
            active={menuActive === "/artists"}
            onClick={handlerMenu}
          >
            <Icon name="music" /> Artistas
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/albums"
            name="albums"
            active={menuActive === "/albums"}
            onClick={handlerMenu}
          >
            <Icon name="window maximize outline" /> Albumes
          </Menu.Item>
        </div>
        {userAdmin && (
          <div className="footer">
            <Menu.Item>
              <Icon
                name="plus square outline"
                onClick={() => handlerModal("artist")}
              />
              Nuevo Artista
            </Menu.Item>
            <Menu.Item>
              <Icon
                name="plus square outline"
                onClick={() => handlerModal("album")}
              />
              Nuevo Abum
            </Menu.Item>
            <Menu.Item>
              <Icon
                name="plus square outline"
                onClick={() => handlerModal("song")}
              />
              Nueva Canción
            </Menu.Item>
          </div>
        )}
      </Menu>
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}
export default withRouter(MenuLeft);
