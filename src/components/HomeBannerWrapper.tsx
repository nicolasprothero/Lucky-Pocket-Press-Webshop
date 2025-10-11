"use client";
import { usePathname } from 'next/navigation';
import UpdateBanner from '@/components/UpdateBanner';

export default function HomeBannerWrapper() {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <UpdateBanner />;
}
