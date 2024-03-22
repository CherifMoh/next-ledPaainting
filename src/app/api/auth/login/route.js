import { NextRequest, NextResponse } from 'next/server'
import User from '../../../models/users'
import {dbConnect} from '../../../lib/dbConnect'
import bcrypt from 'bcrypt'
import {SignJWT} from 'jose'
import { cookies } from "next/headers";
import { nanoid } from 'nanoid'


export async function POST(req){
    await dbConnect()
    const body = await req.json()
    const user = await User.findOne({email:body.email})
    
    if(!user){
        return NextResponse.json({message:'auth failed'},{status:409})
    }else{
        try {
            const match = await bcrypt.compare(body.password, user.password);
            if(match) {
                const token = await new SignJWT({})
                .setProtectedHeader({alg: 'HS256'})
                .setJti(nanoid())
                .setIssuedAt()
                .setExpirationTime('168h')
                .sign(new TextEncoder().encode(process.env.JWT_KEY))
                    
                console.log('token ' ,token)
                cookies().set("access-token", token, {
                    path: "/",
                    domain: "localhost",
                    maxAge: 300,
                    httpOnly: true,
                    secure: false,
                });
                return Response.json({message: 'Logged in'}, {status: 201});
            } else {
                return NextResponse.json({message: 'Authentication failed'}, {status: 409});
            }
        } catch(err) {
            console.log('bcrypt Error', err);
            return NextResponse.json({message: 'bcrypt Error', err}, {status: 500});
        }
    }
    
}



















    
//     bcrypt.compare(body.password, user.password,(err,result)=>{
//         if(err){
//                 console.log('bcrypt Error ', err)
//                 return NextResponse.json({message:'bcrypt Error', err},{status:500})
//             }
//             if(result){
//                     const token = jwt.sign(
//                             {
//                                     name:user.name,
//                                     email:user.email,
//                                     password:user.password
                        
//                                 },process.env.JWT_KEY,
//                                 {
//                                         expiresIn:'1h'
//                             })
//                             console.log('token ' ,token)
//                                 cookies().set("access-token", token, {
//                                         path: "/",
//                                         domain: "localhost",
//                                         maxAge: 300,
//                                         httpOnly: true,
//                                         secure: false,
//                                 });
//                             return NextResponse.json({message:'loged in'},{status:201})
//                         }
//     })
//

// })