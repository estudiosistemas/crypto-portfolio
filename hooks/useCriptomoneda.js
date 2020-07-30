import React, { Fragment, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Select from "react-select";
import axios from "axios";

const useCriptomoneda = (stateInicial) => {
  // console.log(opciones);

  // State de nuestro custom hook
  const [state, actualizarState] = useState(stateInicial);
  const [opciones, setOpciones] = useState([]);

  // Ejecutar llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD";

      axios
        .get(url)
        .then((res) => {
          const lista = res.data.Data.map((moneda) => ({
            value: moneda.CoinInfo.Name,
            label: moneda.CoinInfo.FullName,
          }));

          setOpciones(lista);
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

export default useCriptomoneda;
