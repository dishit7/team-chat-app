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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { FileUpload } from "../file-upload"
import {useRouter} from "next/navigation"
import { useModal } from "@/hooks/use-modal-store" 

 const CreateChannelModal=()=>{
   const formschema=z.object({
       name:z.string().min(1,{
           message:"Channel name is required"
       }),
       type:z.string().min(1,{
           message:"You need to select a type"
       })
   })


   const form =useForm({
       resolver:zodResolver(formschema),
       defaultValues:{
           name:"" ,
           type:""
       }
   })

   const isLoading=form.formState.isSubmitting
   const router= useRouter()
   const {isOpen,onClose,type,data}=useModal()
   const isModalOpen=isOpen && type==="createChannel"
   const {server}=data
   const onSubmit=async(values:z.infer<typeof formschema>)=>{
       console.log(`the values after submiting are: ${JSON.stringify(values)}}`)
       await axios.post(`/api/servers/${server?.id}/create-channel`,values)
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
                 Create your Channels 
               </DialogTitle>
               <DialogDescription className="text-zinc-500 text-center">create your audio,video or text channels</DialogDescription>
           </DialogHeader>
           <Form   {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="space-y-8 px-6">
                   
                   <FormField  
                   control={form.control}
                   name="name"
                   render={({field})=>(
                       <FormItem >
                           <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                               Channel Name
                           </FormLabel>
                           <FormControl>
                               <Input 
                               disabled={isLoading}
                               className="bg-zinc-300/50 
                               focus-visible:ring-0 text-black
                               focus-visible:ring-offset-0"
                               placeholder="Enter channel name"
                               {...field}/>
                           </FormControl>
                            <FormMessage className="text-red-800" />
                       </FormItem>
                   )}
                   
                   
                   />
                   <FormField
                   control={form.control}
                   name="type"
                   render={({field})=>(
                    <FormItem>
                          <FormLabel >Select Channel Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type for your channel"></SelectValue>
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="TEXT">Text</SelectItem>
                                <SelectItem value="AUDIO">Audio</SelectItem>
                                <SelectItem value="VIDEO">Video</SelectItem>

                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-800"/>
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


export default CreateChannelModal