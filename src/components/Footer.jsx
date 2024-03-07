import '../../public/styles/footer.css'
function Footer() {
  return (
    <div class="footer">
            <div class="footer-container">
                <div class="footer-header">
                    <h2 class="footer-links text-2xl">Quick links</h2>
                    <ul>
                        <li><a href="">Contact Us</a></li>
                        <li><a href="">F.A.Q.s</a></li>
                        <li><a href="">Privacy Policy</a></li>
                        <li><a href="">Shipping Policy</a></li>
                        <li><a href="">Terms of Service</a></li>
                    </ul>
                    <h2 class="footer-email-title text-2xl">Get updates on our new releases!</h2>
                    <input class="footer-email" type="email" placeholder="Email" />
                </div>
            </div>
        </div>
  )
}

export default Footer