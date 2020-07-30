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
import validarConfig from "../../validacion/validarConfig";

const STATE_INICIAL = {
  api_key: "",
  api_time_refresh: 5000,
};

const Configuracion = () => {
  const [config, setConfig] = useState({});
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
  } = useValidacion(STATE_INICIAL, validarConfig, editarConfig);

  const { api_key, api_time_refresh } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function editarConfig() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    // inserto en DB
    firebase.db.collection("configuracion").doc(config.id).update(valores);
    router.push("/billetera");
  }

  useEffect(() => {
    //Busco la configuracionn del usuario
    if (id) {
      const obtenerConfig = () => {
        firebase.db
          .collection("configuracion")
          .where("usuario", "==", id)
          .onSnapshot(manejarSnapshot);
      };
      obtenerConfig();
    }
  }, [id]);

  function manejarSnapshot(snapshot) {
    const result = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    if (result[0]) {
      setConfig(result[0]);
      setValores({
        api_key: result[0].api_key,
        api_time_refresh: result[0].api_time_refresh,
      });
    } else {
      setErrorBuscar(true);
    }
  }

  return (
    <Layout>
      <h1
        css={css`
          text-align: center;
          margin-top: 5rem;
        `}
      >
        Configuración
      </h1>
      <Formulario onSubmit={handleSubmit} noValidate>
        <Campo>
          <label htmlFor="api_key">API KEY</label>
          <input
            type="text"
            id="api_key"
            placeholder="API KEY de cryptocompare.com"
            name="api_key"
            value={api_key}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        </Campo>
        {errores.api_key && <Error>{errores.api_key}</Error>}
        <Campo>
          <label htmlFor="api_time_refresh">Tiempo en ms</label>
          <input
            type="number"
            id="api_time_refresh"
            name="api_time_refresh"
            value={api_time_refresh}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.api_time_refresh && <Error>{errores.api_time_refresh}</Error>}
        {error && <Error>{error}</Error>}
        <InputSubmit type="submit" value="Guardar Cambios" />
      </Formulario>
    </Layout>
  );
};

export default Configuracion;
