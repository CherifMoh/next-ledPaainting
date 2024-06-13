'use client'

import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import {editRewMate} from "../../../app/actions/storage";


const fetchRewMates = async () => {
    const res = await axios.get(`/api/storage/rewMates`);
    if(!res.data) return []
    return res.data;
}


function RewMatesComp() {


    const queryClient = useQueryClient();

    const { data: RewMates, isLoading: IsLoading, isError: IsError, error: Error } = useQuery({
        queryKey: ['Rew Mates'],
        queryFn: fetchRewMates
    });

    const [isRewMates, setIsRewMates] = useState(false);
    const [newRewMates, setNewRewMates] = useState([]);

    useEffect(()=>{
        setNewRewMates(RewMates)
    },[RewMates])

    if (IsLoading) return <div>Loading...</div>;

    if (IsError) return <div>Error: {Error.message}</div>;

    function handleRewMatesChange(e,oldRewMate) {
        const value = e.target.value
        const newRewMate = {...oldRewMate,qnt:value}
        setNewRewMates(pre=>pre.map(rewMate=>{
            if(rewMate._id === newRewMate._id) return newRewMate
            return rewMate
        }))
    }

    function submitRewMates(e,id) {
        e.preventDefault()
        const targetObject = newRewMates.find(obj => obj._id === id);
        editRewMate(id,targetObject)
    }

    const RewMatesElement = RewMates.map(rewMate=>{
        return (
            <div 
                className="px-2 w-min py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                key={rewMate._id}
            >
                    {rewMate.name}
                    <form 
                        className="flex items-center justify-center gap-2"
                        onSubmit={(e)=>submitRewMates(e,rewMate._id)}
                    >
                        <input 
                            type="number" 
                            defaultValue={rewMate.qnt} 
                            name={rewMate.name}
                            className="rounded-md border w-16 pl-5 border-black"
                            min={1}
                            onChange={(e)=>handleRewMatesChange(e,rewMate)}
                        />
                        <button>
                            <FontAwesomeIcon icon={faFloppyDisk} className='text-green-600' />
                        </button>
                    </form>
            </div>
        )
    })



  return (
    <div>
        <button
            className="px-8 py-3 rounded-md border border-black"
            onClick={()=>setIsRewMates(pre=>!pre)}
        >
            مادة أولية  
        </button>

        {isRewMates &&
        <div className="flex flex-col justify-center items-center mt-4 gap-1">
            {RewMatesElement}
        </div>
        }
    </div>
  )
}

export default RewMatesComp