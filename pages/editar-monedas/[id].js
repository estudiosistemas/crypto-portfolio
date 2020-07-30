import React, { useEffect, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";

import Layout from "../../components/layout/Layout";
import Error404 from "../../components/layout/404";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../../components/ui/Formulario";
// validaciones
import useValidacion from "../../hooks/useValidacion";
import validarCrearMoneda from "../../validacion/validarCrearMoneda";

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  cantidad: 0,
  valorcompra: 0,
  cotizacion: 0,
};

const Moneda = () => {
  const [moneda, setMoneda] = useState({});
  const [errorBuscar, setErrorBuscar] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearMoneda, editarMoneda);

  const { nombre, sigla, cantidad, valorcompra, cotizacion } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function editarMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj moneda
    const monedaUpdated = {
      sigla,
      nombre,
      cantidad,
      valorcompra,
      cotizacion,
    };

    // inserto en DB
    firebase.db.collection("billetera").doc(id).update(monedaUpdated);
    router.push("/billetera");
  }

  useEffect(() => {
    if (id) {
      const obtenerMoneda = async () => {
        const monedaQuery = await firebase.db.collection("billetera").doc(id);
        const moneda = await monedaQuery.get();
        if (moneda.exists) {
          setMoneda(moneda.data());
          setValores({
            nombre: moneda.data().nombre,
            sigla: moneda.data().sigla,
            cantidad: moneda.data().cantidad,
            valorcompra: moneda.data().valorcompra,
            cotizacion: moneda.data().cotizacion,
          });
        } else {
          setErrorBuscar(true);
        }
      };
      obtenerMoneda();
    }
  }, [id]);

  return (
    <Layout>
      {errorBuscar && <Error404 />}
      <Link href="/billetera">
        <a>Volver</a>
      </Link>

      <h1
        css={css`
          text-align: center;
          margin-top: 5rem;
        `}
      >
        Editar Moneda
      </h1>
      <Formulario onSubmit={handleSubmit} noValidate>
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
            autoFocus
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
          <label htmlFor="cotizacion">Cotización</label>
          <input
            type="number"
            id="cotizacion"
            name="cotizacion"
            value={cotizacion}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.cotizacion && <Error>{errores.cotizacion}</Error>}
        {error && <Error>{error}</Error>}
        <InputSubmit type="submit" value="Guardar Cambios" />
      </Formulario>
    </Layout>
  );
};

export default Moneda;
