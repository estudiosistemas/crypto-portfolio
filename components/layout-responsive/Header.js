import React, { useContext } from "react";
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import Navegacion from "./Navegacion";

import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { usuario, firebase } = useContext(FirebaseContext);
  return (
    <header>
      <div className="container">
        <input type="checkbox" name="" id="check" />

        <div className="logo-container">
          <h3 className="logo">
            Crypto<span>Portfolio</span>
          </h3>
        </div>

        <Navegacion />

        <div className="hamburger-menu-container">
          <div className="hamburger-menu">
            <div></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
