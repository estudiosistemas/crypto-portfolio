import React, { Fragment, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Select from "react-select";
import axios from "axios";

const useCriptomonedaCG = (stateInicial) => {
  // console.log(opciones);

  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([]);
  const [pholder, setPholder] = useState("Cargando...");

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url = "https://api.coingecko.com/api/v3/coins/list";

      axios
        .get(url)
        .then((res) => {
          const lista = res.data.map((moneda) => ({
            value: moneda.id,
            symbol: moneda.symbol.toUpperCase(),
            name: moneda.name,
            label: `(${moneda.symbol.toUpperCase()}) ${moneda.name}`,
          }));

          setOpciones(lista);
          setPholder("Seleccione una criptomoneda...");
        })
        .catch((err) => console.log(err));
    };
    consultarAPI();
  }, []);

  const SelectCripto = () => (
    <div
      css={css`
        flex: 1;
      `}
    >
      <Select
        noOptionsMessage={() => "Cargando..."}
        options={opciones}
        onChange={(e) => actualizarState(e)}
        value={state}
        placeholder="Seleccione una criptomoneda..."
      />
    </div>
  );

  // Retornar state, interfaz y fn que modifica el state
  return [state, SelectCripto, actualizarState];
};

export default useCriptomonedaCG;
