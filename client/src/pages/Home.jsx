import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import styles from './home.module.css';
import Logo from '../assets/logo.png';

const App = () => {
  useEffect(() => {
    console.log('useEffect ran');

    // Navbar shrink function
    const navbarShrink = () => {
      const navbarCollapsible = document.querySelector('#mainNav');
      if (!navbarCollapsible) return;
      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove(styles.navbarShrink);
      } else {
        navbarCollapsible.classList.add(styles.navbarShrink);
      }
    };

    // Shrink the navbar on page load
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Toggler selection
    const navbarToggler = document.querySelector(`.${styles.navbarToggler}`);
    console.log(navbarToggler); // Should log the toggler element

    // Define handleNavItemClick
    const handleNavItemClick = () => {
      console.log('Nav item clicked'); // Debug log
      if (navbarToggler) {
        navbarToggler.click(); // Toggle if visible
      }
    };

    // Responsive nav items
    const responsiveNavItems = Array.from(
      document.querySelectorAll(`#navbarResponsive .${styles.navLink}`)
    );

    // Add event listener to each responsive nav item
    responsiveNavItems.forEach((item) => item.addEventListener('click', handleNavItemClick));

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('scroll', navbarShrink);
      responsiveNavItems.forEach((item) => item.removeEventListener('click', handleNavItemClick));
    };
  }, []);

  return (
    <div id="page-top" className={styles.pageTop}>
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.mainNav}`} id="mainNav">
        <div className="container">
          <a className={`navbar-brand ${styles.navbarBrand}`} href="#page-top">
            <img src={Logo} alt="logo" style={{ height: '40px', marginRight: '10px' }} />
            NUPals
          </a>

          <button className={`navbar-toggler ${styles.navbarToggler}`} onClick={() => window.location.href = '/login'} aria-label="Login">
  <span>Login</span>
</button>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className={`navbar-nav text-uppercase ms-auto py-4 py-lg-0 ${styles.navbarNav}`}>
              <li className={`nav-item ${styles.navItem}`}><a className={`nav-link ${styles.navLink}`} href="#features">Features</a></li>
              <li className={`nav-item ${styles.navItem}`}><a className={`nav-link ${styles.navLink}`} href="#about">About</a></li>
              <li className={`nav-item ${styles.navItem}`}><a className={`nav-link ${styles.navLink}`} href="#contact">Contact</a></li>
              <li className={`nav-item ${styles.navItem}`}>
  <a className={`nav-link ${styles.navLink} btn btn-primary`} href="/login" style={{ color: 'yellow' }}>Login</a>
</li>
            </ul>
            

          </div>
        </div>
      </nav>


      {/* Masthead */}
      <header className={styles.headerMasthead}>
        <div className="container">
          <div className={styles.mastheadSubheading}>Welcome to NUPals!</div>
          <div className={styles.mastheadHeading}>Discover Your Next Campus Connection</div>
          <a className={`${styles.btnXl} btn btn-primary text-uppercase`} href="#">DOWNLOAD APK</a>
        </div>
      </header>

{/* Services */}
<section className={`${styles.pageSection} ${styles.whiteBackground} page-section`} id="features">
  <div className="container">
    <div className="text-center">
      <h2 className={styles.sectionHeading}>Features</h2>
      <h3 className={styles.sectionSubheading}>Explore what NUPals has to offer</h3>
    </div>
    <div className="row text-center">
      <div className="col-md-4">
        <span className="fa-stack fa-4x">
          <i className="bx bxs-group text-primary" style={{ fontSize: '7rem' }}></i>
        </span>
        <h4 className={`my-3 ${styles.fontMontserrat}`}>Student Matching</h4>
  <p className={`text-muted ${styles.fontMontserrat}`}>
    Connect with fellow NU students based on shared interests and hobbies.
  </p>
</div>
<div className="col-md-4">
  <span className="fa-stack fa-4x">
    <i className="bx bxs-message-rounded-detail text-primary" style={{ fontSize: '7rem' }}></i>
  </span>
  <h4 className={`my-3 ${styles.fontMontserrat}`}>Instant Messaging</h4>
  <p className={`text-muted ${styles.fontMontserrat}`}>
    Chat instantly with your matches and start building meaningful connections.
  </p>
</div>
<div className="col-md-4">
  <span className="fa-stack fa-4x">
    <i className="bx bxs-shield text-primary" style={{ fontSize: '7rem' }}></i>
  </span>
  <h4 className={`my-3 ${styles.fontMontserrat}`}>Privacy & Security</h4>
  <p className={`text-muted ${styles.fontMontserrat}`}>
    Your privacy is our priority. Rest assured your data is safe and secure.
  </p>
      </div>
    </div>
  </div>
</section>

      {/* About */}
      <section className={`${styles.pageSection} ${styles.bgLight} page-section`} id="about">
        <div className="container">
          <div className="text-center">
            <h2 className={styles.sectionHeading}>About</h2>
            <h3 className={styles.sectionSubheading}>NUPals is an exclusive social platform designed for NU students to foster collaboration and connection within the university community. With NUPals, students can match with others based on shared interests, opening up opportunities for academic partnerships, project collaborations, or simply making new friends. Our system allows you to explore common hobbies, skills, and activities while providing a secure space to message and connect with like-minded peers. </h3>
          </div>
        
        </div>
      </section>

      {/* Contact */}
      <section className={`${styles.pageSection} ${styles.contactBackground} page-section`} id="contact">
        <div className="container">
          <div className="text-center">
          <h2 className={styles.sectionHeading} style={{ color: 'white' }}>Contact Us</h2>
          <h3 className={styles.sectionSubheading} style={{ color: 'white', marginBottom: '7px' }}>nupalsbulldogs@outlook.com</h3>
<h3 className={styles.sectionSubheading} style={{ color: 'white' }}>nupalsbulldogs@gmail.com</h3>

          </div>

        </div>
      </section>
 
      {/* Footer */}
      <footer className={`${styles.footer} footer py-4`}>
        <div className="container">
          <div className="row align-items-center">
            <div className={"col-lg-4 text-lg-start  "}>Copyright &copy;NU Pals 2024</div>
            <div className="col-lg-4 my-3 my-lg-0">
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <div className="col-lg-4 text-lg-end">
            <a className={`text-decoration-none me-3 ${styles.fontMontserrat}`} href="#features">FEATURES</a>
            <a className={`text-decoration-none me-3 ${styles.fontMontserrat}`} href="#about">ABOUT</a>
              <a className={`text-decoration-none me-3 ${styles.fontMontserrat}`} href="#contact">CONTACT</a>
              <a className={`text-decoration-none me-3 ${styles.fontMontserrat}`} href="/login">LOGIN</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
