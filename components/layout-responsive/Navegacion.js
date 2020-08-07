import React, { useContext } from "react";
import Link from "next/link";
import Usuario from "./Usuario";
import { FirebaseContext } from "../../firebase";

const Navegacion = () => {
  const { usuario, firebase } = useContext(FirebaseContext);
  return (
    <div className="nav-btn">
      <div className="nav-links">
        <ul>
          <li className="nav-link" style={{ "--i": ".6s" }}>
            <Link href="/">
              <a>Inicio</a>
            </Link>
          </li>
          {usuario && (
            <>
              <li className="nav-link" style={{ "--i": ".85s" }}>
                <Link href="/billetera">
                  <a>
                    Billetera<i className="fas fa-caret-down"></i>
                  </a>
                </Link>
                <div className="dropdown">
                  <ul>
                    <li className="dropdown-link">
                      <Link href="/billetera">
                        <a>Ver Billetera</a>
                      </Link>
                    </li>
                    <li className="dropdown-link">
                      <Link href="/nueva-moneda">
                        <a>Cargar Moneda</a>
                      </Link>
                    </li>
                    {/* <li className="dropdown-link">
                      <a href="#">
                        Link 3<i className="fas fa-caret-down"></i>
                      </a>
                      <div className="dropdown second">
                        <ul>
                          <li className="dropdown-link">
                            <a href="#">Link 1</a>
                          </li>
                          <li className="dropdown-link">
                            <a href="#">Link 2</a>
                          </li>
                          <li className="dropdown-link">
                            <a href="#">Link 3</a>
                          </li>
                          <li className="dropdown-link">
                            <a href="#">
                              More<i className="fas fa-caret-down"></i>
                            </a>
                            <div className="dropdown second">
                              <ul>
                                <li className="dropdown-link">
                                  <a href="#">Link 1</a>
                                </li>
                                <li className="dropdown-link">
                                  <a href="#">Link 2</a>
                                </li>
                                <li className="dropdown-link">
                                  <a href="#">Link 3</a>
                                </li>
                                <div className="arrow"></div>
                              </ul>
                            </div>
                          </li>
                          <div className="arrow"></div>
                        </ul>
                      </div>
                    </li>*/}
                    <div className="arrow"></div>
                  </ul>
                </div>
              </li>
              <li className="nav-link" style={{ "--i": ".85s" }}>
                <Link href="#">
                  <a>
                    Alarmas<i className="fas fa-caret-down"></i>
                  </a>
                </Link>
                <div className="dropdown">
                  <ul>
                    <li className="dropdown-link">
                      <Link href="/nueva-alarma">
                        <a>Crear Alarma</a>
                      </Link>
                    </li>
                    <div className="arrow"></div>
                  </ul>
                </div>
              </li>
            </>
          )}
          <li className="nav-link" style={{ "--i": "1.35s" }}>
            <Link href="/nosotros">
              <a>Nosotros</a>
            </Link>
          </li>
        </ul>
      </div>

      <Usuario />
    </div>
  );
};

export default Navegacion;
