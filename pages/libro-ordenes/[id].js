import React, { useEffect, useContext, useState } from "react";
import Layout from "../../components/layout-responsive/Layout";
import { Tabla, CeldaNumero, CeldaColor } from "../../components/ui/Tabla";
import Titulo from "../../components/ui/Titulo";
import NumberFormat from "react-number-format";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import useParBilletera from "../../hooks/useParBilletera";
import { css } from "@emotion/core";
import Moment from "react-moment";

export default function LibroOrdenes() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [libroOrdenes, setLibroOrdenes] = useState([]);
  const [moneda, setMoneda] = useState({});
  const [par, setPar] = useState({});
  const [ordenSelect, setOrdenSelect] = useState({});

  const { usuario, firebase } = useContext(FirebaseContext);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const [par1, SelectPar1] = useParBilletera({});
  const [par2, SelectPar2] = useParBilletera({});

  useEffect(() => {
    if (id) {
      const obtenerOrdenes = () => {
        firebase.db
          .collection("ordenes")
          .orderBy("fecha", "desc")
          .where("moneda_id", "==", id)
          .onSnapshot(manejarSnapshot);
      };

      obtenerOrdenes();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const obtenerMoneda = async () => {
        const monedaQuery = await firebase.db.collection("billetera").doc(id);
        const moneda = await monedaQuery.get();
        if (moneda.exists) {
          setMoneda(moneda.data());
        } else {
          setErrorBuscar(true);
        }
      };

      obtenerMoneda();
    }
  }, [id]);

  function manejarSnapshot(snapshot) {
    //let sumacompra = 0;
    //let miSiglas = "";
    const result = snapshot.docs.map((doc) => {
      //sumacompra = sumacompra + parseFloat(doc.data().valorcompra);
      //miSiglas = miSiglas + doc.data().id_API + ",";

      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //miSiglas = miSiglas.slice(0, -1);
    //setTotales({ ...totales, compra: sumacompra });
    //setSiglas(miSiglas);
    setLibroOrdenes(result);
    if (result.length == 0) setMensaje("No hay órdenes Cargadas.");
  }

  const obtenerPar = async (idPar) => {
    const parQuery = await firebase.db.collection("billetera").doc(idPar);
    const par = await parQuery.get();
    if (par.exists) {
      setPar(par.data());
    } else {
      setErrorBuscar(true);
    }
  };

  const borrarOrden = async (miOrden) => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      setOrdenSelect(miOrden);
      await obtenerPar(miOrden.par_id);
      await firebase.db.collection("ordenes").doc(miOrden.id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(par).length > 0 && Object.keys(ordenSelect).length > 0) {
      if (ordenSelect.orden == "Compra") {
        recuperoCompra(ordenSelect);
      } else {
        recuperoVenta(ordenSelect);
      }
      setPar({});
      setOrdenSelect({});
    }
  }, [par]);

  const recuperoCompra = async () => {
    // resto cantidad y valorUSD en moneda vendida
    let calculoCantidad =
      parseFloat(moneda.cantidad) - parseFloat(ordenSelect.cantidad);
    let calculoValorcompra = 0;
    if (calculoCantidad > 0) {
      calculoValorcompra =
        parseFloat(moneda.valorcompra) - parseFloat(ordenSelect.totalUSD);
    }

    const monedaUpdated = {
      cantidad: calculoCantidad.toFixed(8),
      valorcompra: calculoValorcompra.toFixed(8),
    };
    console.log(moneda, id, monedaUpdated);
    await firebase.db.collection("billetera").doc(id).update(monedaUpdated);

    // sumo cantidad y valorUSD en moneda par
    const parUpdated = {
      cantidad: (
        parseFloat(par.cantidad) + parseFloat(ordenSelect.total)
      ).toFixed(8),
      valorcompra: (
        parseFloat(par.valorcompra) + parseFloat(ordenSelect.totalUSD)
      ).toFixed(8),
    };

    await firebase.db
      .collection("billetera")
      .doc(ordenSelect.par_id)
      .update(parUpdated);
    console.log(par, ordenSelect.par_id, parUpdated);
  };

  const recuperoVenta = async (ordenSelect) => {
    // sumo cantidad y valorUSD en moneda vendida
    let calculoCantidad =
      parseFloat(moneda.cantidad) + parseFloat(ordenSelect.cantidad);
    let calculoValorcompra = 0;
    if (calculoCantidad > 0) {
      calculoValorcompra =
        parseFloat(moneda.valorcompra) + parseFloat(ordenSelect.totalUSD);
    }

    const monedaUpdated = {
      cantidad: calculoCantidad.toFixed(8),
      valorcompra: calculoValorcompra.toFixed(8),
    };
    console.log(moneda, id, monedaUpdated);
    await firebase.db.collection("billetera").doc(id).update(monedaUpdated);

    // resto cantidad y valorUSD en moneda par
    const parUpdated = {
      cantidad: (
        parseFloat(par.cantidad) - parseFloat(ordenSelect.total)
      ).toFixed(8),
      valorcompra: (
        parseFloat(par.valorcompra) - parseFloat(ordenSelect.totalUSD)
      ).toFixed(8),
    };

    await firebase.db
      .collection("billetera")
      .doc(ordenSelect.par_id)
      .update(parUpdated);
    console.log(par, ordenSelect.par_id, parUpdated);
  };

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div
            className="contenedor"
            css={css`
              min-height: 420px;
            `}
          >
            <Titulo>
              Libro de Ordenes{" "}
              {libroOrdenes.length > 0 && libroOrdenes[0].moneda_sigla}
            </Titulo>

            <div className="bg-white">
              <Tabla>
                <thead>
                  <th>Fecha</th>
                  <th>Par</th>
                  <th>Orden</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total Orden</th>
                  <th>Total Orden USD</th>
                  <th>Acciones</th>
                </thead>
                <tbody>
                  {libroOrdenes.length > 0 ? (
                    libroOrdenes.map((orden, index) => (
                      <tr key={index}>
                        <td>
                          <Moment format="DD-MM-YYYY HH:MM">
                            {orden.fecha}
                          </Moment>
                        </td>
                        <td>
                          {orden.moneda_sigla}/{orden.par_sigla}
                        </td>
                        <td>
                          {orden.orden == "Compra" ? (
                            <CeldaColor verde>{orden.orden}</CeldaColor>
                          ) : (
                            <CeldaColor>{orden.orden}</CeldaColor>
                          )}
                        </td>
                        <td>
                          <NumberFormat
                            value={orden.cantidad}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={8}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <CeldaNumero>{value}</CeldaNumero>
                            )}
                          />
                        </td>
                        <td>
                          <NumberFormat
                            value={orden.precio}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={8}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <CeldaNumero>{value}</CeldaNumero>
                            )}
                          />
                        </td>
                        <td>
                          <NumberFormat
                            value={orden.total}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={8}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <CeldaNumero>{value}</CeldaNumero>
                            )}
                          />
                        </td>
                        <td>
                          {" "}
                          <NumberFormat
                            value={orden.totalUSD}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={4}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <CeldaNumero>{value}</CeldaNumero>
                            )}
                          />
                        </td>
                        <td>
                          <button onClick={() => borrarOrden(orden)}>
                            Borrar
                          </button>
                        </td>
                      </tr>
                      //<ListadoOrdenes key={index} moneda={moneda} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">{mensaje}</td>
                    </tr>
                  )}
                </tbody>
              </Tabla>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
