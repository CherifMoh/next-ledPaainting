import '../../public/styles/header.css'
function Header() {
  return (
    <>
    <div class="utility-bar">
        <div class="utility-bar--container">
            <div class="utility-bar--icons-container">
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img class="utility-bar--icons" src="assets/Instagram.png" />
                </a>
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img class="utility-bar--icons" src="assets/tiktok.png" />
                </a>
            </div>
            <h5>Free shipping WORLDWIDE on all orders!</h5>
            <span>!</span>

        </div>
    </div>
    <header>
        <img src="assets/burger.png" class="burger-button" />
        <a href="index.html">
          <img src="assets/logo.png" class="header--logo m-auto " />
        </a>
        <div class="side-menu-shadow"></div>
        <div class="side-menu">
            <section class="side-menu--top">
                <a href="index.html">Luminous Frames</a>
                <a href="faq.html">FAQS</a>
                <a href="contact.html">Contact Us</a>
            </section>
            <section class="side-menu--low">
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img class="utility-bar--icons" src="assets/Instagram.png" />                 
                </a>
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img class="utility-bar--icons" src="assets/tiktok.png" />
                </a>
            </section>
        </div>
        <nav>
            <a href="index.html">Luminous Frames</a>
            <a href="faq.html">FAQS</a>
            <a href="contact.html">Contact Us</a>
        </nav>
    </header>
    </>
  )
}

export default Header