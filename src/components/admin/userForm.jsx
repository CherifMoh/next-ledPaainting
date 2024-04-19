'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

function UserForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange =(e)=>{
        const value = e.target.value
        const name = e.target.name
        setFormData(preState=>({
            ...preState,
            [name]:value
        }))
    }

    const handelSubmit = async(e)=>{
        e.preventDefault()
        setErrorMessage('')
        try{
            const res = await axios.post('http://localhost:3000/api/users',formData)
            router.refresh()
            router.push('/')
        }catch(err){
            console.log(err)
            setErrorMessage(err.message)
        }

    }
    return(
    <div className="flex justify-center items-center">
        <form
         onSubmit={handelSubmit}
         method="POST"
         className="flex flex-col gap-3 w-1/2"
        >
            <h1>Creat User</h1>
            <label htmlFor="name">Full Name</label>
            <input 
                type="text" 
                name="name" 
                id="name" 
                onChange={handleChange} 
                required 
                value={formData.name}
                className="m-2 bg-slate-300 rounded"
            />

            <label htmlFor="email">Email</label>
            <input 
                type="text" 
                name="email" 
                id="email" 
                onChange={handleChange} 
                required 
                value={formData.email}
                className="m-2 bg-slate-300 rounded"
            />

            <label htmlFor="password">password</label>
            <input 
                type="password" 
                name="password" 
                id="password" 
                onChange={handleChange} 
                required 
                value={formData.password}
                className="m-2 bg-slate-300 rounded"
            />

            <button 
                type='submit'
                className="bg-blue-300 hover:bg-blue-100"
            >
                Creat User
            </button>
        </form>
        <p className="text-red-500">{errorMessage}</p>
    </div>
    )
}

export default UserForm