import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import NumberFormat from "react-number-format";

const CeldaNumero = styled.div`
  text-align: right;
`;

const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;

const Logo = styled.img`
  width: 25px;
  height: 25px;
`;

const IndexListadoMonedas = ({ moneda }) => {
  const {
    id,
    logo,
    sigla,
    nombre,
    valor,
    valoralto24hs,
    valorbajo24hs,
    cambio24hs,
    cambioporc24hs,
  } = moneda;

  return (
    <tr>
      <td data-th="Logo">
        <Logo src={logo} alt="Img" />
      </td>
      <td data-th="Moneda">
        {sigla} {nombre}
      </td>
      <td data-th="Ultimo Precio">
        <NumberFormat
          value={valor}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Cambio 24 hs.">
        <NumberFormat
          value={cambioporc24hs}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          suffix={" %"}
          renderText={(value) =>
            cambioporc24hs > 0 || cambioporc24hs == 0 ? (
              <CeldaPosicion positivo>{value}</CeldaPosicion>
            ) : (
              <CeldaPosicion>{value}</CeldaPosicion>
            )
          }
        />
      </td>
      <td data-th="Máximo 24 hs.">
        <NumberFormat
          value={valoralto24hs}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Mínimo 24 hs.">
        <NumberFormat
          value={valorbajo24hs}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
    </tr>
  );
};

export default IndexListadoMonedas;
