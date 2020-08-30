import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import Layout from "../components/layout-responsive/Layout";
import { css } from "@emotion/core";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
  Titulo,
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
  exchange: "",
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

  const {
    id_API,
    nombre,
    sigla,
    cantidad,
    valorcompra,
    cotiza,
    exchange,
  } = valores;

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
      exchange,
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
      exchange,
    };
    //console.log(miValor);
    setValores(miValor);
  }, [criptomoneda]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Cargar Moneda</Titulo>
            <Formulario noValidate>
              <Campo>
                <label>Criptomoneda</label>
                <SelectCripto />
              </Campo>
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
                <label htmlFor="cotiza">Cotización</label>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.cotiza && true}
                  id="cotiza"
                  name="cotiza"
                  value={cotiza}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.cotiza}
                  variant="outlined"
                  size="small"
                  type="number"
                />
              </Campo>
              <Campo>
                <label htmlFor="exchange">Exchange/Wallet</label>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.exchange && true}
                  id="exchange"
                  name="exchange"
                  value={exchange}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.exchange}
                  variant="outlined"
                  size="small"
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
                  Cargar Moneda
                </Button>
              </Campo>
            </Formulario>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default nuevaMoneda;
