import React, { useEffect, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";
import axios from "axios";
import { getNowDateTimeStr } from "../../functions/funciones";

import Layout from "../../components/layout-responsive/Layout";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

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
import validarVenderMoneda from "../../validacion/validarVenderMoneda";

//hooks
import useParBilletera from "../../hooks/useParBilletera";

const STATE_INICIAL = {
  nombre: "",
  moneda_sigla: "",
  moneda_cantidad: 0,
  moneda_valorcompra: 0,
  fecha: getNowDateTimeStr(),
  monedapar: "",
  disponible: 0,
  cantidad: 0,
  precio: 0,
  total: 0,
  totalUSD: 0,
  monedapar_cotizaUSD: 0,
};

const VenderMoneda = () => {
  const [moneda, setMoneda] = useState({});
  const [errorBuscar, setErrorBuscar] = useState(false);
  const [error, setError] = useState(false);

  const [par, SelectPar] = useParBilletera({});

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
  } = useValidacion(STATE_INICIAL, validarVenderMoneda, venderMoneda);

  const {
    id_API,
    nombre,
    moneda_sigla,
    moneda_cantidad,
    moneda_valorcompra,
    monedapar,
    disponible,
    fecha,
    cantidad,
    precio,
    total,
    totalUSD,
    monedapar_cotizaUSD,
  } = valores;

  //context con operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function venderMoneda() {
    // Controlo que haya usuario logueado
    if (!usuario) {
      return router.push("/login");
    }

    try {
      // creo el obj moneda
      const venta = {
        orden: "Venta",
        usuario: usuario.uid,
        moneda_id: id,
        moneda_sigla,
        par_id: par.value,
        par_sigla: par.label,
        fecha,
        cantidad,
        precio,
        total,
        totalUSD,
      };

      // inserto en DB
      firebase.db.collection("ordenes").add(venta);

      // resto cantidad y valorUSD en moneda vendida
      let calculoCantidad =
        parseFloat(moneda_cantidad) - parseFloat(valores.cantidad);
      let calculoValorcompra = 0;
      if (calculoCantidad > 0) {
        calculoValorcompra =
          parseFloat(moneda_valorcompra) - parseFloat(valores.totalUSD);
      }

      const monedaUpdated = {
        cantidad: calculoCantidad.toFixed(8),
        valorcompra: calculoValorcompra.toFixed(8),
      };

      firebase.db.collection("billetera").doc(id).update(monedaUpdated);

      // sumo cantidad y valorUSD en moneda par
      const parUpdated = {
        cantidad: (
          parseFloat(par.cantidad) + parseFloat(valores.total)
        ).toFixed(8),
        valorcompra: (
          parseFloat(par.valorcompra) + parseFloat(valores.totalUSD)
        ).toFixed(8),
      };

      firebase.db.collection("billetera").doc(venta.par_id).update(parUpdated);
      console.log("actualizo par");
      // vuelvo a la billetera
      router.push("/billetera");
    } catch (error) {
      console.log("Error al grabar datos de compra");
    }
  }

  useEffect(() => {
    if (id) {
      const obtenerMoneda = async () => {
        const monedaQuery = await firebase.db.collection("billetera").doc(id);
        const moneda = await monedaQuery.get();
        if (moneda.exists) {
          setMoneda(moneda.data());
          setValores({
            ...valores,
            id_API: moneda.data().id_API,
            nombre: moneda.data().nombre,
            moneda_sigla: moneda.data().sigla,
            moneda_cantidad: moneda.data().cantidad,
            disponible: moneda.data().cantidad,
            moneda_valorcompra: moneda.data().valorcompra,
          });
        } else {
          setErrorBuscar(true);
        }
      };
      obtenerMoneda();
    }
  }, [id]);

  useEffect(() => {
    const buscoValor = () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${par.id_API}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

      axios
        .get(url)
        .then((res) => {
          if (res.data[0]) {
            setValores({
              ...valores,
              monedapar_cotizaUSD: res.data[0].current_price,
              monedapar: par.value,
              //disponible: par.cantidad,
            });
          }
        })
        .catch((err) => console.log(err));
    };
    buscoValor();
  }, [par]);

  return (
    <Layout>
      {errorBuscar && <Error404 />}
      <div className="listado-productos">
        <div className="contenedor">
          <Titulo>Vender {moneda_sigla}</Titulo>
          <Formulario noValidate>
            <Campo>
              <label htmlFor="moneda_sigla">Sigla</label>
              <TextField
                style={{ flex: "1" }}
                id="moneda_sigla"
                name="moneda_sigla"
                value={moneda_sigla}
                variant="outlined"
                size="small"
                disabled
              />
            </Campo>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <TextField
                style={{ flex: "1" }}
                id="nombre"
                name="nombre"
                value={nombre}
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
              <label htmlFor="disponible">Disponible</label>
              <TextField
                style={{ flex: "1" }}
                id="disponible"
                name="disponible"
                value={disponible}
                variant="outlined"
                size="small"
                disabled
              />
            </Campo>
            <input
              type="number"
              id="monedapar_cotizaUSD"
              name="monedapar_cotizaUSD"
              value={monedapar_cotizaUSD}
              hidden
            />

            <Campo>
              <label htmlFor="fecha">Fecha</label>
              <TextField
                style={{ flex: "1" }}
                type="datetime-local"
                error={errores.fecha && true}
                id="fecha"
                name="fecha"
                defaultValue={fecha}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.fecha}
                variant="outlined"
                size="small"
              />
            </Campo>
            {errores.fecha && <Error>{errores.fecha}</Error>}

            <Campo>
              <label htmlFor="precio">Precio</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.precio && true}
                id="precio"
                name="precio"
                value={precio}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.precio}
                variant="outlined"
                size="small"
                type="number"
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
              <label htmlFor="total">Total</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.total && true}
                id="total"
                name="total"
                value={total}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.total}
                variant="outlined"
                size="small"
                type="number"
              />
            </Campo>
            <Campo>
              <label htmlFor="totalUSD">Total USD</label>
              <TextField
                style={{ flex: "1" }}
                error={errores.totalUSD && true}
                id="totalUSD"
                name="totalUSD"
                value={totalUSD}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errores.totalUSD}
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
                Guardar Venta
              </Button>
            </Campo>
          </Formulario>
        </div>
      </div>
    </Layout>
  );
};

export default VenderMoneda;
