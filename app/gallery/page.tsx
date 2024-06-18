'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image'
import { Stack, Alert, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as deploy from '../utils/constants';
import Nextlink from 'next/link';

function InputFileUpload({ onFormSubmit }) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const accessToken = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch(`${deploy.config.backendUrl}/uploadPic`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        reset();
        onFormSubmit();
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} />
                <Button variant="contained" type="submit">Upload</Button>
                {/* <button type="submit">Submit</button> */}
            </form>
        </div>
    );
}




export default function Gallery() {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const router = useRouter();

    const handleFormSubmit = () => {
        setIsFormSubmit(!isFormSubmit);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/auth/signin');
        return;
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setLoggedIn(false);
            return;
        }
        fetch(`${deploy.config.backendUrl}/pics`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 401) {
                    setLoggedIn(false);
                } else {
                    setData(data);
                    setLoading(false);
                }
            })
    }, [isFormSubmit])

    if (!isLoggedIn) {
        return (
            <span>
                Click here to login and access your data :
                <Link component={Nextlink} href="/auth/signin" className="self-center">
                    Signin
                </Link>
            </span>
        )
    }
    if (isLoading) return <p>Loading...</p>
    if (!data || (data && !data.data)) {
        return (
            <Stack spacing={2}>
                <Button variant="outlined" onClick={handleLogout} startIcon={<LogoutIcon />}>
                    Logout
                </Button>
                <Alert severity="info">No profile data found. Please upload pics</Alert>
                <InputFileUpload onFormSubmit={handleFormSubmit}></InputFileUpload>
            </Stack>
        )
    }

    return (
        <Stack spacing={2}>
            <Button variant="outlined" onClick={handleLogout} startIcon={<LogoutIcon />}>
                    Logout
            </Button>
            <InputFileUpload onFormSubmit={handleFormSubmit}></InputFileUpload>
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {data.data.map((item) => (
                    <ImageListItem key={item.id}>
                        <img
                            src={`${item.url}`}
                            alt={item.filename}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Stack>
    )
}


