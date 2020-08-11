import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

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

import { FirebaseContext } from "../../firebase";

//hook cripto
import useParCriptomoneda from "../../hooks/useParCriptomoneda";

// validaciones
import useValidacion from "../../hooks/useValidacion";
import validarCrearAlarma from "../../validacion/validarCrearAlarma";

const STATE_INICIAL = {
  nombre: "",
  sigla: "",
  monedapar: "",
  precioalarma: 0,
  preciostop: 0,
};

const editarAlarma = () => {
  const [error, setError] = useState(false);
  const [alarma, setAlarma] = useState({});
  const [errorBuscar, setErrorBuscar] = useState(false);

  // utilizar useCriptomoneda
  const [par, SelectPar, setPar] = useParCriptomoneda({});

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
  } = useValidacion(STATE_INICIAL, validarCrearAlarma, modifyAlarma);

  const {
    id_API,
    nombre,
    sigla,
    monedapar,
    precioalarma,
    preciostop,
  } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function modifyAlarma() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // creo el obj alarma
    const alarmaUpdated = {
      id_API,
      sigla,
      nombre,
      par: monedapar,
      precioalarma,
      preciostop,
    };

    // inserto en DB
    firebase.db.collection("alarmas").doc(id).update(alarmaUpdated);
    router.push("/billetera");
  }

  useEffect(() => {
    const miValor = {
      id_API,
      sigla,
      nombre,
      monedapar: par.value,
      precioalarma,
      preciostop,
    };
    setValores(miValor);
  }, [par]);

  //localizo la alarma
  useEffect(() => {
    if (id) {
      const obtenerAlarma = async () => {
        const alarmaQuery = await firebase.db.collection("alarmas").doc(id);
        const alarma = await alarmaQuery.get();
        if (alarma.exists) {
          setAlarma(alarma.data());
          setPar({
            value: alarma.data().par,
            label: alarma.data().par.toUpperCase(),
          });
          setValores({
            id_API: alarma.data().id_API,
            nombre: alarma.data().nombre,
            sigla: alarma.data().sigla,
            monedapar: alarma.data().par,
            precioalarma: alarma.data().precioalarma,
            preciostop: alarma.data().preciostop,
          });
        } else {
          setErrorBuscar(true);
        }
      };
      obtenerAlarma();
    }
  }, [id]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            {errorBuscar && <Error404 />}
            <Titulo>Modificar Alarma</Titulo>
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
                  disabled
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
                  disabled
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
                  Guardar Cambios
                </Button>
              </Campo>
            </Formulario>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default editarAlarma;
