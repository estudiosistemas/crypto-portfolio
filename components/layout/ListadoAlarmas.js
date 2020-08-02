import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import { CeldaNumero } from "../ui/Tabla";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";

const ListadoAlarmas = ({
  alarma,
  startalarm,
  toggleStart,
  setStartAlarm,
  setAlarmas,
}) => {
  const {
    id,
    sigla,
    nombre,
    par,
    precioUSD,
    preciopar,
    compara,
    precioalarma,
  } = alarma;

  const [activada, setActivada] = useState(false);
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  const borrarAlarma = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      await firebase.db.collection("alarmas").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    switch (compara[0]) {
      case "mayor":
        if (preciopar >= precioalarma) {
          setStartAlarm(true);
          setActivada(true);
        }
        break;
      case "menor":
        if (preciopar <= precioalarma) {
          setStartAlarm(true);
          setActivada(true);
        }
        break;
      default:
        break;
    }
  }, [preciopar]);

  const toogleActivada = () => {
    setActivada(!activada);
    toggleStart();
  };

  return (
    <tr>
      <td>
        {/* <Link href="/editar-monedas[id]" as={`/editar-monedas/${id}`}>
          <a
            css={css`
              text-decoration: none;
              color: blue;
              cursor: pointer;
            `}
          > */}
        {sigla}/{par.toUpperCase()}
        {/* </a>
        </Link> */}
      </td>
      <td>
        <NumberFormat
          value={preciopar}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
        <small>
          <NumberFormat
            value={precioUSD}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={8}
            fixedDecimalScale={true}
            renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
          />
        </small>
      </td>
      <td>
        <NumberFormat
          value={precioalarma}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => (
            <CeldaNumero>
              {compara == "mayor" ? (
                <div>&uarr; {value}</div>
              ) : (
                <div>&darr; {value} </div>
              )}
            </CeldaNumero>
          )}
        />
      </td>
      <td>
        {usuario && (
          <button onClick={toogleActivada}>
            {activada ? "Cancelar Alarma" : "Alarma Activa"}
          </button>
        )}{" "}
        <button onClick={borrarAlarma}>Borrar</button>
      </td>
    </tr>
  );
};

export default ListadoAlarmas;
