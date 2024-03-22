import '../styles/shared/footer.css'
function Footer() {
  return (
    <div className="footer">
            <div className="footer-container">
                <div className="footer-header">
                    <h2 className="footer-links text-2xl">Quick links</h2>
                    <ul>
                        <li><a href="">Contact Us</a></li>
                        <li><a href="">F.A.Q.s</a></li>
                        <li><a href="">Privacy Policy</a></li>
                        <li><a href="">Shipping Policy</a></li>
                        <li><a href="">Terms of Service</a></li>
                    </ul>
                    <h2 className="footer-email-title text-2xl">Get updates on our new releases!</h2>
                    <input className="footer-email" type="email" placeholder="Email" />
                </div>
            </div>
        </div>
  )
}

export default Footer