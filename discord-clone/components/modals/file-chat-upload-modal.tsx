"use client"

import * as z from "zod"
import axios from "axios"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {
   Form,
   FormControl,
   FormField,
   FormLabel,
   FormItem,
   FormMessage 
} from "@/components/ui/form"
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
import {redirect, useRouter} from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import qs from "query-string"

 const FileChatUploadMoad=()=>{
   const formschema=z.object({
    
       fileUrl:z.string().min(1,{
           message:"Attachment is required"
       })
   })

   
   const form =useForm({
       resolver:zodResolver(formschema),
       defaultValues:{
           fileUrl:""
       }
   })
   const router= useRouter()

   const {type,isOpen,onClose,data}=useModal()
   const {apiUrl,query}=data
    if(!apiUrl){
     router.push('/')  
     return null
    }

   const url=qs.stringifyUrl({
    url:apiUrl,
    query:query
   })
   console.log(`type in file-chat-modal is ${type} `)
   const isModalOpen=type==="fileMessage"&&isOpen
   const isLoading=form.formState.isSubmitting
   const onSubmit=async(values:z.infer<typeof formschema>)=>{
       console.log(`the values after submiting are: ${JSON.stringify(values)}`)
       const {fileUrl} =values
       console.log(`NEW file url in form ${fileUrl}`)
       await axios.post(url,{fileUrl,values,content:values.fileUrl})
       onClose()
    }

   
   

   return (
   <Dialog open={isModalOpen} onOpenChange={()=>{
    form.reset()
    onClose()
    }}>
       <DialogContent className="bg-white text-black p-0 overflow-hidden" >
           <DialogHeader className="pt-8 px-6">
               <DialogTitle className="text-2xl text-cesnter font-bold">
                Add an Attachment
               </DialogTitle>
               <DialogDescription className="text-zinc-500 text-center"> Send a file as a Message</DialogDescription>
           </DialogHeader>
           <Form   {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="space-y-8 px-6">
                   <div className="flex items-center justify-center text-center">
                       <FormField
                        control={form.control}
                        name="fileUrl"
                        render={({field})=>(
                           <FormItem>
                                <FormControl>
                                <FileUpload 
                                endpoint="serverImage"
                                value={field.value}
                                 onChange={ field.onChange}
                               />
                                 </FormControl>
                           </FormItem>
                        )}
                       ></FormField>

                   </div>
                   
                        
                 </div>
                 <DialogFooter className="bg-gray-100 px-6 py-4">
                   <Button variant="primary" disabled={isLoading} type="submit">
                       Send
                   </Button>
                 </DialogFooter>
               </form>
           </Form>
       </DialogContent>
   </Dialog>)
}


export default  FileChatUploadMoad

