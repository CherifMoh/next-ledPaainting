'use client'

import { useRouter } from "next/navigation";


function Admin() {

  const router = useRouter()

  router.push('/admin/dashboard')


}

export default Admin;