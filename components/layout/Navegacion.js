import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { FirebaseContext } from "../../firebase";

const Nav = styled.nav`
  padding-left: 2rem;

  a {
    font-size: 1.5rem;
    margin-left: 2rem;
    color: var(--gris2);
    font-family: "PT Sans", sans-serif;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const Navegacion = () => {
  const { usuario, firebase } = useContext(FirebaseContext);
  return (
    <Nav>
      <Link href="/">
        <a>Inicio</a>
      </Link>
      {usuario && (
        <>
          <Link href="/billetera">
            <a>Billetera</a>
          </Link>
          <Link href="/nueva-moneda">
            <a>Cargar Moneda</a>
          </Link>
          <Link href="/nueva-alarma">
            <a>Crear Alarma</a>
          </Link>
          <Link href="/libro-de-ordenes">
            <a>Libro de Ordenes</a>
          </Link>
          {/* <Link href="/editar-config[id]" as={`/editar-config/${usuario.uid}`}>
            <a>Configuración</a>
          </Link> */}
        </>
      )}
    </Nav>
  );
};

export default Navegacion;
