import React, { Fragment, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Select from "react-select";
//import axios from "axios";

const useParCriptomoneda = (stateInicial) => {
  // console.log(opciones);

  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([
    { value: "usd", label: "USD" },
    { value: "btc", label: "BTC" },
    { value: "eth", label: "ETH" },
    { value: "bnb", label: "BNB" },
  ]);
  //const [pholder, setPholder] = useState("Cargando...");

  // Ejecutar llamado a la API
  // useEffect(() => {
  //   const consultarAPI = async () => {
  //     const url =
  //       "https://api.coingecko.com/api/v3/simple/supported_vs_currencies";

  //     axios
  //       .get(url)
  //       .then((res) => {
  //         const lista = res.data.map((moneda) => ({
  //           value: moneda,
  //           label: moneda.toUpperCase(),
  //         }));

  //         setOpciones(lista);
  //         setPholder("Seleccione una moneda...");
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   consultarAPI();
  // }, []);

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

export default useParCriptomoneda;
