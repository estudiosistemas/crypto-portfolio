import React, { useState, useEffect, useRef } from "react";

const IndexListadoMonedas = ({ moneda }) => {
  const {
    id,
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
        {sigla} {nombre}
      </td>
      <td>{valor}</td>
      <td>{cambioporc24hs} %</td>
      <td>{valoralto24hs}</td>
      <td>{valorbajo24hs}</td>
    </tr>
  );
};

export default IndexListadoMonedas;
