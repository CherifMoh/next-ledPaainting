"use client"
import { useRef, useState } from "react";
import { addProduct } from "../../../actions/product";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "../../../../components/loadings/Spinner";
import { useQuery } from "@tanstack/react-query";


const fetchRewMates = async () => {
    const res = await axios.get(`/api/storage/rewMates`);
    if(!res.data) return []
    return res.data;
}

function Admin() {


    const { data: RewMates, isLoading: IsLoading, isError: IsError, error: Error } = useQuery({
        queryKey: ['Rew Mates'],
        queryFn: fetchRewMates
    });
    
    
    const [newProduct,setNewProduct] = useState({});

    const textareaRef = useRef(null);

    const [isSubmiting,setIsSubmitting] = useState(false)

    const [optionsArray,setOptionsArray] = useState([1])

    const [salesArray,setSalesArray] = useState([1])
    
    const [partsArray,setPartsArray] = useState([1])

    const [isRewMates,setIsRewMates] = useState([])
    
    const router = useRouter()

    if (IsLoading) return <div>Loading...</div>;

    if (IsError) return <div>Error: {Error.message}</div>;

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
            const res =await axios.post(`/api/products`, newProduct)
            console.log(res.data);
            router.refresh()
            router.push('/admin/products')
        } catch (err) {
            console.log(err);
            setIsSubmitting(false)
        }
        router.push('/admin/products')
    }

    async function handleChange(e) {
        const name = e.target.name
        const value = e.target.value
        setNewProduct(pre=>({
            ...pre,
            [name]:value
        }));
    }



    typeof document !== 'undefined' && document.body.classList.add('bg-white')
    
    async function handleFileUpload(e,state) {
        if(state=='On'){
            const file = e.target.files[0];
            if(!file){
                e.target.files[0]=[]
            }
            if(!checkFileSize(file)) return 
            const base64 = await convertToBase64(file);
            setNewProduct(pre=>({
                ...pre,
                imageOn:base64,
                gallery:pre.gallery
                 ?[...pre.gallery,base64]
                 :[base64]
            }))
        }else{
            const file = e.target.files[0];
            if(!file){
                
            }
            if(!checkFileSize(file)) return  
            const base64 = await convertToBase64(file);
            setNewProduct(pre=>({
                ...pre,
                imageOff:base64,
                gallery:pre.gallery
                 ?[...pre.gallery,base64]
                 :[base64]
            }))
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

    async function handleAddToGallery(e){
        const file = e.target.files[0];
        if(!file){
            return e.target.value = ''
        }
        if(!checkFileSize(file,e.target)) return 
        const base64 = await convertToBase64(file);
        setNewProduct(pre=>(Array.isArray(pre.gallery)
        ?{...pre,gallery:[...pre?.gallery, base64]}
        :{...pre,gallery:[base64]}
        ))
    }

    const handleRemoveGalleryImage = (index) => {
        const updatedGallery = newProduct.gallery.filter((_, i) => i !== index);
        setNewProduct(pre=> ({
            ...pre,
            gallery: updatedGallery
        }));
    };

    function handelOptionChange(e,i){
        const value = e.target.value
        const name = e.target.name

        setNewProduct(prevState => {
            if(prevState?.options){

                const updatedOptions = [...prevState.options]; // Create a copy of options array
                updatedOptions[i] = { ...updatedOptions[i], [name]: value }; // Update the specific option at index i
                
                return {
                    ...prevState,
                    options: updatedOptions // Set the updated options array
                };
            }else{
                return{
                    ...prevState,
                    options:[{[name]:value}]
                }
            }
        });
    }

    async function handelOptionImageChange(e,i){
        const file = e.target.files[0];
        if(!file){
            return e.target.value = ''
        }
        if(!checkFileSize(file,e.target)) return 
        const base64 = await convertToBase64(file);

        setNewProduct(prevState => {
            if(prevState?.options){

                const updatedOptions = [...prevState.options]; // Create a copy of options array
                updatedOptions[i] = { ...updatedOptions[i], image: base64 }; // Update the specific option at index i
                
                return {
                    ...prevState,
                    options: updatedOptions // Set the updated options array
                };
            }else{
                return{
                    ...prevState,
                    options:[{image:base64}]
                }
            }
        });
    }

    function handleRemoveOption(index){

        if(Array.isArray(newProduct.options)){

            setNewProduct(prevState => {
                const updatedOptions = [...prevState.options]; // Create a copy of options array
                updatedOptions.splice(index, 1); // Remove the option at the specified index
                return {
                    ...prevState,
                    options: updatedOptions // Set the updated options array
                };
            });
        }

        setOptionsArray(prevOptions => {
            const updatedOptions = prevOptions.filter((_, i) => i !== index); // Remove the option at the specified index
            return updatedOptions;
        });
    }

    function handleAddOption(){
        setOptionsArray(pre=>{
            const newNum = pre.length+2
            return [...pre,newNum]
        })
    }

    const optionsElemnt = optionsArray.map((num,i)=>{
        return(
            <div className="flex gap-2 mt-6 relative" key={num}>

                <button 
                 className="bg-gray-400 rounded-full px-2 absolute -top-2 -right-2"
                 onClick={()=>handleRemoveOption(i)}
                >
                    X                   
                </button>
                    
                {newProduct?.options?.length >= i+1 && 'image' in newProduct.options[i]
                ?
                    <div className='relative'>
                        <Image 
                            src={newProduct.options[i].image} 
                            alt=""
                            width={96} height={80}
                        />
                        <input 
                            type="file" 
                            name="image"
                            onChange={(e)=>handelOptionImageChange(e,i)}
                            className='opacity-0 h-full w-full absolute top-0 left-0' 
                        />
                    </div>
                :
                    <div className="border-2 border-dashed border-black w-24 h-20">
                        <input 
                            type="file" 
                            name="image"
                            onChange={(e)=>handelOptionImageChange(e,i)}
                            className='opacity-0 h-full w-full' 
                        />
                    </div>
                }

                <input 
                 type="text" 
                 placeholder="Name"
                 name="name"
                 onChange={(e)=>handelOptionChange(e,i)}
                 className="border-2 border-gray-400 rounded-md p-4 w-full" 
                />
                <input 
                 type="Number" 
                 placeholder="Price"
                 name="price"
                 onChange={(e)=>handelOptionChange(e,i)}
                 className="border-2 border-gray-400 rounded-md p-4" 
                />
            </div>
        )
    })

    function handelSaleChange(e,i){
        const value = e.target.value
        const name = e.target.name

        setNewProduct(prevState => {
            if(prevState?.sales){

                const updatedSales = [...prevState.sales]; // Create a copy of sales array
                updatedSales[i] = { ...updatedSales[i], [name]: value }; // Update the specific sale at index i
                
                return {
                    ...prevState,
                    sales: updatedSales // Set the updated sales array
                };
            }else{
                return{
                    ...prevState,
                    sales:[{[name]:value}]
                }
            }
        });
    }

    function handleRemoveSale(index){

        if(Array.isArray(newProduct.sales)){

            setNewProduct(prevState => {
                const updatedSales = [...prevState.sales]; // Create a copy of options array
                updatedSales.splice(index, 1); // Remove the option at the specified index
                return {
                    ...prevState,
                    sales: updatedSales // Set the updated options array
                };
            });
        }

        setOptionsArray(prevOptions => {
            const updatedOptions = prevOptions.filter((_, i) => i !== index); // Remove the option at the specified index
            return updatedOptions;
        });
    }

    function handleAddSale(){
        setSalesArray(pre=>{
            const newNum = pre.length+2
            return [...pre,newNum]
        })
    }

    const salesElemnt = salesArray.map((num,i)=>{
        return(
            <div className="flex gap-2 mt-6 relative" key={num}>

                <button 
                 className="bg-gray-400 rounded-full px-2 absolute -top-2 -right-2"
                 onClick={()=>handleRemoveSale(i)}
                >
                    X                   
                </button>

                <input 
                 type="Number" 
                 placeholder="Quantity"
                 name="qnt"
                 onChange={(e)=>handelSaleChange(e,i)}
                 className="border-2 border-gray-400 rounded-md p-4" 
                />
                <input 
                 type="Number" 
                 placeholder="Sale %"
                 name="price"
                 onChange={(e)=>handelSaleChange(e,i)}
                 className="border-2 border-gray-400 rounded-md p-4 w-full" 
                />
            </div>
        )
    })
    
    function handelPartChange(e,i){
        const value = e.target.value
        const name = e.target.name

        setNewProduct(prevState => {
            if(prevState?.parts){

                const updatedParts = [...prevState.parts]; // Create a copy of sales array
                updatedParts[i] = { ...updatedParts[i], [name]: value }; // Update the specific sale at index i
                
                return {
                    ...prevState,
                    parts: updatedParts // Set the updated sales array
                };
            }else{
                return{
                    ...prevState,
                    parts:[{[name]:value}]
                }
            }
        });
    }

    function handelPartMatesChange(value,i){
        setNewProduct(prevState => {
            if(prevState?.parts){

                const updatedParts = [...prevState.parts]; // Create a copy of sales array
                if(updatedParts[i]?.mates){
                    updatedParts[i] = { ...updatedParts[i], mates: [...updatedParts[i].mates,value] }; // Update the specific sale at index i
                    return {
                        ...prevState,
                        parts: updatedParts // Set the updated sales array
                    };
                }else{
                    updatedParts[i] = { ...updatedParts[i], mates: [value] };
                    return{
                        ...prevState,
                        parts:updatedParts
                    }
                }
                
            }else{
                return{
                    ...prevState,
                    parts:[{mates:[value]}]
                }
            }
        });
    }

    function handleRemovePart(index){

        if(Array.isArray(newProduct.parts)){

            setNewProduct(prevState => {
                const updatedParts = [...prevState.parts]; // Create a copy of options array
                updatedParts.splice(index, 1); // Remove the option at the specified index
                return {
                    ...prevState,
                    parts: updatedParts // Set the updated options array
                };
            });
        }

        setPartsArray(prevParts => {
            const updatedParts = prevParts.filter((_, i) => i !== index); // Remove the option at the specified index
            return updatedParts;
        });
    }

    function handleAddPart(){
        setPartsArray(pre=>{
            const newNum = pre.length+2
            return [...pre,newNum]
        })
    }

    function togelIsRewMates(id){
        setIsRewMates(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id); // Remove the id if it's found
            } else {
                return [...prev, id]; // Add the id if it's not found
            }
        });
        
    }
    function rewMatesShowElement(i,num){

    return RewMates.map(mate =>{
        if(Array.isArray(newProduct?.parts) && newProduct?.parts[i]?.mates
            && newProduct?.parts[i]?.mates.includes(mate.name) 
        ) return null
        return(
        <div 
            key={mate._id}
            className="bg-gray-500 cursor-pointer py-1 px-3 rounded-full"
            onClick={()=>{
                handelPartMatesChange(mate.name,i)
                togelIsRewMates(num)
            }}
        >
            {mate.name}
        </div>
    )
    });
    }

    function removeMate(i,mate){
        setNewProduct(pre => {
            if (Array.isArray(pre.parts)) {
                // Create a new array of parts
                const newParts = pre.parts.map((part, index) => {
                    if (index === i) {
                        // For the specific part, create a new mates array by filtering out the mate
                        return {
                            ...part,
                            mates: part.mates.filter(item => item !== mate)
                        };
                    }
                    return part;
                });
                // Return the new state object
                const newState = {
                    ...pre,
                    parts: newParts
                };
                return newState;
            }
            return pre;
        })
    }

    function rewMatesElement(i){
        if(Array.isArray(newProduct?.parts) && newProduct?.parts[i]?.mates){
            return newProduct?.parts[i]?.mates.map((mate,index)=>{
                return (
                    <div 
                        key={index}
                        className="bg-gray-500 relative cursor-pointer py-1 px-3 rounded-full"
                    >
                        {mate}
                        <span 
                           className='absolute -top-1 -right-1 bg-red-500 px-1 text-xs rounded-full'
                           onClick={()=>removeMate(i,mate)}
                        >X</span>
                    </div>
                )
            })
        }
    }

    const partsElemnt = partsArray.map((num,i)=>{
        return(
            <div className="flex gap-2 flex-col z-10 mt-6 shadow-md relative" key={num}>
                <div
                    className="size-full absolute top-0 right-0"
                    onClick={()=>setIsRewMates([])}
                ></div>
                <div className="flex gap-2">
                    <button 
                    className="bg-gray-400 z-20 rounded-full px-2 absolute -top-2 -right-2"
                    onClick={()=>handleRemovePart(i)}
                    >
                        X                   
                    </button>

                    <input 
                    type="text" 
                    placeholder="Part Name"
                    name="name"
                    onChange={(e)=>handelPartChange(e,i)}
                    className="border-2 h-16 z-10 border-gray-400 rounded-md p-4" 
                    />

                    <div
                        className="flex flex-col flex-grow z-10"
                    >
                        <input 
                        type="text" 
                        placeholder="rew mates"
                        name="mates"
                        onClick={(e)=>togelIsRewMates(num)}
                        className="border-2 h-16 w-full border-gray-400 rounded-md p-4" 
                        />
                        {isRewMates.includes(num) &&
                            <div 
                            className="w-[578px] mt-2 p-4 rounded-md flex gap-6 text-white bg-gray-900"
                            >{rewMatesShowElement(i,num)}</div>
                        }
                    </div>
                </div>
                <div className="flex p-3 gap-2 z-10 text-white">
                    {rewMatesElement(i,num)}
                </div>
            </div>
        )
    })

    const galleryElemnt = newProduct?.gallery?.map((image,i)=>{
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
            const currentValue = newProduct.description;
            const newValue =
              currentValue.substring(0, selectionStart) +
              "\n" +
              currentValue.substring(selectionEnd);
            setNewProduct((prevProduct) => ({
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
                    
                <div className="flex items-center justify-between relative w-full">
                    <input
                        required
                        className="imageOn w-96 h-96 bg-white hover:bg-gray-200 hover:text-gray-200 text-white mr-5 rounded-full border-dashed cursor-pointer border-black border-2"
                        type="file"
                        label="imageOn"
                        name="imageOn"
                        onChange={(e) => handleFileUpload(e,'On')}
                    />
                    {newProduct?.imageOn
                        ?<Image src={newProduct.imageOn} width={96} height={96} alt="" className='absolute rounded-full w-96 h-96 object-cover pointer-events-none' />
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
                    {newProduct?.imageOff
                        ?<Image src={newProduct.imageOff} width={96} height={96} alt="" className='absolute rounded-full w-96 h-96 object-cover pointer-events-none right-0' />
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
                    required
                    placeholder="Title"
                    type="text"
                    label="Title"
                    name="title"
                    className="border-[1px] border-gray-400 p-2"
                    value={newProduct?.title}
                    onChange={handleChange}
                />
                <input
                    required
                    placeholder="Price"
                    type='number'
                    label="Price"
                    name="price"
                    className="border-[1px] border-gray-400 p-2"
                    value={newProduct?.price}
                    onChange={handleChange}
                />
                <textarea
                    required
                    ref={textareaRef}
                    placeholder="Description"
                    type='text'
                    label="description"
                    name="description"       
                    className="border-[1px] border-gray-400 p-2 pb-10 resize-y w-full min-h-[200px]"
                    value={newProduct?.description}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <div className="text-center">
                    <h1 className="font-semibold text-xl"> Options </h1>
                    {optionsElemnt}
                    <div 
                     className="mt-6 bg-stone-500 px-4 py-3 cursor-pointer text-white rounded-3xl max-w-40 m-auto"
                     onClick={handleAddOption}
                    >
                        Add option                        
                    </div>
                </div>
                <div className="text-center">
                    <h1 className="font-semibold text-xl"> Sales </h1>
                    {salesElemnt}
                    <div 
                     className="mt-6 bg-stone-500 px-4 py-3 cursor-pointer text-white rounded-3xl max-w-40 m-auto"
                     onClick={handleAddSale}
                    >
                        Add sale                        
                    </div>
                </div>
                <div className="text-center relative">
                    <div
                        className="size-full absolute top-0 right-0"
                        onClick={()=>setIsRewMates([])}
                    ></div>

                    <h1 className="font-semibold text-xl"> Parts </h1>

                    {partsElemnt}

                    <div 
                     className="mt-6 bg-stone-500 px-4 z-20 relative py-3 cursor-pointer text-white rounded-3xl max-w-40 m-auto"
                     onClick={handleAddPart}
                    >
                        Add a part                        
                    </div>

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
