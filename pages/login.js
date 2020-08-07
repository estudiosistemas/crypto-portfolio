import React, { useState } from "react";
import { css } from "@emotion/core";
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
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INICIAL = {
  email: "",
  password: "",
};

const Login = () => {
  const [error, setError] = useState(false);

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push("/billetera");
    } catch (error) {
      console.error("Hubo un error al autenticar el usuario ", error.message);
      setError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Iniciar Sesión</Titulo>
            <Formulario noValidate>
              <Campo>
                {/* <label htmlFor="email">Email</label> */}
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
                  Iniciar Sesión
                </Button>
              </Campo>
            </Formulario>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
