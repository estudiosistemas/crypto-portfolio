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
  width: 30px;
  height: 30px;
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
      <td>
        <Logo src={logo} alt="Img" />
      </td>
      <td>
        {sigla} {nombre}
      </td>
      <td>
        <NumberFormat
          value={valor}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td>
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
      <td>
        <NumberFormat
          value={valoralto24hs}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={4}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td>
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
