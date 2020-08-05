import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
//import Select from "react-select";

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
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Crear Alarma
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
                placeholder="Nombre Criptomoneda"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label>Par</label>
              <SelectPar />
            </Campo>
            {errores.monedapar && <Error>{errores.monedapar}</Error>}

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
            {/* <Campo>
              <label>Precio Cripto</label>
              <div
                css={css`
                  flex: 1;
                `}
              >
                <Select
                  options={comparaOptions}
                  onChange={(e) =>
                    setValores({
                      ...valores,
                      compara: e.value,
                    })
                  }
                  defaultValue={comparaOptions[0]}
                  placeholder="Seleccione una opción..."
                />
              </div>
            </Campo> */}
            <Campo>
              <label htmlFor="precioalarma">Precio Limit</label>
              <input
                type="number"
                id="precioalarma"
                name="precioalarma"
                value={precioalarma}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.precioalarma && <Error>{errores.precioalarma}</Error>}
            <Campo>
              <label htmlFor="preciostop">Precio StopLoss</label>
              <input
                type="number"
                id="preciostop"
                name="preciostop"
                value={preciostop}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.preciostop && <Error>{errores.preciostop}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Alarma" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default nuevaAlarma;
