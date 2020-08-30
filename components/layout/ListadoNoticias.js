import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import { CeldaNumero } from "../ui/Tabla";
import Link from "next/link";
import { css } from "@emotion/core";

const ListadoiNoticias = () => {
  return (
    <tr>
      <td data-th="Par">
        <Link href="/editar-alarma[id]" as={`/editar-alarma/${id}`}>
          <a
            css={css`
              text-decoration: none;
              color: blue;
              cursor: pointer;
            `}
          >
            {sigla}/{par.toUpperCase()}{" "}
          </a>
        </Link>
      </td>
      <td data-th="Precio Actual">
        <NumberFormat
          value={preciopar}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Limit">
        <NumberFormat
          value={precioalarma}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => (
            <CeldaNumero>
              <div>&uarr; {value}</div>
            </CeldaNumero>
          )}
        />
      </td>
      <td data-th="StopLoss">
        <NumberFormat
          value={preciostop}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => (
            <CeldaNumero>
              <div>&darr; {value} </div>
            </CeldaNumero>
          )}
        />
      </td>
      <td data-th="Acciones">
        {usuario && (
          <button onClick={toogleActivada}>
            {activada ? "Cancelar Alarma" : "Alarma Activa"}
          </button>
        )}{" "}
        <button onClick={borrarAlarma}>Borrar</button>
      </td>
    </tr>
  );
};

export default ListadoiNoticias;
