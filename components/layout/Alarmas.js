import React, { useState, useEffect, useContext } from "react";
import { Tabla, CeldaNumero, CeldaPosicion } from "../ui/Tabla";
import Boton from "../ui/Boton";
import ListadoAlarmas from "./ListadoAlarmas";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import useSound from "use-sound";

const Alarmas = () => {
  const [alarmasAPI, setAlarmasAPI] = useState([]);
  const [alarmas, setAlarmas] = useState([]);
  const [mensajeAlarma, setMensajeAlarma] = useState("Cargando...");
  const [valores, setValores] = useState({});
  const [siglas, setSiglas] = useState("");
  const [par_siglas, setPar_Siglas] = useState("");

  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  //state para sonido
  const [play, { stop }] = useSound(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
  const [playing, setPlaying] = useState(true);
  const [startalarm, setStartAlarm] = useState(false);

  const toggle = () => setPlaying(!playing);
  const toggleStart = () => setStartAlarm(!startalarm);

  useEffect(() => {
    playing && startalarm ? play() : stop();
  }, [playing, startalarm]);

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerAlarmas = () => {
        firebase.db
          .collection("alarmas")
          .orderBy("creado", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshotAlarmas);
      };

      obtenerAlarmas();
    }
  }, [usuario]);

  function manejarSnapshotAlarmas(snapshot) {
    let miSiglas = "bitcoin,ethereum,binancecoin,";
    //let miParSiglas = "";
    const result = snapshot.docs.map((doc) => {
      miSiglas = miSiglas + doc.data().id_API + ",";
      //miParSiglas = miParSiglas + doc.data().par + ",";
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    miSiglas = miSiglas.slice(0, -1);
    //miParSiglas = miParSiglas.slice(0, -1);
    setSiglas(miSiglas);
    //setPar_Siglas(miParSiglas);
    setAlarmasAPI(result);
    if (result.length == 0) setMensajeAlarma("No hay Alarmas configuradas.");
  }

  useEffect(() => {
    if (siglas) buscoValor();
  }, [siglas]);

  useInterval(() => {
    if (siglas) buscoValor();
  }, 2000);

  useEffect(() => {
    if (Object.keys(valores).length != 0) {
      setAlarmas(concatenarAlarmas());
    }
  }, [valores]);

  const concatenarAlarmas = () => {
    //obtener cotizacion de los pares en usd
    let cotBTC = 0;
    let cotETH = 0;
    let cotBNB = 0;
    valores.map((elem) => {
      switch (elem.symbol) {
        case "btc":
          cotBTC = elem.current_price;
          break;
        case "eth":
          cotETH = elem.current_price;
          break;
        case "bnb":
          cotBNB = elem.current_price;
          break;
        default:
          break;
      }
    });
    const concatenaAl = alarmasAPI.map((al) => {
      let cotUSDT = 0;
      let cotPar = 0;
      const alarma_actual = valores.filter((el) => el.id == al.id_API);
      if (alarma_actual.length > 0) {
        cotUSDT = alarma_actual[0].current_price;
        switch (al.par) {
          case "btc":
            cotPar = (cotUSDT / cotBTC).toFixed(8);
            break;
          case "eth":
            cotPar = (cotUSDT / cotETH).toFixed(8);
            break;
          case "bnb":
            cotPar = (cotUSDT / cotBNB).toFixed(8);
            break;
          default:
            cotPar = cotUSDT.toFixed(8);
            break;
        }
      }
      const elAlarma = {
        id: al.id,
        id_API: al.id_API,
        sigla: al.sigla,
        nombre: al.nombre,
        par: al.par,
        //compara: al.compara,
        precioalarma: parseFloat(al.precioalarma).toFixed(8),
        preciostop: parseFloat(al.preciostop).toFixed(8),
        precioaUSD: cotUSDT,
        preciopar: cotPar,
      };
      return elAlarma;
    });
    return concatenaAl;
  };

  const buscoValor = () => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${siglas}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    axios
      .get(url)
      .then((res) => {
        setValores(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* <Boton bgColor="true" onClick={toggle}>
        {playing ? "Desactivar Alarmas" : "Activar Alarmas"}
      </Boton> */}
      <label for="cbox2">Alarmas Desactivadas {""}</label>
      <input type="checkbox" id="cbox2" value={playing} onChange={toggle} />
      <Tabla>
        <thead>
          <th>Par</th>
          <th>Precio Actual</th>
          <th>Precio Limit</th>
          <th>Precio Stop Loss</th>
          <th>Acciones</th>
        </thead>
        <tbody>
          {alarmas.length > 0 ? (
            alarmas.map((alarm, index) => (
              <ListadoAlarmas
                key={index}
                alarma={alarm}
                startalarm={startalarm}
                toggleStart={toggleStart}
                setStartAlarm={setStartAlarm}
                setAlarmas={setAlarmas}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5">{mensajeAlarma}</td>
            </tr>
          )}
        </tbody>
      </Tabla>
    </div>
  );
};

export default Alarmas;
