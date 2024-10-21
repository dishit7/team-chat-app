"use client"

import * as z from "zod"
import axios from "axios"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
 
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle
}from "../ui/dialog"
import {useRouter} from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "@radix-ui/react-label"
import { Copy, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
 
 const  DeleteServerModal=()=>{
   

   const {isOpen,onClose,onOpen,type,data}=useModal()
   const [isLoading,setLoading]=useState(false)
   const isModalOpen=isOpen && type==="deleteServer"
   const {server}=data 
   const origin =useOrigin()
   const router= useRouter() 
   //console.log(`origin is ${origin} and serverdata is ${JSON.stringify(data)}`)
   const invite_link=`${origin}/invite/${server?.inviteCode}`
   
      
    const onLeave=async()=>{ 
    const response =await axios.delete(`/api/servers/${server?.id}/delete-server`)
    console.log(`after deleting server response ${JSON.stringify(response)}`)
    router.refresh()
    window.location.reload()
       
    }       
      
     function handleClose(open: boolean): void { 
         onClose()
     }

   return (
   <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="bg-white text-black p-0 overflow-hidden" >
           <DialogHeader className="pt-8 px-6">
               <DialogTitle className="text-2xl text-center font-bold">
                  Delete Server   
                </DialogTitle>
               <DialogDescription className="text-zinc-500 text-center"> are you sure you want to delete the server {server?.name} <span className="text-black text-lg">?</span></DialogDescription>
               
           </DialogHeader>
           <div className="flex justify-between mx-5">
            <Button className="hover:bg-red-600 bg-slate-500" onClick={()=>handleClose(true)}>Cancel</Button>
            <Button  className="hover:bg-green-500 bg-slate-600" onClick={()=>onLeave()}>Confirm</Button>
             </div>
              
         </DialogContent>
   </Dialog>)
}


export default DeleteServerModal