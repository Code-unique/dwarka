'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Home,
  Settings,
  PackageSearch,
} from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchCart() {
      if (status === 'authenticated') {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setCartCount(data.items?.length || 0);
      }
    }
    fetchCart();
  }, [status]);

  const logout = () => {
    setMobileOpen(false);
    signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string | undefined) =>
    name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  const NavItem = ({
    href,
    label,
    icon,
    onClick,
  }: {
    href?: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }) => {
    const content = (
      <span className="flex items-center gap-2 px-4 py-2 hover:bg-[#edf3ea] rounded-md transition-colors">
        {icon} {label}
      </span>
    );
    return href ? (
      <Link href={href} onClick={() => setMobileOpen(false)}>
        {content}
      </Link>
    ) : (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fefdfb] shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-serif font-bold text-[#3a3a2d] tracking-widest hover:opacity-80"
        >
          DWARKA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-[#444] items-center">
          <Link href="/" className="hover:text-[#5e7c60] transition">
            Home
          </Link>
          <Link href="/cart" className="hover:text-[#5e7c60] transition flex items-center gap-1">
            <ShoppingCart size={16} />
            Cart
            <span className="ml-1 text-xs bg-[#d7e7ce] text-[#476b4b] px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </Link>
          <Link href="/wishlist" className="hover:text-[#5e7c60] transition flex items-center gap-1">
            <Heart size={16} /> Wishlist
          </Link>
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className="hover:text-[#5e7c60] transition flex items-center gap-1"
            >
              <Settings size={16} /> Admin
            </Link>
          )}
          {session && (
            <>
              <Link
                href="/account/orders"
                className="hover:text-[#5e7c60] transition flex items-center gap-1"
              >
                <PackageSearch size={16} /> Orders
              </Link>
              <Link
                href="/profile"
                className="hover:text-[#5e7c60] transition flex items-center gap-1"
              >
                <User size={16} /> Profile
              </Link>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
              {session.user?.avatar ? (
  <img
    src={session.user.avatar}
    alt="avatar"
    className="ml-4 w-8 h-8 rounded-full object-cover"
  />
) : (
  <div className="ml-4 bg-[#5e7c60] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
    {getInitials(session.user?.name)}
  </div>
)}

            </>
          )}
          {!session && status !== 'loading' && (
            <>
              <Link href="/auth/login" className="hover:text-[#5e7c60] transition">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:text-[#5e7c60] transition">
                Signup
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(true)} className="md:hidden">
          <Menu size={24} />
        </button>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#fefdfb] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-xl font-semibold text-[#3a3a2d]">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-4 pt-4 text-[#333] text-sm font-medium space-y-2">
          <NavItem href="/" label="Home" icon={<Home size={16} />} />
          <NavItem
            href="/cart"
            label={`Cart (${cartCount})`}
            icon={<ShoppingCart size={16} />}
          />
          {session && (
            <>
              <NavItem href="/wishlist" label="Wishlist" icon={<Heart size={16} />} />
              <NavItem href="/profile" label="Profile" icon={<User size={16} />} />
              <NavItem href="/account/orders" label="My Orders" icon={<PackageSearch size={16} />} />
            </>
          )}
          {session?.user?.isAdmin && (
            <NavItem href="/admin" label="Admin Panel" icon={<Settings size={16} />} />
          )}
          {!session && status !== 'loading' && (
            <>
              <NavItem href="/auth/login" label="Login" icon={<User size={16} />} />
              <NavItem href="/auth/signup" label="Signup" icon={<User size={16} />} />
            </>
          )}
          {session && <NavItem label="Logout" icon={<LogOut size={16} />} onClick={logout} />}
        </div>
        {session?.user?.name && (
  <div className="p-4 flex items-center mt-auto border-t">
    {session.user.avatar ? (
      <img
        src={session.user.avatar}
        alt="avatar"
        className="w-9 h-9 rounded-full object-cover"
      />
    ) : (
      <div className="bg-[#5e7c60] text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold">
        {getInitials(session.user.name)}
      </div>
    )}
    <span className="ml-3 font-medium text-[#333]">{session.user.name}</span>
  </div>
)}

      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
