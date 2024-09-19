import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import styles from './home.module.css'; // Updated import
import Logo from '../assets/logo.png';

const App = () => {
  useEffect(() => {
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

    // Navbar toggler and responsive nav items
    const navbarToggler = document.querySelector(`.${styles.navbarToggler}`);
    const responsiveNavItems = Array.from(
      document.querySelectorAll(`#navbarResponsive .${styles.navLink}`)
    );

    // Click handler function
    const handleNavItemClick = () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    };

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
      <nav className={`${styles.mainNav} navbar navbar-expand-lg navbar-dark fixed-top`} id="mainNav">
        <div className="container">
          <a className={`navbar-brand d-flex align-items-center ${styles.navbarBrand}`} href="#page-top">
            <img src={Logo} alt="logo" style={{ height: '40px', marginRight: '10px' }} />
            NUPals
          </a>
         
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className={`navbar-nav text-uppercase ms-auto py-4 py-lg-0 ${styles.navbarNav}`}>
              <li className={`${styles.navItem} nav-item`}><a className={`${styles.navLink} nav-link`} href="#services">Features</a></li>
              <li className={`${styles.navItem} nav-item`}><a className={`${styles.navLink} nav-link`} href="#about">About</a></li>
              <li className={`${styles.navItem} nav-item`}><a className={`${styles.navLink} nav-link`} href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Masthead */}
      <header className={styles.headerMasthead}>
        <div className="container">
          <div className={styles.mastheadSubheading}>Welcome to NUPals!</div>
          <div className={styles.mastheadHeading}>Discover Your Next Campus Connection</div>
          <a className={`${styles.btnXl} btn btn-primary text-uppercase`} href="#services">Get Started</a>
        </div>
      </header>

      {/* Services */}
      <section className={`${styles.pageSection} ${styles.whiteBackground} page-section`} id="services">
        <div className="container">
          <div className="text-center">
            <h2 className={styles.sectionHeading}>Features</h2>
            <h3 className={styles.sectionSubheading}>Explore what NUPals has to offer</h3>
          </div>
          <div className="row text-center">
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-primary"></i>
                <i className="fas fa-user-friends fa-stack-1x fa-inverse"></i>
              </span>
              <h4 className="my-3">Student Matching</h4>
              <p className="text-muted">Connect with fellow NU students based on shared interests and hobbies.</p>
            </div>
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-primary"></i>
                <i className="fas fa-comments fa-stack-1x fa-inverse"></i>
              </span>
              <h4 className="my-3">Instant Messaging</h4>
              <p className="text-muted">Chat instantly with your matches and start building meaningful connections.</p>
            </div>
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                <i className="fas fa-circle fa-stack-2x text-primary"></i>
                <i className="fas fa-shield-alt fa-stack-1x fa-inverse"></i>
              </span>
              <h4 className="my-3">Privacy & Security</h4>
              <p className="text-muted">Your privacy is our priority. Rest assured your data is safe and secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={`${styles.pageSection} ${styles.bgLight} page-section`} id="about">
        <div className="container">
          <div className="text-center">
            <h2 className={styles.sectionHeading}>About</h2>
            <h3 className={styles.sectionSubheading}>NUPals is</h3>
            <a className={`${styles.btnXl} btn btn-primary text-uppercase`} href="#services">Download Now</a>
          </div>
        
        </div>
      </section>

      {/* Contact */}
      <section className={`${styles.pageSection} ${styles.contactBackground} page-section`} id="contact">
        <div className="container">
          <div className="text-center">
            <h2 className={styles.sectionHeading}>Contact Us</h2>
            <h3 className={styles.sectionSubheading}>nupalsbulldogs@gmail.com</h3>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={`${styles.footer} footer py-4`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 text-lg-start">Copyright &copy;NU Pals 2024</div>
            <div className="col-lg-4 my-3 my-lg-0">
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a className={`btn ${styles.btnSocial} mx-2`} href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <div className="col-lg-4 text-lg-end">
              <a className="link-dark text-decoration-none me-3" href="#!">Privacy Policy</a>
              <a className="link-dark text-decoration-none" href="#!">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
