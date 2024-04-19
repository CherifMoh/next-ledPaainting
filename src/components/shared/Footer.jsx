import Link from 'next/link'
import '../../styles/shared/footer.css'
function Footer() {
  return (
    <div className="footer">
            <div className="footer-container">
                <div className="footer-header">
                    <h2 className="footer-links text-2xl">Quick links</h2>
                    <ul>
                        <li><Link href="">Contact Us</Link></li>
                        <li><Link href="">F.A.Q.s</Link></li>
                        <li><Link href="">Privacy Policy</Link></li>
                        <li><Link href="">Shipping Policy</Link></li>
                        <li><Link href="">Terms of Service</Link></li>
                    </ul>
                    <h2 className="footer-email-title text-2xl">Get updates on our new releases!</h2>
                    <input className="footer-email" type="email" placeholder="Email" />
                </div>
            </div>
        </div>
  )
}

export default Footer