import { Button, Stack, TextField, Link } from "@mui/material";
import Nextlink from 'next/link';


export default function Signin() {
  return (
    <Stack spacing={2} className="w-full max-w-xs">
    <h1>Create Account</h1>
    <TextField label="Email" variant="outlined" type="email"></TextField>
    <TextField label="Password" variant="outlined" type="password"></TextField>
    <Button variant="contained">Signup</Button>
    <span>
    Already have an account?  
    <Link component={Nextlink} href="/auth/signin" className="self-center">
        Signin
    </Link>
    </span>
    </Stack>
  );
}
