import React, { useEffect, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import Layout from "../../components/layout-responsive/Layout";

import Error404 from "../../components/layout/404";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
  Titulo,
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

  const { id_API, nombre, sigla, cantidad, valorcompra, cotizacion } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function editarMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj moneda
    const monedaUpdated = {
      id_API,
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
            id_API: moneda.data().id_API,
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
      <div className="listado-productos">
        <div className="contenedor">
          <Titulo>Editar Moneda</Titulo>
          <Formulario noValidate>
            <Campo>
              <label htmlFor="sigla">Sigla</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.sigla && true}
                id="sigla"
                name="sigla"
                value={sigla}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.sigla}
                variant="outlined"
                size="small"
              />
            </Campo>

            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.nombre && true}
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.nombre}
                variant="outlined"
                size="small"
              />
            </Campo>
            <Campo>
              <label htmlFor="cantidad">Cantidad</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.cantidad && true}
                id="cantidad"
                name="cantidad"
                value={cantidad}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.cantidad}
                variant="outlined"
                size="small"
                type="number"
              />
            </Campo>

            <Campo>
              <label htmlFor="valorcompra">Valor Compra</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.valorcompra && true}
                id="valorcompra"
                name="valorcompra"
                value={valorcompra}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.valorcompra}
                variant="outlined"
                size="small"
                type="number"
              />
            </Campo>
            <Campo>
              <label htmlFor="cotizacion">Cotización</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.cotizacion && true}
                id="cotizacion"
                name="cotizacion"
                value={cotizacion}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.cotizacion}
                variant="outlined"
                size="small"
                type="number"
              />
            </Campo>
            {error && (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            )}
            <Campo>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                Guardar Cambios
              </Button>
            </Campo>
          </Formulario>
        </div>
      </div>
    </Layout>
  );
};

export default Moneda;
