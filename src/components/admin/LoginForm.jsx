'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

function UserForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setFormData(preState => ({
            ...preState,
            [name]: value
        }))
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        try {
            const res = await axios.post('/api/auth/login', formData)
            router.refresh()
            router.push('/admin')
        } catch (err) {
            console.log(err)
            setErrorMessage(err.message)
        }

    }
    return (
        <div className="flex flex-col shadow-md justify-center gap-5 items-center w-96 h-[500px] bg-white">
            <h1
                className="text-2xl font-bold p-4"
            >
                Login
            </h1>
            <form
                onSubmit={handelSubmit}
                method="POST"
                className="flex flex-col w-full items-center gap-3"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                    defaultValue={formData.name}
                    className="m-2 px-3 py-2 border w-72 border-gray-400 rounded"
                />

                <input
                    type="text"
                    name="email"
                    placeholder="E-mail"
                    onChange={handleChange}
                    required
                    defaultValue={formData.email}
                    className="m-2 px-3 py-2 border w-72 border-gray-400 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    defaultValue={formData.password}
                    className="m-2 px-3 py-2 border w-72 border-gray-400 rounded"
                />

                <button
                    type='submit'
                    className="w-72 bg-blue-500 text-white py-3 rounded"
                >
                    LogIn
                </button>
            </form>
            <p className="text-red-500">{errorMessage}</p>
        </div>
    )
}

export default UserForm