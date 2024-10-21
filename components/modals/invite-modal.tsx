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
   DialogFooter,
   DialogHeader,
   DialogTitle
}from "../ui/dialog"
import { FileUpload } from "../file-upload"
import {useRouter} from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "@radix-ui/react-label"
import { Copy, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
 
 const  InviteServerModal=()=>{
   

   const {isOpen,onClose,onOpen,type,data}=useModal()
   const [isLoading,setLoading]=useState(false)
   const isModalOpen=isOpen && type==="invite"
   const {server}=data 
   const origin =useOrigin()
   const router= useRouter() 
   //console.log(`origin is ${origin} and serverdata is ${JSON.stringify(data)}`)
   const invite_link=`${origin}/invite/${server?.inviteCode}`
   
     const onNew=async()=>{
     setLoading(true)
     const response=await axios.patch(`/api/servers/${server?.id}/invite-code`)
     console.log(`response is ${JSON.stringify(response)}`)
     console.log(`response data is ${JSON.stringify(response.data)}`)
     console.log(`server with resp is ${JSON.stringify({server:response.data})}`)


     setLoading(false)
     onOpen("invite",{server:response.data})
    }
     const onCopy=()=>{
        navigator.clipboard.writeText(invite_link)
     }
     function handleClose(open: boolean): void { 
         onClose()
     }

   return (
   <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="bg-white text-black p-0 overflow-hidden" >
           <DialogHeader className="pt-8 px-6">
               <DialogTitle className="text-2xl text-center font-bold">
                  Invite People 
                </DialogTitle>
               <DialogDescription className="text-zinc-500 text-center">generate invite code and ask your friends to paste this in their browser as url</DialogDescription>
           </DialogHeader>
           <div>
           <Label className="uppercase text-xs font-bold text-zinc-500">Server Invite Link</Label>
           <div className="flex items-center mt-2 gap-x-3">
            <Input className="bg-zinc-300/50 border-0 text-black "  readOnly  
            value={invite_link}></Input>
            <Button  size="icon" className=" w-4 h-4" disabled={isLoading} onClick={onCopy} >
                <Copy></Copy>
            </Button>
             </div>
             
            <Button onClick={onNew} variant="link" size="sm" className="text-xs text-zinc-500 mt-4" disabled={isLoading}  >
                Generate a new link <RefreshCw className="w-4 h-4  ml-2"/>
               </Button>
               </div>
        </DialogContent>
   </Dialog>)
}


export default InviteServerModal