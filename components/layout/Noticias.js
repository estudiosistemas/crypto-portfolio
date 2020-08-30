import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const url =
      "https://cryptopanic.com/api/v1/posts/?auth_token=981fbf87cb82685d293b4d1d0861967d736e5012&public=true&kind=news&region=es,en";

    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setNoticias(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {noticias.length == 0 ? null : (
        <List className={classes.root}>
          {noticias.results.map((noticia, index) => (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {noticia.created_at}{" "}
                  </Typography>
                </ListItemAvatar>
                <ListItemText
                  primary={noticia.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {noticia.domain}
                      </Typography>
                      {" - " + noticia.slug}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      )}
    </>
  );
};

export default Noticias;
