import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";

const CeldaNumero = styled.div`
  text-align: right;
`;

const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;

const ListadoMonedas = ({ moneda }) => {
  const {
    id,
    sigla,
    nombre,
    cantidad,
    valorcompra,
    cotizacion,
    valores,
  } = moneda;
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  const borrarMoneda = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      await firebase.db.collection("billetera").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr>
      <td data-th="Moneda">
        <Link href="/editar-monedas[id]" as={`/editar-monedas/${id}`}>
          <a
            css={css`
              text-decoration: none;
              color: blue;
              cursor: pointer;
            `}
          >
            {sigla} {nombre}
          </a>
        </Link>
      </td>
      <td data-th="Cantidad">
        <NumberFormat
          value={cantidad}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Cotización USD">
        <NumberFormat
          value={valores.cotizacionUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Valor Compra">
        <NumberFormat
          value={valorcompra}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Valor Actual">
        <NumberFormat
          value={valores.totalUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Posición">
        <NumberFormat
          value={valores.posicionUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          suffix={" %"}
          renderText={(value) =>
            valores.posicionUSDT > 0 || valores.posicionUSDT == 0 ? (
              <CeldaPosicion positivo>{value}</CeldaPosicion>
            ) : (
              <CeldaPosicion>{value}</CeldaPosicion>
            )
          }
        />
      </td>
      <td data-th="Acciones">
        {usuario && (
          <>
            <Link href="/comprar-moneda[id]" as={`/comprar-moneda/${id}`}>
              <a
                css={css`
                  text-decoration: none;
                  color: blue;
                  cursor: pointer;
                  margin-right: 1rem;
                `}
              >
                Comprar
              </a>
            </Link>
            <Link href="/vender-moneda[id]" as={`/vender-moneda/${id}`}>
              <a
                css={css`
                  text-decoration: none;
                  color: blue;
                  cursor: pointer;
                  margin-right: 1rem;
                `}
              >
                Vender
              </a>
            </Link>
            <button onClick={borrarMoneda}>Borrar</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ListadoMonedas;
