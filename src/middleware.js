import {  NextResponse } from 'next/server'
import verifyAuth from './app/lib/verifyAuth'

 
export default async function middleware(request) {
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
 

export const config = {
  matcher: '/admin(.*)'
}