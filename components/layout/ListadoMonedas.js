import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const CeldaNumero = styled.div`
  text-align: right;
`;

const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;

const ListadoMonedas = ({ moneda }) => {
  const {
    id,
    sigla,
    nombre,
    cantidad,
    valorcompra,
    cotizacion,
    valores,
    exchange,
  } = moneda;
  const { usuario, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  const borrarMoneda = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    try {
      await firebase.db.collection("billetera").doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModificar = () => {
    router.push("/editar-monedas[id]", `/editar-monedas/${id}`);
    setAnchorEl(null);
  };

  const handleOrdenes = () => {
    router.push("/libro-ordenes[id]", `/libro-ordenes/${id}`);
    setAnchorEl(null);
  };

  return (
    <tr>
      <td data-th="Moneda">
        <div
          css={css`
            color: blue;
            cursor: pointer;
          `}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {sigla} {nombre}
        </div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleModificar}>
            <Typography variant="caption">Modificar {sigla}</Typography>{" "}
          </MenuItem>
          <MenuItem onClick={handleOrdenes}>
            <Typography variant="caption">Libro de Ordenes {sigla}</Typography>
          </MenuItem>
        </Menu>
      </td>
      <td data-th="Cantidad">
        <NumberFormat
          value={cantidad}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Cotización USD">
        <NumberFormat
          value={valores.cotizacionUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Valor Compra">
        <NumberFormat
          value={valorcompra}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Valor Actual">
        <NumberFormat
          value={valores.totalUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={8}
          fixedDecimalScale={true}
          renderText={(value) => <CeldaNumero>{value}</CeldaNumero>}
        />
      </td>
      <td data-th="Posición">
        <NumberFormat
          value={valores.posicionUSDT}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          suffix={" %"}
          renderText={(value) =>
            valores.posicionUSDT > 0 || valores.posicionUSDT == 0 ? (
              <CeldaPosicion positivo>{value}</CeldaPosicion>
            ) : (
              <CeldaPosicion>{value}</CeldaPosicion>
            )
          }
        />
      </td>
      <td data-th="Exchange/Wallet">{exchange}</td>
      <td data-th="Acciones">
        {usuario && (
          <>
            <Link href="/comprar-moneda[id]" as={`/comprar-moneda/${id}`}>
              <a
                css={css`
                  text-decoration: none;
                  color: blue;
                  cursor: pointer;
                  margin-right: 1rem;
                `}
              >
                Comprar
              </a>
            </Link>
            <Link href="/vender-moneda[id]" as={`/vender-moneda/${id}`}>
              <a
                css={css`
                  text-decoration: none;
                  color: blue;
                  cursor: pointer;
                  margin-right: 1rem;
                `}
              >
                Vender
              </a>
            </Link>
            <button onClick={borrarMoneda}>Borrar</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ListadoMonedas;
