'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image'
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm, SubmitHandler } from 'react-hook-form';


function InputFileUpload({ onFormSubmit }) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const accessToken = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:3000/uploadPic", {
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

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setLoggedIn(false);
            return;
        }
        fetch('http://localhost:3000/pics', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        }).then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [isFormSubmit])

    if (!isLoggedIn) {
        return router.push('/auth/login');
    }
    if (isLoading) return <p>Loading...</p>
    if (!data || (data && !data.data)) return <p>No profile data</p>

    return (
        <Stack spacing={2}>
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


