import React, { useState } from "react";
import Router from "next/router";
import Layout from "../components/layout-responsive/Layout";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
  Titulo,
} from "../components/ui/Formulario";

import firebase from "../firebase";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

export default function CrearCuenta() {
  const [error, setError] = useState(false);

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/billetera");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Crear Cuenta</Titulo>
            <Formulario noValidate>
              <Campo>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.nombre && true}
                  label="Nombre"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.nombre}
                  size="small"
                />{" "}
              </Campo>
              <Campo>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.email && true}
                  label="Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.email}
                  size="small"
                />
              </Campo>

              <Campo>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.password && true}
                  type="password"
                  label="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.password}
                  autoComplete="current-password"
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
                  Crear Cuenta
                </Button>
              </Campo>
            </Formulario>
          </div>
        </div>
      </Layout>
    </div>
  );
}
