import React, { useEffect, useState } from "react";
import Layout from "../components/layout-responsive/Layout";
import { Titulo } from "../components/ui/Formulario";
import axios from "axios";
import crypto from "crypto";
import qs from "qs";

const binanceConfig = {
  API_KEY: "aTgs4Ig9YD9iEyxkt8Z9Lzo5oLz8JrXY0bHnlmPeeT4kabN1OXev2qZp2SBZd5De",
  API_SECRET:
    "DAy51KGUc8v4IODsndQUcL3zBPagr8LE55soL9O0SUIPLRXQEwUwNlIYjaW99pmI",
  HOST_URL: "https://api.binance.com",
};

const buildSign = (data, config) => {
  return crypto
    .createHmac("sha256", config.API_SECRET)
    .update(data)
    .digest("hex");
};

const privateRequest = async (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url:
      binanceConfig.HOST_URL +
      endPoint +
      "?" +
      dataQueryString +
      "&signature=" +
      signature,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-MBX-APIKEY": binanceConfig.API_KEY,
    },
  };

  try {
    //console.log("URL: ", requestConfig.url);
    const response = await axios(requestConfig);
    //console.log(response.data.balances);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const publicRequest = async (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  //const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url: binanceConfig.HOST_URL + endPoint + "?" + dataQueryString,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      //"X-MBX-APIKEY": binanceConfig.API_KEY,
    },
  };

  try {
    //console.log("URL: ", requestConfig.url);
    const response = await axios(requestConfig);
    //console.log(response.data.balances);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const binance = () => {
  const [account, setAccount] = useState([]);
  const [billetera, setBilletera] = useState([]);
  const [simbolos, setSimbolos] = useState([]);

  const filtroBalance = (balance) => {
    const balance_sin_ceros = balance.filter(
      (moneda) => moneda.free > 0 || moneda.locked > 0
    );
    setAccount(balance_sin_ceros);
  };

  const buscoTrades = (symbol) => {
    const data = {
      symbol,
      recvWindow: 20000,
      timestamp: Date.now(),
    };

    const account_trade = privateRequest(data, "/api/v3/myTrades", "GET");
    account_trade.then((val) => console.log(val));
  };

  const filtroPrecios = (precios) => {
    //console.log(precios);
    const billetera_binace = account.map((moneda) => {
      const miPrecio = precios.filter(
        (moneda_precio) => moneda_precio.symbol == moneda.asset + "USDT"
      );
      let elPrecio = 1;
      if (miPrecio.length > 0) {
        elPrecio = miPrecio[0].price;
      }
      const pares_moneda = simbolos.filter(
        (simbolo) => simbolo.baseAsset == moneda.asset
      );
      console.log(pares_moneda);

      const elCantidad = parseFloat(moneda.free) + parseFloat(moneda.locked);
      const elTotalUSDT = elCantidad * parseFloat(elPrecio);
      const elBilletera = {
        sigla: moneda.asset,
        cantidad: elCantidad,
        cotizacionUSDT: elPrecio,
        totalUSDT: elTotalUSDT,
      };
      return elBilletera;
    });
    setBilletera(billetera_binace);
  };

  useEffect(() => {
    // const data = {
    //   symbol: "YFIUSDT",
    //   recvWindow: 20000,
    //   timestamp: Date.now(),
    // };
    const exchangeInfo = publicRequest({}, "/api/v3/exchangeInfo", "GET");
    exchangeInfo.then((val) => setSimbolos(val.symbols));

    const data_account = {
      recvWindow: 20000,
      timestamp: Date.now(),
    };

    //privateRequest(data, "/api/v3/openOrders", "GET");
    const account_promise = privateRequest(
      data_account,
      "/api/v3/account",
      "GET"
    );
    account_promise.then((val) => filtroBalance(val.balances));

    //buscoTrades("YFIUSDT");
  }, []);

  useEffect(() => {
    if (account.length > 0) {
      const price_promise = publicRequest({}, "/api/v3/ticker/price", "GET");
      price_promise.then((val) => filtroPrecios(val));
    }
  }, [account]);

  useEffect(() => {
    if (simbolos.length > 0) {
      console.log(simbolos);
    }
  }, [simbolos]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Binance</Titulo>
            <div>{account.accountType}</div>
            <table>
              <thead>
                <th>Moneda</th>
                <th>Cantidad</th>
                <th>Cotización USDT</th>
                <th>Total USDT</th>
              </thead>
              <tbody>
                {billetera.length > 0 &&
                  billetera.map((moneda, index) => (
                    <tr key={index}>
                      <td>{moneda.sigla}</td>
                      <td>{moneda.cantidad}</td>
                      <td>{moneda.cotizacionUSDT}</td>
                      <td>{moneda.totalUSDT}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default binance;
