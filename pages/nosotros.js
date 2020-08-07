import React from "react";
import Layout from "../components/layout-responsive/Layout";
import { Titulo } from "../components/ui/Formulario";

export default function Nosotros() {
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Nosotros</Titulo>
          </div>
        </div>
      </Layout>
    </div>
  );
}
