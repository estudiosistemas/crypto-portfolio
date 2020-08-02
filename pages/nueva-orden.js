import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/layout/Layout";
import { css } from "@emotion/core";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";

//hook cripto
import useExchange from "../hooks/useExchange";
import useCriptomonedaCG from "../hooks/useCriptomonedaCG";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearOrden from "../validacion/validarCrearOrden";

const STATE_INICIAL = {
  fecha: "",
  par_id_API: "",
  par_sigla: "",
  par_nombre: "",
  precio: 0,
  cantidad: 0,
  comision: 0,
  total: 0,
  totalUSD: 0,
  exchange_id_API: "",
  exchange_nombre: "",
};

const nuevaOrden = () => {
  const [error, setError] = useState(false);

  // utilizar custom hooks
  const [criptomoneda, SelectCripto] = useExchange({});
  const [exchange, SelectExchange] = useExchange({});

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearOrden, crearOrden);

  const {
    par_id_API,
    par_sigla,
    par_nombre,
    precio,
    cantidad,
    comision,
    total,
    totalUSD,
    exchange_id_API,
    exchange_nombre,
  } = valores;

  const router = useRouter();

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function nuevaOrden({ tipo_orden, moneda }) {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj orden
    const orden = {
      tipo: tipo_orden,
      id_moneda: moneda.id,
      exchange_id_API,
      exchange_nombre,
      orden: orden_tipo,
      par_id_API,
      par_sigla,
      par_nombre,
      precio,
      cantidad,
      comision,
      total,
      totalUSD,
    };

    // inserto en DB
    firebase.db.collection("ordenes").add(orden);

    //tengo que modificar los valores de cantidad y valorcompra en monedas

    router.push("/billetera");
  }

  useEffect(() => {
    //console.log(criptomoneda);
    const miValor = {
      ...valores,
      par_id_API: criptomoneda.value,
      par_sigla: criptomoneda.symbol,
      par_nombre: criptomoneda.name,
    };
    setValores(miValor);
  }, [criptomoneda]);

  useEffect(() => {
    const miValor = {
      ...valores,
      exchange_id_API: exchange.value,
      exchange_nombre: exchange.label,
    };
    setValores(miValor);
  }, [exchange]);

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Cargar Orden
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label>Exchange</label>
              <SelectExchange />
            </Campo>
            <Campo>
              <label htmlFor="sigla">Fecha</label>
              <input
                type="text"
                id="fecha"
                placeholder="Fecha Orden"
                name="fecha"
                value={fecha}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.fecha && <Error>{errores.fecha}</Error>}
            <Campo>
              <label>Par</label>
              <SelectCripto />
            </Campo>
            <Campo>
              <label htmlFor="par_sigla">Par Sigla</label>
              <input
                type="text"
                id="par_sigla"
                placeholder="Par"
                name="par_sigla"
                value={par_sigla}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.par_sigla && <Error>{errores.par_sigla}</Error>}
            <Campo>
              <label htmlFor="precio">Precio</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={precio}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.precio && <Error>{errores.precio}</Error>}
            <Campo>
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={cantidad}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.cantidad && <Error>{errores.cantidad}</Error>}
            <Campo>
              <label htmlFor="comision">Comisión</label>
              <input
                type="number"
                id="comision"
                name="comision"
                value={comision}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.comision && <Error>{errores.comision}</Error>}
            <Campo>
              <label htmlFor="total">Total</label>
              <input
                type="number"
                id="total"
                name="total"
                value={total}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.total && <Error>{errores.total}</Error>}
            <Campo>
              <label htmlFor="totalUSD">Total USD</label>
              <input
                type="number"
                id="totalUSD"
                name="totalUSD"
                value={totalUSD}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.totalUSD && <Error>{errores.totalUSD}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Cargar Orden" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default nuevaOrden;
