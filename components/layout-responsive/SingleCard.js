import React from "react";
import styled from "@emotion/styled";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 70,
    height: 70,
  },
}));

const CeldaPosicion = styled.div`
  color: ${(props) => (props.positivo ? "green" : "red")};
`;

const SingleCard = ({ moneda }) => {
  const classes = useStyles();

  const {
    id,
    logo,
    sigla,
    nombre,
    valor,
    valoralto24hs,
    valorbajo24hs,
    cambio24hs,
    cambioporc24hs,
  } = moneda;

  return (
    <Grid item xs>
      <Card className={classes.root} variant="outlined">
        {/* <CardMedia className={classes.cover} image={logo} title="Logo cripto" /> */}
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {`${sigla}/USD`}
          </Typography>

          <NumberFormat
            value={valor}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            renderText={(value) => (
              <Typography variant="h5" component="h2">
                $ {value}
              </Typography>
            )}
          />

          <NumberFormat
            value={cambioporc24hs}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            suffix={" %"}
            renderText={(value) =>
              cambioporc24hs > 0 || cambioporc24hs == 0 ? (
                <CeldaPosicion positivo>
                  <Typography variant="body2" component="p">
                    {`${value} % (${cambio24hs})`}
                  </Typography>
                </CeldaPosicion>
              ) : (
                <CeldaPosicion>
                  <Typography variant="body2" component="p">
                    {`${value} % (${cambio24hs})`}
                  </Typography>
                </CeldaPosicion>
              )
            }
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SingleCard;
