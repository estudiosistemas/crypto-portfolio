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
import useParCriptomoneda from "../hooks/useParCriptomoneda";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearAlarma from "../validacion/validarCrearAlarma";

// const comparaOptions = [
//   { value: "mayor", label: "Mayor o Igual que" },
//   { value: "menor", label: "Menor o Igual que" },
// ];

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  monedapar: "",
  //compara: [comparaOptions[0].value],
  precioalarma: 0,
  preciostop: 0,
};

const nuevaAlarma = () => {
  const [error, setError] = useState(false);

  // utilizar useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomonedaCG({});
  const [par, SelectPar] = useParCriptomoneda({});

  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
    setValores,
  } = useValidacion(STATE_INICIAL, validarCrearAlarma, crearAlarma);

  const {
    id_API,
    nombre,
    sigla,
    monedapar,
    //compara,
    precioalarma,
    preciostop,
  } = valores;

  const router = useRouter();

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearAlarma() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj alarma
    const alarma = {
      usuario: usuario.uid,
      id_API,
      sigla,
      nombre,
      par: monedapar,
      precioalarma,
      preciostop,
      //compara,
      creado: Date.now(),
    };

    // inserto en DB
    firebase.db.collection("alarmas").add(alarma);
    router.push("/billetera");
  }

  useEffect(() => {
    //console.log(criptomoneda);
    const miValor = {
      id_API: criptomoneda.value,
      sigla: criptomoneda.symbol,
      nombre: criptomoneda.name,
      //compara,
      precioalarma,
      preciostop,
    };
    setValores(miValor);
  }, [criptomoneda]);

  useEffect(() => {
    //console.log(criptomoneda);
    const miValor = {
      id_API,
      sigla,
      nombre,
      monedapar: par.value,
      //compara,
      precioalarma,
      preciostop,
    };
    setValores(miValor);
  }, [par]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Crear Alarma</Titulo>
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
                <label>Par</label>
                <SelectPar />
              </Campo>
              {errores.monedapar && (
                <Alert variant="filled" severity="error">
                  {errores.monedapar}
                </Alert>
              )}

              <input
                type="text"
                id="monedapar"
                placeholder="Par Sigla criptomoneda"
                name="monedapar"
                value={monedapar}
                onChange={handleChange}
                onBlur={handleBlur}
                hidden
              />
              <Campo>
                <label htmlFor="precioalarma">Precio Limit</label>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.precioalarma && true}
                  id="precioalarma"
                  name="precioalarma"
                  value={precioalarma}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.precioalarma}
                  variant="outlined"
                  size="small"
                  type="number"
                />
              </Campo>
              <Campo>
                <label htmlFor="preciostop">Precio StopLoss</label>
                <TextField
                  style={{ flex: "1" }}
                  error={errores.preciostop && true}
                  id="preciostop"
                  name="preciostop"
                  value={preciostop}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errores.preciostop}
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
                  Crear Alarma
                </Button>
              </Campo>
            </Formulario>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default nuevaAlarma;
