"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

const fetchTags = async()=>{
    const res = await axios.get('http://localhost:3000/api/products/tags');
    return res.data;
}

function Admin() {

    const { data: TagsA, isLoading, isError , error} = useQuery({
            queryKey:['tags'],
            queryFn: fetchTags
    });


    const [imageOn, setImageOn] = useState('');
    const [imageOff, setImageOff] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, settags] = useState([]);

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
    const queryClient = useQueryClient()

    typeof document !== 'undefined' && document.body.classList.add('bg-white')
    
    async function handleFileUpload(e,state) {
        console.log(state)
        const file = e.target.files[0];
        if(state=='On'){
            if(!file){
                setImageOn('')
                return e.target.value = ''
            }
            if(!checkFileSize(file,e.target)) return setImageOn('')
            const base64 = await convertToBase64(file);
            setImageOn(base64);
        }else{
            if(!file){
                setImageOff('')
                return e.target.value = ''
            }
            if(!checkFileSize(file,e.target)) return setImageOn('') 
            const base64 = await convertToBase64(file);
            setImageOff(base64);
        }
    }

    const handleCheckboxChange = (event) => {
        const tagName = event.target.value;
        if (event.target.checked) {
            settags([...tags, tagName]); // Add tag to the array
        } else {
            settags(tags.filter(tag => tag !== tagName)); // Remove tag from the array
        }
    };
    
    const router = useRouter()

    if(isLoading) return <div>Loding...</div>
    if(isError) return <div>{error.message}</div>

    
    const tagsElement = TagsA.map(tag=>(
        <div key={tag.name}>
            <input 
             value={tag.name}
             type="checkbox" 
             name="tag" 
             id="tag" 
             className="mr-2" 
             onChange={handleCheckboxChange}
             checked={tags.includes(tag.name)}
            />
            <label htmlFor="tag" className='capitalize'>{tag.name}</label>
        </div>
    ))


    async function createPost(imageOn,imageOff) {
        try {
                const res =await axios.post("http://localhost:3000/api/products/ledDesigns", {
                    title,
                    imageOn,
                    imageOff,
                    category,
                    tags

                })
                console.log(res.data);
                queryClient.invalidateQueries('designs');
                router.refresh()
                router.push('/admin/products/led-designs')
        } catch (err) {
            console.log(err);
        }
    }

    function checkFileSize(file,input) {
        if(file){
            const fileSize = file.size; // in bytes
            const maxSize = 12 * 1024 * 1024 ; // 12MB in bytes
            if (fileSize > maxSize) {
                alert('File size exceeds the limit. Please select a smaller file.');
                input.value = ''
                return false;
            }
            return true;
        }
    }
    
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5">
                    
                <div className="flex items-center justify-between relative w-full mb-10">
                    <input
                        required
                        className="imageOn w-96 h-96 bg-white hover:bg-gray-200 hover:text-gray-200 text-white mr-5 rounded-full border-dashed cursor-pointer border-black border-2"
                        type="file"
                        label="imageOn"
                        name="imageOn"
                        onChange={(e) => handleFileUpload(e,'On')}
                    />
                    {imageOn
                        ?<Image alt="" src={imageOn} width={96} height={96} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none' />
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
                        ?<Image alt="" src={imageOff} width={96} height={96} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none right-0' />
                        :<div className='absolute right-32 font-bold text-xl pointer-events-none'>
                            <p>Enter imge off</p>
                            <FontAwesomeIcon icon={faCloudArrowUp} className="ml-12"/>
                        </div>
                    } 
                </div>
                <input
                    className='border-2 border-gray-400 rounded-md p-4'
                    required
                    placeholder="Title"
                    type="text"
                    label="Title"
                    name="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <h1>tags</h1>
                <div className="grid grid-cols-4">
                    {tagsElement}
                </div>
                <button 
                 type="submit" 
                 className="p-4 bg-gray-900 text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Admin;
