import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white h-[336px] px-4 py-6 mt-8 hidden md:block">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Section - Compact Version */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Wavelina Jewellery</h3>
          <p className="mb-3 text-sm text-gray-300">Get updates & offers straight to your inbox</p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 justify-center max-w-xs mx-auto">
            <input
              type="email"
              placeholder="Enter email"
              className="px-3 py-1.5 text-sm bg-[white] rounded-md text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Compact Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm">
          {/* Policies */}
          <div>
            <h4 className="font-medium mb-2">Our Policies</h4>
            <ul className="space-y-1">
              {[
                { title: 'Privacy Policy', path: '/privacypolicy' },
                { title: 'Refund Policy', path: '/refund-policy' },
                { title: 'Terms', path: '/terms' },
                { title: 'Shipping', path: '/shipping-policy' }
              ].map((item) => (
                <li key={item.title}>
                  <Link 
                    to={item.path} 
                    className="hover:text-amber-400 transition-colors text-gray-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-medium mb-2">Quick Links</h4>
            <ul className="space-y-1">
              {[
                { title: 'About', path: '/aboutus' },
                { title: 'Contact', path: '/contactus' },
                { title: 'Sitemap', path: '/' }
              ].map((item) => (
                <li key={item.title}>
                  <Link 
                    to={item.path} 
                    className="hover:text-amber-400 transition-colors text-gray-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compact Contact Info */}
          <div>
            <h4 className="font-medium mb-2">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">+91 73832 06760</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">care.wavelinastore@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-gray-400">© 2025 Wavelina Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;