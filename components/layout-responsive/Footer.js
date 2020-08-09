import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="left-col">
          {/* <img src="logo.png" className="logo" /> */}
          <div className="social-media">
            <a href="mailto:estudiosistemas@gmail.com" target="_blank">
              <i className="fas fa-at" />
            </a>
            <a
              href="https://www.facebook.com/mcosta.estudiosistemas/"
              target="_blank"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a href="https://twitter.com/mc_costa" target="_blank">
              <i className="fab fa-twitter" />
            </a>
            <a
              href="https://www.instagram.com/estudiosistemas/"
              target="_blank"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://www.youtube.com/user/estudiosistemas"
              target="_blank"
            >
              <i className="fab fa-youtube" />
            </a>
            <a
              href="https://www.linkedin.com/in/mauricio-costa-07044b38/"
              target="_blank"
            >
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
          <p className="rights-text">
            © {new Date().getFullYear()} Mauricio Costa. All Rights Reserved.
          </p>
        </div>
        <div className="right-col">
          <h3>Contribuciones</h3>
          <div className="border" />
          <br />
          <p>
            <strong>ETH: </strong>0x1B21EF011CcEfB7e55C8bA9F8513B3f88CD22Fd6
          </p>
          <br />
          <p>
            <strong>BAT: </strong>0x89dCE8bA0e031CD97DC9BFb36581D24519dE02C5
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
