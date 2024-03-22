"use client"
import { useState } from "react";
import axios from "axios";

function Admin() {
    const [ImageOn, setImageOn] = useState('');
    const [ImageOff, setImageOff] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (err) => {
                reject(err);
            };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        createPost(ImageOn,ImageOff);
    }

    async function handleFileUpload(e,state) {
        if(state=='On'){
            console.log(state)
            const file = e.target.files[0];
            checkFileSize(file)
            const base64 = await convertToBase64(file);
            setImageOn(base64);
        }else{
            console.log(state)
            const file = e.target.files[0];
            checkFileSize(file)
            const base64 = await convertToBase64(file);
            setImageOff(base64);
        }
    }

    async function createPost(ImageOn,ImageOff) {
        try {
            
            if(price){
                const res =await axios.post("http://localhost:3000/api/products", {
                    title: title,
                    price: price,
                    imageOn: ImageOn,
                    imageOff: ImageOff
                })
                console.log(res.data);
            }else{
                const res =await axios.post("http://localhost:3000/api/products", {
                    title: title,
                    imageOn: ImageOn,
                    imageOff: ImageOff
                })
                console.log(res.data);
            }
           
        } catch (err) {
            console.log(err);
        }
    }

    function checkFileSize(file) {
        var fileSize = file.size; // in bytes
        var maxSize = 1000000; // 500KB
        if (fileSize > maxSize) {
            alert('File size exceeds the limit. Please select a smaller file.');
            return false;
        }
        return true;
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5">
                <label htmlFor="imageOn">imageOn</label>
                <input
                    required
                    className="imageOn"
                    type="file"
                    label="imageOn"
                    name="imageOn"
                    onChange={(e) => handleFileUpload(e,'On')}
                />
                <label htmlFor="imageOff">imageOff</label>
                <input
                    required
                    className="imageOff"
                    type="file"
                    label="imageOff"
                    name="imageOff"
                    onChange={(e) => handleFileUpload(e,'Off')}
                />
                <input
                    required
                    placeholder="Title"
                    type="text"
                    label="Title"
                    name="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Price"
                    type="number"
                    label="Price"
                    name="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button type="submit" className="p-4 bg-gray-900 text-white">Submit</button>
            </form>
        </div>
    );
}

export default Admin;
