import React from "react";
import Layout from "../components/layout/Layout";
import styled from "@emotion/styled";
import axios from "axios";

import Boton from "../components/ui/Boton";

export default function ExMarkets() {
  //   const CLIENT_KEY = client_api_key; // key obtained from exmarkets
  //   const SECRET_KEY = client_api_secret; // secret obtained from exmarkets
  //   const TIMESTAMP = Math.floor(Date.now() / 1000) + 6; // timestamp in seconds
  //   const NONCE = Math.floor((Date.now() + Math.random()) * 100); // unique nonce
  //   const AUTH_TYPE = "Basic"; // authorization type

  const consultar_API = () => {
    const config = {
      method: "get",
      url: "https://exmarkets.com/api/v1/general/information",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <Layout>
        <h1>ExMarkets</h1>
        <Boton bgColor="true" onClick={() => consultar_API()}>
          Consultar
        </Boton>
      </Layout>
    </div>
  );
}
