import React from "react";
import Header from "./Header";
import { Global, css } from "@emotion/core";
import Head from "next/head";
import Link from "next/link";
import Footer from "./Footer";

const Layout = (props) => {
  return (
    <>
      <Global
        styles={css`
          :root {
            --gris: #3d3d3d;
            --gris2: #6f6f6f;
            --gris3: #e1e1e1;
            --naranja: #da552f;
            --grisazulado: #ecf0f3;
          }

          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }

          body {
            font-family: "Poppins", sans-serif;
            /* overflow: hidden; */
          }

          ul {
            list-style: none;
          }

          a {
            text-decoration: none;
          }

          header {
            position: sticky;
            top: 0px;
            background-color: #60b4df;
            width: 100%;
            z-index: 1000;
          }

          section {
            position: relative;
            height: calc(100vh - 3rem);
            width: 100%;
            /* background: url("/static/img/cryptomonedas.png") no-repeat top
              center / cover; */
            /* overflow: hidden; */
            background-color: #f5f5f5;
          }

          .overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: ---grisazulado;
          }

          .container {
            max-width: 90rem;
            padding: 0 2rem;
            margin: 0 auto;
            display: flex;
            position: relative;
            height: 70px;
          }

          .logo-container {
            flex: 1;
            display: flex;
            align-items: center;
          }

          .nav-btn {
            flex: 3;
            display: flex;
            align-items: center;
          }

          .nav-links {
            flex: 2;
          }

          .log-sign {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;

            p {
              color: #fff;
            }
          }

          .logo {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            line-height: 3rem;
          }

          .logo span {
            font-weight: 300;
          }

          .btn {
            display: inline-block;
            padding: 0.5rem 1.3rem;
            font-size: 0.8rem;
            border: 2px solid #fff;
            border-radius: 2rem;
            line-height: 1;
            margin: 0 0.2rem;
            transition: 0.3s;
            text-transform: uppercase;
          }

          .btn.solid,
          .btn.transparent:hover {
            background-color: #fff;
            color: #69bde7;
          }

          .btn.transparent,
          .btn.solid:hover {
            background-color: transparent;
            color: #fff;
          }

          .nav-links > ul {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .nav-link {
            position: relative;
          }

          .nav-link > a {
            line-height: 3rem;
            color: #fff;
            padding: 0 0.8rem;
            letter-spacing: 1px;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: 0.5s;
          }

          .nav-link > a > i {
            margin-left: 0.2rem;
          }

          .nav-link:hover > a {
            transform: scale(1.1);
          }

          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            width: 10rem;
            transform: translateY(10px);
            opacity: 0;
            pointer-events: none;
            transition: 0.5s;
          }

          .dropdown ul {
            position: relative;
          }

          .dropdown-link > a {
            display: flex;
            background-color: #fff;
            color: #3498db;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            align-items: center;
            justify-content: space-between;
            transition: 0.3s;
          }

          .dropdown-link:hover > a {
            background-color: #3498db;
            color: #fff;
          }

          .dropdown-link:not(:nth-last-of-type(2)) {
            border-bottom: 1px solid #efefef;
          }

          .dropdown-link i {
            transform: rotate(-90deg);
          }

          .arrow {
            position: absolute;
            width: 11px;
            height: 11px;
            top: -5.5px;
            left: 32px;
            background-color: #fff;
            transform: rotate(45deg);
            cursor: pointer;
            transition: 0.3s;
            z-index: -1;
          }

          .dropdown-link:first-of-type:hover ~ .arrow {
            background-color: #3498db;
          }

          .dropdown-link {
            position: relative;
          }

          .dropdown.second {
            top: 0;
            left: 100%;
            padding-left: 0.8rem;
            cursor: pointer;
            transform: translateX(10px);
          }

          .dropdown.second .arrow {
            top: 10px;
            left: -5.5px;
          }

          .nav-link:hover > .dropdown,
          .dropdown-link:hover > .dropdown {
            transform: translate(0, 0);
            opacity: 1;
            pointer-events: auto;
          }

          .hamburger-menu-container {
            flex: 1;
            display: none;
            align-items: center;
            justify-content: flex-end;
          }

          .hamburger-menu {
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .hamburger-menu div {
            width: 1.6rem;
            height: 3px;
            border-radius: 3px;
            background-color: #fff;
            position: relative;
            z-index: 1001;
            transition: 0.5s;
          }

          .hamburger-menu div:before,
          .hamburger-menu div:after {
            content: "";
            position: absolute;
            width: inherit;
            height: inherit;
            background-color: #fff;
            border-radius: 3px;
            transition: 0.5s;
          }

          .hamburger-menu div:before {
            transform: translateY(-7px);
          }

          .hamburger-menu div:after {
            transform: translateY(7px);
          }

          #check {
            position: absolute;
            top: 50%;
            right: 1.5rem;
            transform: translateY(-50%);
            width: 2.5rem;
            height: 2.5rem;
            z-index: 90000;
            cursor: pointer;
            opacity: 0;
            display: none;
          }

          #check:checked ~ .hamburger-menu-container .hamburger-menu div {
            background-color: transparent;
          }

          #check:checked
            ~ .hamburger-menu-container
            .hamburger-menu
            div:before {
            transform: translateY(0) rotate(-45deg);
          }

          #check:checked ~ .hamburger-menu-container .hamburger-menu div:after {
            transform: translateY(0) rotate(45deg);
          }

          @keyframes animation {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }

          @media (max-width: 920px) {
            .hamburger-menu-container {
              display: flex;
            }

            #check {
              display: block;
            }

            .nav-btn {
              position: fixed;
              height: calc(100vh - 3rem);
              top: 3rem;
              left: 0;
              width: 100%;
              background-color: #69bde7;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              overflow-x: hidden;
              overflow-y: auto;
              transform: translateX(100%);
              transition: 0.65s;
            }

            #check:checked ~ .nav-btn {
              transform: translateX(0);
            }

            #check:checked ~ .nav-btn .nav-link,
            #check:checked ~ .nav-btn .log-sign {
              animation: animation 0.5s ease forwards var(--i);
            }

            .nav-links {
              flex: initial;
              width: 100%;
            }

            .nav-links > ul {
              flex-direction: column;
            }

            .nav-link {
              width: 100%;
              opacity: 0;
              transform: translateY(15px);
            }

            .nav-link > a {
              line-height: 1;
              padding: 1.6rem 2rem;
            }

            .nav-link:hover > a {
              transform: scale(1);
              background-color: #50a9d6;
            }

            .dropdown,
            .dropdown.second {
              position: initial;
              top: initial;
              left: initial;
              transform: initial;
              opacity: 1;
              pointer-events: auto;
              width: 100%;
              padding: 0;
              background-color: #3183ac;
              display: none;
            }

            .nav-link:hover > .dropdown,
            .dropdown-link:hover > .dropdown {
              display: block;
            }

            .nav-link:hover > a > i,
            .dropdown-link:hover > a > i {
              transform: rotate(360deg);
            }

            .dropdown-link > a {
              background-color: transparent;
              color: #fff;
              padding: 1.2rem 2rem;
              line-height: 1;
            }

            .dropdown.second .dropdown-link > a {
              padding: 1.2rem 2rem 1.2rem 3rem;
            }

            .dropdown.second .dropdown.second .dropdown-link > a {
              padding: 1.2rem 2rem 1.2rem 4rem;
            }

            .dropdown-link:not(:nth-last-of-type(2)) {
              border-bottom: none;
            }

            .arrow {
              z-index: 1;
              background-color: #69bde7;
              left: 10%;
              transform: scale(1.1) rotate(45deg);
              transition: 0.5s;
            }

            .nav-link:hover .arrow {
              background-color: #50a9d6;
            }

            .dropdown .dropdown .arrow {
              display: none;
            }

            .dropdown-link:hover > a {
              background-color: #3a91bd;
            }

            .dropdown-link:first-of-type:hover ~ .arrow {
              background-color: #50a9d6;
            }

            .nav-link > a > i {
              font-size: 1.1rem;
              transform: rotate(-90deg);
              transition: 0.7s;
            }

            .dropdown i {
              font-size: 1rem;
              transition: 0.7s;
            }

            .log-sign {
              flex: initial;
              width: 100%;
              padding: 1.5rem 1.9rem;
              justify-content: flex-start;
              opacity: 0;
              transform: translateY(15px);
            }
          }
        `}
      />
      <Head>
        <title>Crypto Portfolio</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto:wght@300;400;500;700&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="/static/css/app.css" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.14.0/css/all.css"
          integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc"
          crossOrigin="anonymous"
        ></link>
        {/* <script
          src="https://kit.fontawesome.com/64d58efce2.js"
          crossorigin="anonymous"
        ></script> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <main>
        {props.children}
        {/* <section>
          <div className="overlay">{props.children}</div>
        </section> */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
