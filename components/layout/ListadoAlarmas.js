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
    precioaUSD,
    preciopar,
    //compara,
    precioalarma,
    preciostop,
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
    if (precioalarma > 0 && preciopar >= precioalarma) {
      setStartAlarm(true);
      setActivada(true);
    }

    if (preciostop > 0 && preciopar <= preciostop) {
      setStartAlarm(true);
      setActivada(true);
    }
  }, [preciopar]);

  const toogleActivada = () => {
    setActivada(!activada);
    toggleStart();
  };

  return (
    <tr>
      <td data-th="Par">
        {sigla}/{par.toUpperCase()}
      </td>
      <td data-th="Precio Actual">
        <NumberFormat
          value={preciopar}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Limit">
        <NumberFormat
          value={precioalarma}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => (
            <CeldaNumero>
              <div>&uarr; {value}</div>
            </CeldaNumero>
          )}
        />
      </td>
      <td data-th="StopLoss">
        <NumberFormat
          value={preciostop}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => (
            <CeldaNumero>
              <div>&darr; {value} </div>
            </CeldaNumero>
          )}
        />
      </td>
      <td data-th="Acciones">
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
