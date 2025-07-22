'use client';
import Link from 'next/link';
import { FaTiktok, FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#f9f8f6] text-[#3a3a2d] py-12 border-t border-[#e8e5de] mt-20 select-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center sm:text-left">
        
        {/* Brand Info */}
        <div>
          <h3 className="font-serif font-extrabold text-2xl mb-3 tracking-wide text-[#476b4b]">
            DWARKA
          </h3>
          <p className="text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
            Sustainable fashion brand from Nepal. Crafted with care using natural fabrics.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-[#d7e7ce] pb-2 inline-block">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { href: '/', label: 'Home' },
              { href: '/cart', label: 'Cart' },
              { href: '/auth/login', label: 'Login' },
              { href: '/auth/signup', label: 'Signup' },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[#5e7c60] hover:text-[#476b4b] transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-[#d7e7ce] pb-2 inline-block">
            Follow Us
          </h4>
          <ul className="flex justify-center sm:justify-start space-x-6">
            <li>
              <a
                href="https://www.tiktok.com/@dwarkaclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#5e7c60] hover:text-[#476b4b] transition-colors duration-300"
              >
                <FaTiktok size={20} /> TikTok
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#5e7c60] hover:text-[#476b4b] transition-colors duration-300"
              >
                <FaInstagram size={20} /> Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#5e7c60] hover:text-[#476b4b] transition-colors duration-300"
              >
                <FaFacebookF size={20} /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-xs text-center text-gray-400 mt-10 select-text tracking-wider font-mono">
        © {new Date().getFullYear()} DWARKA. All rights reserved.
      </div>
    </footer>
  );
}
