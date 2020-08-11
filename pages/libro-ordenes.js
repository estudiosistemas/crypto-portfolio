import React, { useEffect, useContext, useState } from "react";
import Layout from "../components/layout-responsive/Layout";
import { Tabla, CeldaNumero, CeldaPosicion } from "../components/ui/Tabla";
import Titulo from "../components/ui/Titulo";
import NumberFormat from "react-number-format";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useParBilletera from "../hooks/useParBilletera";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "1rem",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    alignItems: "center",
    height: "70px",
  },
}));

export default function LibroOrdenes() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [mostrarConCantidad, setMostrarConCantidad] = useState(true);
  const [libroOrdenes, setLibroOrdenes] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [valores, setValores] = useState({});
  const [siglas, setSiglas] = useState("");
  const [totales, setTotales] = useState({
    compra: 0,
    actual: 0,
    posicion: 0,
  });
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  const [par1, SelectPar1] = useParBilletera({});
  const [par2, SelectPar2] = useParBilletera({});

  useEffect(() => {
    if (usuario) {
      const { uid } = usuario;
      const obtenerOrdenes = () => {
        firebase.db
          .collection("ordenes")
          .orderBy("fecha", "asc")
          .where("usuario", "==", uid)
          .onSnapshot(manejarSnapshot);
      };

      obtenerOrdenes();
    }
  }, [usuario]);

  function manejarSnapshot(snapshot) {
    //let sumacompra = 0;
    //let miSiglas = "";
    const result = snapshot.docs.map((doc) => {
      //sumacompra = sumacompra + parseFloat(doc.data().valorcompra);
      //miSiglas = miSiglas + doc.data().id_API + ",";

      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //miSiglas = miSiglas.slice(0, -1);
    //setTotales({ ...totales, compra: sumacompra });
    //setSiglas(miSiglas);
    setLibroOrdenes(result);
    if (result.length == 0) setMensaje("No hay órdenes Cargadas.");
  }

  // useEffect(() => {
  //   const actualizoTotales = () => {
  //     const sumoactual = billetera.reduce(function (acc, el) {
  //       return acc + el.valores.totalUSDT;
  //     }, 0);

  //     //Actualizo totales
  //     setTotales({
  //       ...totales,
  //       actual: sumoactual,
  //       posicion: (sumoactual / totales.compra - 1) * 100,
  //     });
  //   };
  //   if (billetera) actualizoTotales();
  // }, [ordenes]);

  // useEffect(() => {
  //   if (Object.keys(valores).length != 0) {
  //     setBilletera(concatenarBilletera());
  //   }
  // }, [valores, mostrarConCantidad]);

  // const concatenarBilletera = () => {
  //   const concatena = monedas.map((moneda) => {
  //     if (
  //       !mostrarConCantidad ||
  //       (mostrarConCantidad && parseFloat(moneda.cantidad) > 0)
  //     ) {
  //       let cotUSDT = moneda.cotizacion;
  //       let cotBTC = 0;
  //       const moneda_actual = valores.filter((el) => el.id == moneda.id_API);
  //       if (moneda_actual.length > 0 && moneda.cotizacion == 0) {
  //         cotUSDT = moneda_actual[0].current_price;
  //         //cotBTC = valores[moneda.sigla].BTC;
  //       }
  //       const totalUSDT = moneda.cantidad * cotUSDT;
  //       const totalBTC = moneda.cantidad * cotBTC;
  //       let posicionUSDT = 0;
  //       if (totalUSDT > 0 && moneda.valorcompra > 0) {
  //         posicionUSDT = (totalUSDT / moneda.valorcompra - 1) * 100;
  //       }
  //       const elBilletera = {
  //         id: moneda.id,
  //         id_API: moneda.id_API,
  //         sigla: moneda.sigla,
  //         nombre: moneda.nombre,
  //         cantidad: moneda.cantidad,
  //         valorcompra: moneda.valorcompra,
  //         cotizacion: moneda.cotizacion,
  //         valores: {
  //           cotizacionUSDT: cotUSDT,
  //           cotizacionBTC: cotBTC,
  //           totalUSDT,
  //           totalBTC,
  //           posicionUSDT,
  //           posicionBTC: 0,
  //         },
  //       };
  //       return elBilletera;
  //     }
  //   });
  //   return concatena.filter(function (dato) {
  //     return dato != undefined;
  //   });
  // };

  const toggleMostrarConCantidad = () => {
    setMostrarConCantidad(!mostrarConCantidad);
  };

  const classes = useStyles();

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <Titulo>Libro de Ordenes</Titulo>

            <div className={classes.root}>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs alignItems={"center"}>
                  <Paper className={classes.paper}>
                    <label for="dfecha">Período {""}</label>
                    <TextField
                      style={{ flex: "1" }}
                      type="date"
                      //error={errores.fecha && true}
                      id="dfecha"
                      name="dfecha"
                      //value={fecha}
                      //onChange={handleChange}
                      //onBlur={handleBlur}
                      //helperText={errores.fecha}
                      variant="outlined"
                      size="small"
                    />
                    {" - "}
                    <TextField
                      style={{ flex: "1" }}
                      type="date"
                      //error={errores.fecha && true}
                      id="hfecha"
                      name="hfecha"
                      //value={fecha}
                      //onChange={handleChange}
                      //onBlur={handleBlur}
                      //helperText={errores.fecha}
                      variant="outlined"
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    <Grid container>
                      Par
                      <SelectPar1 />
                      {"/"}
                      <SelectPar2 />
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              {/* <label for="cbox1">
                          Ocultar monedas sin balance {""}
                        </label>
                        <input
                          type="checkbox"
                          id="cbox1"
                          checked={mostrarConCantidad}
                          onChange={toggleMostrarConCantidad}
                        /> */}
            </div>
            <div></div>
            <div className="bg-white">
              <Tabla>
                <thead>
                  <th>Fecha</th>
                  <th>Orden</th>
                  <th>Par</th>
                  <th>Precio</th>
                  <th>Total Compra</th>
                  <th>Total Compra USDT</th>
                </thead>
                {/* <tfoot>
                  <tr>
                    <td colSpan="3">Totales</td>
                    <td>
                      <NumberFormat
                        value={totales.compra}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={8}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <CeldaNumero>{value}</CeldaNumero>
                        )}
                      />
                    </td>
                    <td>
                      <NumberFormat
                        value={totales.actual}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={8}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <CeldaNumero>{value}</CeldaNumero>
                        )}
                      />
                    </td>
                    <td>
                      <NumberFormat
                        value={totales.posicion}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        suffix={" %"}
                        renderText={(value) =>
                          totales.posicion > 0 ? (
                            <CeldaPosicion positivo>{value}</CeldaPosicion>
                          ) : (
                            <CeldaPosicion>{value}</CeldaPosicion>
                          )
                        }
                      />
                    </td>
                    <td></td>
                  </tr>
                </tfoot> */}
                <tbody>
                  {libroOrdenes.length > 0 ? (
                    libroOrdenes.map((orden, index) => (
                      <tr key={index}>
                        <td>{orden.fecha}</td>
                        <td>{orden.orden}</td>
                        <td>
                          {orden.moneda_sigla}/{orden.par_sigla}
                        </td>
                        <td>{orden.precio}</td>
                        <td>{orden.total}</td>
                        <td>{orden.totalUSD}</td>
                      </tr>
                      //<ListadoOrdenes key={index} moneda={moneda} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{mensaje}</td>
                    </tr>
                  )}
                </tbody>
              </Tabla>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
