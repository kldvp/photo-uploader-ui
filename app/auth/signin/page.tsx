'use client';
import React, {SyntheticEvent, useState} from 'react';
import { Button, Stack, TextField, Link, Alert } from "@mui/material";
import Nextlink from 'next/link';
import {useRouter} from "next/navigation";



export default function Signin() {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        let res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });
        res = await res.json();
        if (res && res['access_token']) {
          localStorage.setItem('accessToken', res['access_token']);
          await router.push('/gallery');
        } else {
          setError(res['message']);
        }
    }
  return (
    <Stack spacing={2} className="w-full max-w-xs">
    <h1>Login to your account</h1>
    {error && <Alert severity="error">{error}</Alert>}
    <TextField label="Email" variant="outlined" type="email" onChange={e => setEmail(e.target.value)}></TextField>
    <TextField label="Password" variant="outlined" type="password" onChange={e => setPassword(e.target.value)}></TextField>
    <Button variant="contained" type="submit" onClick={submit}>Signin</Button>
    <span>
    Does not have an account?  
    <Link component={Nextlink} href="/auth/signup" className="self-center">
        Signup
    </Link>
    </span>
    </Stack>
  );
}