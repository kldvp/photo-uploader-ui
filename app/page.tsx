import { Link } from '@mui/material';
import Nextlink from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Hello world</h1>
      <span>
        Click here to access your gallery :
        <Link component={Nextlink} href="/gallery" className="self-center">
          Gallery
        </Link>
      </span>
    </>
  );
}
