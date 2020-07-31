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
import useCriptomonedaCG from "../hooks/useCriptomonedaCG";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearMoneda from "../validacion/validarCrearMoneda";

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  cantidad: 0,
  valorcompra: 0,
  cotiza: 0,
};

const nuevaMoneda = () => {
  const [error, setError] = useState(false);

  // utilizar useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomonedaCG({});

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearMoneda, crearMoneda);

  const { id_API, nombre, sigla, cantidad, valorcompra, cotiza } = valores;

  const router = useRouter();

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj moneda
    const moneda = {
      usuario: usuario.uid,
      id_API,
      sigla,
      nombre,
      cantidad,
      valorcompra,
      cotizacion: cotiza,
      creado: Date.now(),
      ordenes: [],
    };

    // inserto en DB
    firebase.db.collection("billetera").add(moneda);
    router.push("/billetera");
  }

  useEffect(() => {
    //console.log(criptomoneda);
    const miValor = {
      id_API: criptomoneda.value,
      sigla: criptomoneda.symbol,
      nombre: criptomoneda.name,
      cantidad,
      valorcompra,
      cotiza,
    };
    setValores(miValor);
  }, [criptomoneda]);

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
            Cargar Moneda
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label>Criptomoneda</label>
              <SelectCripto />
            </Campo>
            <Campo>
              <label htmlFor="sigla">Sigla</label>
              <input
                type="text"
                id="sigla"
                placeholder="Sigla cryptomoneda"
                name="sigla"
                value={sigla}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.sigla && <Error>{errores.sigla}</Error>}
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
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
              <label htmlFor="valorcompra">Valor Compra</label>
              <input
                type="number"
                id="valorcompra"
                name="valorcompra"
                value={valorcompra}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.valorcompra && <Error>{errores.valorcompra}</Error>}
            <Campo>
              <label htmlFor="cotiza">Cotización</label>
              <input
                type="number"
                id="cotiza"
                name="cotiza"
                value={cotiza}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.cotiza && <Error>{errores.cotiza}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Cargar Moneda" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default nuevaMoneda;
