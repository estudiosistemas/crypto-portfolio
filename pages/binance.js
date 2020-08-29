import React, { useEffect } from "react";
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
      "Content-Type": "application/json",
      "X-MBX-APIKEY": binanceConfig.API_KEY,
      "Access-Control-Allow-Origin": "localhost:3000/",
    },
  };

  try {
    console.log("URL: ", requestConfig.url);
    const response = await axios(requestConfig);
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const binance = () => {
  useEffect(() => {
    const data = {
      symbol: "ARKBTC",
      recvWindow: 20000,
      timestamp: Date.now(),
    };

    privateRequest(data, "/api/v3/openOrders", "GET");
  }, []);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Binance</Titulo>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default binance;
