"use client";

import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "font-medium text-lg" }: LogoProps) {
  return (
    <Link href="/" className={className}>
      Backchannel
    </Link>
  );
}