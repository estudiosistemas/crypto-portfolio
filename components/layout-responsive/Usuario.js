import React, { useContext } from "react";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";

const Usuario = () => {
  const { usuario, firebase } = useContext(FirebaseContext);

  return (
    <div className="log-sign" style={{ "--i": "1.8s" }}>
      {usuario ? (
        <>
          <p>Usuario: {usuario.displayName}</p>

          <button className="btn solid" onClick={() => firebase.cerrarSesion()}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link href="/login">
            <a className="btn transparent">Login</a>
          </Link>
          <Link href="/crear-cuenta">
            <a className="btn solid">Registro</a>
          </Link>
        </>
      )}
    </div>
  );
};

export default Usuario;
