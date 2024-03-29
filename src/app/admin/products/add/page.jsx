"use client"
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'


function Admin() {
    const [imageOn, setImageOn] = useState('');
    const [imageOff, setImageOff] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
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
        createPost(imageOn,imageOff);
    }


    typeof document !== 'undefined' && document.body.classList.add('bg-white')
    
    async function handleFileUpload(e,state) {
        if(state=='On'){
            console.log(state)
            const file = e.target.files[0];
            if(!file){
                e.target.files[0]=[]
            }
            if(!checkFileSize(file)) return 0
            const base64 = await convertToBase64(file);
            setImageOn(base64);
        }else{
            console.log(state)
            const file = e.target.files[0];
            if(!file){
                
            }
            if(!checkFileSize(file)) return 0 
            const base64 = await convertToBase64(file);
            setImageOff(base64);
        }
    }

    async function createPost(imageOn,imageOff) {
        try {
            
            if(price){
                const res =await axios.post("http://localhost:3000/api/products", {
                    title,
                    price,
                    imageOn,
                    imageOff,
                    category,

                })
                console.log(res.data);
            }else{
                const res =await axios.post("http://localhost:3000/api/products", {
                    title,
                    imageOn,
                    imageOff,
                    category,
                })
                console.log(res.data);
            }
           
        } catch (err) {
            console.log(err);
        }
    }

    function checkFileSize(file) {
        if(file){
            const fileSize = file.size; // in bytes
            const maxSize = 1000000; // 500KB
            if (fileSize > maxSize) {
                alert('File size exceeds the limit. Please select a smaller file.');
                return false;
            }
            return true;
        }
    }
    
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5">
                    
                <div className="flex items-center justify-between relative w-full">
                    <input
                        required
                        className="imageOn w-96 h-96 bg-white hover:bg-gray-200 hover:text-gray-200 text-white mr-5 rounded-full border-dashed cursor-pointer border-black border-2"
                        type="file"
                        label="imageOn"
                        name="imageOn"
                        onChange={(e) => handleFileUpload(e,'On')}
                    />
                    {imageOn
                        ?<img src={imageOn} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none' />
                        :<div className='absolute left-32 font-bold text-xl pointer-events-none'>
                            <p>Enter imge on</p>
                            <FontAwesomeIcon icon={faCloudArrowUp} className="ml-12"/>
                        </div>
                    }   
                    <input
                        required
                        className="imageOff w-96 h-96 bg-white hover:bg-gray-200 hover:text-gray-200 text-white ml-5 rounded-full border-dashed cursor-pointer border-black border-2"
                        type="file"
                        label="imageOff"
                        name="imageOff"
                        onChange={(e) => handleFileUpload(e,'Off')}
                    />
                    {imageOff
                        ?<img src={imageOff} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none right-0' />
                        :<div className='absolute right-32 font-bold text-xl pointer-events-none'>
                            <p>Enter imge off</p>
                            <FontAwesomeIcon icon={faCloudArrowUp} className="ml-12"/>
                        </div>
                    } 
                </div>
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
                    required
                    placeholder="Price"
                    type='number'
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
