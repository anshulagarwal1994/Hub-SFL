import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import routes from "routes.js";
import styles from "assets/jss/material-dashboard-pro-react/layouts/authStyle.js";

const useStyles = makeStyles(styles);

export default function Pages(props) {

  const wrapper = React.createRef();
  
  const classes = useStyles();

  React.useEffect(() => {
    document.body.style.overflow = "unset";  
    return function cleanup() {};
  });
  
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div>
      <div className={classes.wrapper} ref={wrapper}>
        <div>
          <Switch>
            {getRoutes(routes)}
            <Redirect from="/auth" to="/auth/login-page" />
          </Switch>
        </div>
      </div>
    </div>
  );
}
