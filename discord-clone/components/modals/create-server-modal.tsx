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

 const CreateServerModal=()=>{
   const formschema=z.object({
       name:z.string().min(1,{
           message:"server name is required"
       }),
       imageUrl:z.string().min(1,{
           message:"Server image is required"
       })
   })


   const form =useForm({
       resolver:zodResolver(formschema),
       defaultValues:{
           name:"" ,
           imageUrl:""
       }
   })

   const isLoading=form.formState.isSubmitting
   const {isOpen,onClose,type}=useModal()
   const isModalOpen=isOpen && type==="createServer"
   const router= useRouter()
   const onSubmit=async(values:z.infer<typeof formschema>)=>{
       console.log(`the values after submiting are: ${JSON.stringify(values)}}`)
       await axios.post(`/api/servers`,values)
       form.reset()
       router.refresh()
       window.location.reload()
   }

   
   

     function handleClose(open: boolean): void { 
        form.reset()
        onClose()
     }

   return (
   <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="bg-white text-black p-0 overflow-hidden" >
           <DialogHeader className="pt-8 px-6">
               <DialogTitle className="text-2xl text-center font-bold">
                   Customize your server
               </DialogTitle>
               <DialogDescription className="text-zinc-500 text-center">Give your server with personality with a name and an image .You can always change it later</DialogDescription>
           </DialogHeader>
           <Form   {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="space-y-8 px-6">
                   <div className="flex items-center justify-center text-center">
                       <FormField
                        control={form.control}
                        name="imageUrl"
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
                   <FormField  
                   control={form.control}
                   name="name"
                   render={({field})=>(
                       <FormItem >
                           <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                               Server Name
                           </FormLabel>
                           <FormControl>
                               <Input 
                               disabled={isLoading}
                               className="bg-zinc-300/50 
                               focus-visible:ring-0 text-black
                               focus-visible:ring-offset-0"
                               placeholder="Enter server name"
                               {...field}/>
                           </FormControl>
                            <FormMessage />
                       </FormItem>
                   )}
                   
                   
                   />
                        
                 </div>
                 <DialogFooter className="bg-gray-100 px-6 py-4">
                   <Button variant="primary" disabled={isLoading} type="submit">
                       Create
                   </Button>
                 </DialogFooter>
               </form>
           </Form>
       </DialogContent>
   </Dialog>)
}


export default CreateServerModal