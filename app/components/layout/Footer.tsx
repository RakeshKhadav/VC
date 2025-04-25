"use client";

import Link from "next/link";
import { useMemo } from "react";

export default function Footer() {
  // Fix hydration mismatch by ensuring date calculation is consistent
  // and component is fully client-side rendered
  const currentYear = useMemo(() => 
    // Force UTC timezone to prevent timezone differences between server and client
    new Date().toLocaleString('en-US', {timeZone: 'UTC', year: 'numeric'})
  , []);
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-xl mb-4">Backchannel</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Building transparency in the venture capital ecosystem, one review at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Home</Link></li>
              <li><Link href="/reviews" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Explore Reviews</Link></li>
              <li><Link href="/reviews/new" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Write a Review</Link></li>
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Careers</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {currentYear} Backchannel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}