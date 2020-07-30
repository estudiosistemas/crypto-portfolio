import React, { useEffect, useContext, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import styled from "@emotion/styled";
import useInterval from "../hooks/useInterval";
import IndexListadoMonedas from "../components/layout/IndexListadoMonedas";

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

export default function Home() {
  //const { id, sigla, nombre, cantidad } = moneda;
  const [listado, setListado] = useState([]);

  const buscoValor = () => {
    //const api_key =
    //  "d16bcd6c0b0f3181df076d62695fdc93680e578e55a423b52177c4f501fd4780";
    const url =
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"; //&api_key=${api_key}`;

    axios
      .get(url)
      .then((res) => {
        const lista = res.data.Data.map((moneda) => ({
          id: moneda.CoinInfo.Id,
          logo: moneda.CoinInfo.ImageUrl,
          sigla: moneda.CoinInfo.Name,
          nombre: moneda.CoinInfo.FullName,
          valor: moneda.DISPLAY.USD.PRICE,
          valoralto24hs: moneda.DISPLAY.USD.HIGH24HOUR,
          valorbajo24hs: moneda.DISPLAY.USD.LOW24HOUR,
          cambio24hs: moneda.DISPLAY.USD.CHANGE24HOUR,
          cambioporc24hs: moneda.DISPLAY.USD.CHANGEPCT24HOUR,
        }));
        setListado(lista);
      })
      .catch((err) => console.log(err));
  };

  useInterval(() => {
    buscoValor();
  }, 30000);

  useEffect(() => {
    buscoValor();
  }, []);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <h1>Inicio</h1>
            <div className="bg-white">
              <Tabla>
                <thead>
                  <th>Moneda</th>
                  <th>Ultimo Precio</th>
                  <th>Cambio en 24 hs.</th>
                  <th>Máximo en 24 hs.</th>
                  <th>Mínimo en 24 hs.</th>
                </thead>
                <tbody>
                  {listado.map((moneda) => (
                    <IndexListadoMonedas key={moneda.id} moneda={moneda} />
                  ))}
                </tbody>
              </Tabla>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
