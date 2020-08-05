import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Select from "react-select";
import { FirebaseContext } from "../firebase";

const useParBilletera = (stateInicial) => {
  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([]);
  const [pholder, setPholder] = useState("Cargando...");

  const { usuario, firebase } = useContext(FirebaseContext);

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerBilletera = () => {
        firebase.db
          .collection("billetera")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshot);
      };

      obtenerBilletera();
    }
  }, [usuario]);

  function manejarSnapshot(snapshot) {
    const result = snapshot.docs.map((doc) => {
      return {
        value: doc.id,
        label: doc.data().sigla,
        id_API: doc.data().id_API,
        valorcompra: doc.data().valorcompra,
        cantidad: doc.data().cantidad,
      };
    });
    setOpciones(result);
    if (result.length == 0)
      setMensaje(
        "No hay monedas en la Billetera. Por favor diríjase a Cargar Moneda"
      );
  }

  const SelectPar = () => (
    <div
      css={css`
        flex: 1;
      `}
    >
      <Select
        options={opciones}
        onChange={(e) => actualizarState(e)}
        value={state}
        placeholder="Seleccione un par..."
      />
    </div>
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectPar, actualizarState];
};

export default useParBilletera;
