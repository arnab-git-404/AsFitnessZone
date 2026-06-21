"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { Button } from "primereact/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/bmi-calculator", label: "BMI Calculator" },
    { href: "/gallery", label: "Gallery" },
    { href: "/membership", label: "Membership" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-10 py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center group cursor-pointer">
          <div className="rounded-lg bg-primary p-2 transition-transform group-hover:scale-110">
            <Dumbbell className="h-10 w-10 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            AsFitness
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-m font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button className="p-button-outlined cursor-pointer" label="Login" />
          </Link>
          <Link href="/signup">
            <Button className="bg-primary border-primary text-white hover:bg-primary/90 cursor-pointer" label="Join Now" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full p-button-outlined cursor-pointer" label="Login" />
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary border-primary text-white hover:bg-primary/90 cursor-pointer" label="Join Now" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
