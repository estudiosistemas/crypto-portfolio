import React, { useEffect, useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";
import axios from "axios";
import { formatDate } from "../../functions/funciones";
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
import validarVenderMoneda from "../../validacion/validarVenderMoneda";

//hooks
import useParBilletera from "../../hooks/useParBilletera";

const STATE_INICIAL = {
  nombre: "",
  moneda_sigla: "",
  moneda_cantidad: 0,
  moneda_valorcompra: 0,
  fecha: formatDate(Date.now()),
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

      firebase.db.collection("billetera").doc(compra.par_id).update(parUpdated);
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
      <h1
        css={css`
          text-align: center;
          margin-top: 5rem;
        `}
      >
        Vender {moneda_sigla}
      </h1>
      <Formulario onSubmit={handleSubmit} noValidate>
        <Campo>
          <label htmlFor="moneda_sigla">Sigla</label>
          <input
            type="text"
            id="moneda_sigla"
            placeholder="Sigla cryptomoneda"
            name="moneda_sigla"
            value={moneda_sigla}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </Campo>
        {errores.moneda_sigla && <Error>{errores.moneda_sigla}</Error>}
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
            disabled
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
        <Campo>
          <label htmlFor="disponible">Disponible</label>
          <input
            type="number"
            id="disponible"
            name="disponible"
            value={disponible}
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
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={fecha}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.fecha && <Error>{errores.fecha}</Error>}

        <Campo>
          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={precio}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.precio && <Error>{errores.precio}</Error>}

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
          <label htmlFor="total">Total</label>
          <input
            type="number"
            id="total"
            name="total"
            value={total}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.total && <Error>{errores.total}</Error>}
        <Campo>
          <label htmlFor="totalUSD">Total USD</label>
          <input
            type="number"
            id="totalUSD"
            name="totalUSD"
            value={totalUSD}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Campo>
        {errores.totalUSD && <Error>{errores.totalUSD}</Error>}
        {error && <Error>{error}</Error>}
        <InputSubmit type="submit" value="Guardar Compra" />
      </Formulario>
    </Layout>
  );
};

export default VenderMoneda;
