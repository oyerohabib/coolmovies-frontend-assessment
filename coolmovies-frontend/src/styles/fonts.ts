import { Abril_Fatface, Lato } from 'next/font/google';
import localFont from 'next/font/local';

export const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-abril',
});

export const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-lato',
});

export const rocaBold = localFont({
  src: [
    {
      path: '../../public/fonts/Roca-Font/Roca-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-roca',
});

export const rocaBlack = localFont({
  src: [
    {
      path: '../../public/fonts/Roca-Font/Roca-Black.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-roca-black',
});

export const rocaRegular = localFont({
  src: [
    {
      path: '../../public/fonts/Roca-Font/Roca-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-roca-regular',
});
