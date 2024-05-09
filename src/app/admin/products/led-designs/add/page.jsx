"use client"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Spinner from "../../../../../components/loadings/Spinner";

const fetchTags = async()=>{
    const res = await axios.get('/api/products/tags');
    return res.data;
}

function Admin() {

    const { data: TagsA, isLoading, isError , error} = useQuery({
            queryKey:['tags'],
            queryFn: fetchTags
    });

    const [newDesign,setNewDesign] = useState({});

    const textareaRef = useRef(null);

    const [isSubmiting,setIsSubmitting] = useState(false)

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
        setIsSubmitting(true)
        try {
            const res =await axios.post("/api/products/ledDesigns", newDesign)
            console.log(res.data);
            queryClient.invalidateQueries('designs');
            router.refresh()
            router.push('/admin/products/led-designs')
        } catch (err) {
            console.log(err);
            setIsSubmitting(false)
        }
    }

    const queryClient = useQueryClient()

    typeof document !== 'undefined' && document.body.classList.add('bg-white')
    
    async function handleFileUpload(e,state) {
        console.log(state)
        const file = e.target.files[0];
        if(state=='On'){
            if(!file){
                setNewDesign(pre=>({...pre,imageOn:''}))
                return e.target.value = ''
            }
            if(!checkFileSize(file,e.target)) return setNewDesign(pre=>({...pre,imageOn:''}))
            const base64 = await convertToBase64(file);
            setNewDesign(pre=>({
                ...pre,
                imageOn:base64,
                gallery:pre.gallery
                 ?[...pre.gallery,base64]
                 :[base64]
            }))
        }else{
            if(!file){
                setNewDesign(pre=>({...pre,imageOff:''}))
                return e.target.value = ''
            }
            if(!checkFileSize(file,e.target)) return setNewDesign(pre=>({...pre,imageOff:''})) 
            const base64 = await convertToBase64(file);
            setNewDesign(pre=>({
                ...pre,
                imageOff:base64,
                gallery:pre.gallery
                 ?[...pre.gallery,base64]
                 :[base64]
            }))
        }
    }

    const handleCheckboxChange = (event) => {
        const tagName = event.target.value;
        if (event.target.checked) {
            setNewDesign(pre => ({
                ...pre,
                tags: Array.isArray(pre.tags) ? [...pre.tags, tagName] : [tagName]
            })); // Add tag to the array
        } else {
            setNewDesign(pre=>({...pre,tags:pre.tags.filter(tag => tag !== tagName)})); // Add tag to the array
        }
    };
    
    const router = useRouter()

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>{error.message}</div>

    
    const tagsElement = TagsA.map(tag=>(
        <div key={tag.name}>
            <input 
             value={tag.name}
             type="checkbox" 
             name="tag" 
             id="tag" 
             className="mr-2" 
             onClick={handleCheckboxChange}
             defaultChecked={Array.isArray(newDesign.tags) ? newDesign.tags.includes(tag.name) : false}
            />
            <label htmlFor="tag" className='capitalize'>{tag.name}</label>
        </div>
    ))


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

    async function handleAddToGallery(e){
        const file = e.target.files[0];
        if(!file){
            return e.target.value = ''
        }
        if(!checkFileSize(file,e.target)) return 
        const base64 = await convertToBase64(file);
        setNewDesign(pre=>(Array.isArray(pre.gallery)
        ?{...pre,gallery:[...pre?.gallery, base64]}
        :{...pre,gallery:[base64]}
        ))
    }

    const handleRemoveGalleryImage = (index) => {
        const updatedGallery = newDesign.gallery.filter((_, i) => i !== index);
        setNewDesign(pre=> ({
            ...pre,
            gallery: updatedGallery
        }));
    };

    const galleryElemnt = newDesign.gallery?.map((image,i)=>{
        return(
            <div key={image} className='relative'>
                <div 
                 onClick={()=>handleRemoveGalleryImage(i)}
                 className='absolute top-1 right-5 flex justify-center items-center cursor-pointer bg-white px-2 rounded-full text-center'
                >x</div>
                <Image 
                width={160}
                height={160}
                className="w-40 h-40"
                src={image}
                alt=""
                />
            </div> 
        )
    })

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents the default behavior of creating a new line
      
            // Insert a newline character at the current cursor position
            const { selectionStart, selectionEnd } = textareaRef.current;
            const currentValue = newDesign.description;
            const newValue =
              currentValue.substring(0, selectionStart) +
              "\n" +
              currentValue.substring(selectionEnd);
            setNewDesign((prevProduct) => ({
              ...prevProduct,
              description: newValue,
            }));
      
            // Move the cursor to after the inserted newline character
            const newCursorPosition = selectionStart + 1;
            textareaRef.current.selectionStart = newCursorPosition;
            textareaRef.current.selectionEnd = newCursorPosition;
          }
    };
    
    return (
        <div className="w-full min-h-svh flex items-center justify-center overflow-y-scroll">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5 bg-white p-8 rounded-lg shadow-md">
                    
                <div className="flex items-center justify-between relative w-full mb-10">
                    <input
                        required
                        className="imageOn w-96 h-96 bg-white hover:bg-gray-200 hover:text-gray-200 text-white mr-5 rounded-full border-dashed cursor-pointer border-black border-2"
                        type="file"
                        label="imageOn"
                        name="imageOn"
                        onChange={(e) => handleFileUpload(e,'On')}
                    />
                    {newDesign.imageOn
                        ?<Image alt="" src={newDesign.imageOn} width={96} height={96} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none' />
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
                    {newDesign.imageOff
                        ?<Image alt="" src={newDesign.imageOff} width={96} height={96} className='absolute rounded-full w-96 h-96 object-cover pointer-events-none right-0' />
                        :<div className='absolute right-32 font-bold text-xl pointer-events-none'>
                            <p>Enter imge off</p>
                            <FontAwesomeIcon icon={faCloudArrowUp} className="ml-12"/>
                        </div>
                    } 
                </div>
                <div className="text-center">
                   <h1 className="font-semibold text-xl"> gallery</h1>
                   <div className="grid grid-cols-4 gap-8 justify-between my-10">
                    {galleryElemnt}
                    <div className="border-dashed flex justify-center items-center text-7xl text-gray-500 w-40 h-40 cursor-pointer relative border-black border-2">
                        <input 
                         type='file' 
                         className='opacity-0 w-40 h-40 top-0 left-0 absolute'
                         onChange={handleAddToGallery}
                        />
                        <span>+</span>
                    </div>
                   </div>
                </div>

                <input
                    className='border-2 border-gray-400 rounded-md p-4'
                    required
                    placeholder="Title"
                    type="text"
                    label="Title"
                    name="Title"
                    value={newDesign.title}
                    onChange={(e) => setNewDesign(pre=>({...pre,title:e.target.value}))}
                />

                <textarea
                    required
                    ref={textareaRef}
                    placeholder="Description"
                    type='text'
                    label="description"
                    name="description"       
                    className='border-2 border-gray-400 rounded-md p-4 pb-10 resize-y w-full min-h-[200px]'
                    value={newDesign.description}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNewDesign(pre=>({...pre,description:e.target.value}))}
                />

                <h1>tags</h1>
                <div className="grid grid-cols-4">
                    {tagsElement}
                </div>
                <button 
                 type="submit" 
                 className={`p-4 bg-gray-900 text-white ${isSubmiting&&'h-16 flex justify-center items-start'}`}
                >
                    {isSubmiting
                        ?<Spinner color={'border-gray-500'} size={'h-10 w-10 '}/>
                        :'Submit'
                    }
                </button>
            </form>
        </div>
    );
}

export default Admin;
