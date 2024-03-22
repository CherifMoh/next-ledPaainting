import {  NextResponse } from 'next/server'
import verifyAuth from './app/lib/verifyAuth'

 
// This function can be marked `async` if using `await` inside
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
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin',
}