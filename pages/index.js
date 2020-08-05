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
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

    axios
      .get(url)
      .then((res) => {
        const lista = res.data.map((moneda) => ({
          id: moneda.id,
          logo: moneda.image,
          sigla: moneda.symbol.toUpperCase(),
          nombre: moneda.name,
          valor: moneda.current_price,
          valoralto24hs: moneda.high_24h,
          valorbajo24hs: moneda.low_24h,
          cambio24hs: moneda.price_change_24h,
          cambioporc24hs: moneda.price_change_percentage_24h,
        }));
        setListado(lista);
      })
      .catch((err) => console.log(err));
  };

  useInterval(() => {
    buscoValor();
  }, 2000);

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
                  <th colSpan="2">Moneda</th>
                  <th>Ultimo Precio</th>
                  <th>Cambio en 24 hs.</th>
                  <th>Máximo en 24 hs.</th>
                  <th>Mínimo en 24 hs.</th>
                </thead>
                <tfoot>
                  <td colSpan="6">
                    <small>Powered by CoinGecko API</small>
                  </td>
                </tfoot>
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
