import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import ListadoMonedas from "../components/layout/ListadoMonedas";
import styled from "@emotion/styled";
import NumberFormat from "react-number-format";
import useInterval from "../hooks/useInterval";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";

const Tabla = styled.table`
  border-collapse: collapse;
  width: 100%;

  tfoot {
    background-color: var(--gris3);
  }

  th {
    height: 50px;
    background-color: var(--gris2);
    color: white;
  }

  th,
  td {
    padding: 5px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const CeldaNumero = styled.div`
  text-align: right;
`;

const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;

const CONFIG_INICIAL = {
  api_key: null,
  api_time_refresh: 30000,
};

export default function Billetera() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [billetera, setBilletera] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [valores, setValores] = useState({});
  const [config, setConfig] = useState(CONFIG_INICIAL);
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

      const obtenerConfig = async () => {
        firebase.db
          .collection("configuracion")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshotConfig);
      };

      obtenerConfig();
      obtenerBilletera();
    }
  }, []);

  function manejarSnapshot(snapshot) {
    let sumacompra = 0;
    let miSiglas = "";
    const result = snapshot.docs.map((doc) => {
      sumacompra = sumacompra + parseFloat(doc.data().valorcompra);
      miSiglas = miSiglas + doc.data().sigla + ",";
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

  function manejarSnapshotConfig(snapshot) {
    const result = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    if (result[0]) {
      setConfig(result[0]);
    } else {
      setConfig(CONFIG_INICIAL);
      const miConfig = {
        usuario: usuario.uid,
        api_key: null,
        api_time_refresh: 30000,
      };
      firebase.db.collection("configuracion").add(miConfig);
    }
  }

  useEffect(() => {
    if (siglas) buscoValor();
  }, [siglas]);

  useInterval(() => {
    buscoValor();
  }, config.api_time_refresh);

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
      if (valores[moneda.sigla] && moneda.cotizacion == 0) {
        cotUSDT = valores[moneda.sigla].USDT;
        cotBTC = valores[moneda.sigla].BTC;
      }
      const totalUSDT = moneda.cantidad * cotUSDT;
      const totalBTC = moneda.cantidad * cotBTC;
      let posicionUSDT = 0;
      if (totalUSDT > 0) {
        posicionUSDT = (totalUSDT / moneda.valorcompra - 1) * 100;
      }
      const elBilletera = {
        id: moneda.id,
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
    let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${siglas}&tsyms=USDT,BTC`;

    if (config) {
      if (config.api_key) {
        url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${siglas}&tsyms=USDT,BTC&api_key=${config.api_key}`;
      }
    }

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
                      <ListadoMonedas
                        key={index}
                        indice={index}
                        moneda={moneda}
                      />
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
        </div>
      </Layout>
    </div>
  );
}
