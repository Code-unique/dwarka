'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head />
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        <SessionProvider>
          {!isAdminRoute && <Header />}
          {isAdminRoute && (
            <nav className="flex gap-8 p-6 bg-black/70 backdrop-blur-lg text-sm text-[var(--color-accent)] border-b border-[var(--color-accent)]">
              <a href="/admin" className="hover:text-white font-semibold">Dashboard</a>
              <a href="/admin/products" className="hover:text-white">Products</a>
              <a href="/admin/orders" className="hover:text-white">Orders</a>
              <a href="/admin/users" className="hover:text-white">Users</a>
            </nav>
          )}

          {/* Animated Page Wrapper */}
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="min-h-screen px-4 md:px-8"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </SessionProvider>
      </body>
    </html>
  );
}
