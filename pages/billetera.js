import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import ListadoMonedas from "../components/layout/ListadoMonedas";
import { Tabla, CeldaNumero, CeldaPosicion } from "../components/ui/Tabla";
import NumberFormat from "react-number-format";
import useInterval from "../hooks/useInterval";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";
import Alarmas from "../components/layout/Alarmas";

export default function Billetera() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [billetera, setBilletera] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [valores, setValores] = useState({});
  const [siglas, setSiglas] = useState("");
  const [totales, setTotales] = useState({
    compra: 0,
    actual: 0,
    posicion: 0,
  });
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerBilletera = () => {
        firebase.db
          .collection("billetera")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshot);
      };

      obtenerBilletera();
    }
  }, []);

  function manejarSnapshot(snapshot) {
    let sumacompra = 0;
    let miSiglas = "";
    const result = snapshot.docs.map((doc) => {
      sumacompra = sumacompra + parseFloat(doc.data().valorcompra);
      miSiglas = miSiglas + doc.data().id_API + ",";
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    miSiglas = miSiglas.slice(0, -1);
    setTotales({ ...totales, compra: sumacompra });
    setSiglas(miSiglas);
    setMonedas(result);
    if (result.length == 0)
      setMensaje("No hay monedas Cargadas. Por favor diríjase a Cargar Moneda");
  }

  useEffect(() => {
    if (siglas) buscoValor();
  }, [siglas]);

  useInterval(() => {
    if (siglas) buscoValor();
  }, 2000);

  useEffect(() => {
    const actualizoTotales = () => {
      const sumoactual = billetera.reduce(function (acc, el) {
        return acc + el.valores.totalUSDT;
      }, 0);

      //Actualizo totales
      setTotales({
        ...totales,
        actual: sumoactual,
        posicion: (sumoactual / totales.compra - 1) * 100,
      });
    };
    if (billetera) actualizoTotales();
  }, [billetera]);

  useEffect(() => {
    if (Object.keys(valores).length != 0) {
      setBilletera(concatenarBilletera());
    }
  }, [valores]);

  const concatenarBilletera = () => {
    const concatena = monedas.map((moneda) => {
      let cotUSDT = moneda.cotizacion;
      let cotBTC = 0;
      const moneda_actual = valores.filter((el) => el.id == moneda.id_API);
      if (moneda_actual.length > 0 && moneda.cotizacion == 0) {
        cotUSDT = moneda_actual[0].current_price;
        //cotBTC = valores[moneda.sigla].BTC;
      }
      const totalUSDT = moneda.cantidad * cotUSDT;
      const totalBTC = moneda.cantidad * cotBTC;
      let posicionUSDT = 0;
      if (totalUSDT > 0) {
        posicionUSDT = (totalUSDT / moneda.valorcompra - 1) * 100;
      }
      const elBilletera = {
        id: moneda.id,
        id_API: moneda.id_API,
        sigla: moneda.sigla,
        nombre: moneda.nombre,
        cantidad: moneda.cantidad,
        valorcompra: moneda.valorcompra,
        cotizacion: moneda.cotizacion,
        valores: {
          cotizacionUSDT: cotUSDT,
          cotizacionBTC: cotBTC,
          totalUSDT,
          totalBTC,
          posicionUSDT,
          posicionBTC: 0,
        },
      };

      return elBilletera;
    });
    return concatena;
  };

  const buscoValor = () => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${siglas}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    axios
      .get(url)
      .then((res) => {
        setValores(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <h1>Billetera</h1>
            <div className="bg-white">
              <Tabla>
                <thead>
                  <th>Moneda</th>
                  <th>Cantidad</th>
                  <th>Cotización USDT</th>
                  <th>Valor Compra USDT</th>
                  <th>Valor Actual USDT</th>
                  <th>Posición</th>
                  <th>Acciones</th>
                </thead>
                <tfoot>
                  <tr>
                    <td colSpan="3">Totales</td>
                    <td>
                      <NumberFormat
                        value={totales.compra}
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
                        value={totales.actual}
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
                        value={totales.posicion}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        suffix={" %"}
                        renderText={(value) =>
                          totales.posicion > 0 ? (
                            <CeldaPosicion positivo>{value}</CeldaPosicion>
                          ) : (
                            <CeldaPosicion>{value}</CeldaPosicion>
                          )
                        }
                      />
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
                <tbody>
                  {billetera.length > 0 ? (
                    billetera.map((moneda, index) => (
                      <ListadoMonedas key={index} moneda={moneda} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">{mensaje}</td>
                    </tr>
                  )}
                </tbody>
              </Tabla>
            </div>
          </div>

          <div className="contenedor">
            <h1>Alarmas</h1>

            <div className="bg-white">
              <Alarmas />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
