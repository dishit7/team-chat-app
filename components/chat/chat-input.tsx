"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormField, FormControl, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Plus } from 'lucide-react'
import axios from "axios"
import  qs from 'query-string'
import { useModal } from '@/hooks/use-modal-store'
interface ChatInputProps {
    apiUrl: string,
    query: Record<string, any>,
    name: string,
    type: "conversation" | "channel"
}

export function ChatInput({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) {
    const formSchema = z.object({
        content: z.string().min(1)

    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }

    })
    const {onOpen}=useModal()
    const isLoading = form.formState.isLoading
    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try{
            const url=qs.stringifyUrl({
                url:apiUrl,
                query
            })
            const response =await axios.post(url,{
                ...value,
                ...query})
            console.log(response)
            
            form.reset()
         }catch(Err){
            console.log("[CHAT FORM ERROR]",Err)
         }
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <FormField
                    control={form.control}
                    name="content"
                    disabled={isLoading}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600  dark:hover:bg-zinc-300 rounded-full transition flex items-center justify-center p-1"
                                        onClick={()=>onOpen('fileMessage',{apiUrl,query})}
                                     >
                                        <Plus className=" text-white h-4 w-4" />
                                        </button>

                                        <Input className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75
                                        text-zinc-600 dark:text-zinc-200 ' 
                                        {...field}
                                        />
                                </div>
                            </FormControl>
                        </FormItem>
                    )

                    } />
            </form>
        </Form>
    )
}