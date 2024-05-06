import {  NextResponse } from 'next/server'
import verifyAuth from './app/lib/verifyAuth'
import axios from 'axios'
import { cookies } from 'next/headers'
import { CreateUnVisitor } from './app/actions/cookies'

 



export default async function middleware(request) {

    const fullPath = request.nextUrl.pathname
    const parts = fullPath.split("/")
    const path = parts[1]

    if(parts.length === 2){
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    
    if(path === 'admin'){
        try{
            const cookie = request.cookies.get('access-token')
            if(!cookie) return NextResponse.redirect(new URL('/login', request.url))
            const token = cookie.value
            const verifiedToken = token && await verifyAuth(token)
            if(!verifiedToken) return NextResponse.redirect(new URL('/login', request.url))
            return NextResponse.next()
        }
        catch(err){
            console.log('Eroro: ',err)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    
    
}
 

export const config = {
  matcher: '/admin(.*)'
}