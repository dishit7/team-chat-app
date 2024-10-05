'use client'
import { useEffect } from "react"
import { useSocket } from "@/providers/socket-provider"
import { log } from "console"
import { MessageWithMembersWithProfile } from "@/types"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
  interface chatSocketHookProps{
    queryKey:string,
    addKey?:string,
    updateKey?:string,

}
export const useChatSocketHook=({
    queryKey,
    addKey,
    updateKey
}:chatSocketHookProps)=>{
 const {socket}=useSocket()
 const queryClient= useQueryClient()

 useEffect(()=>{
    if(!socket){
        return
    } 
    console.log("CHAT SOCKET HOOK MOUNTED")
    // socket.onAny((event:any, ...args:any) => {
    //     console.log(`Caught event: ${event}`, args);
    //   });
    // socket.on("newMessage",()=>{
    //     console.log("newMessage socket emmision working fine")
    // })
    socket.on(addKey,(newMessage:MessageWithMembersWithProfile)=>{
    console.log(`New Message Recieved: ${JSON.stringify(newMessage)}`)
    queryClient.setQueryData([queryKey],(oldData:any)=>{
    console.log(`[IN THE QUERYCLIENT ADD DATA FUNCTION] ${queryKey} `)
    // const updatedPages=oldData.pages.map((page:any)=>({
    // ...page,
    // items:[...page.items,newMessage]

    // }))
    // return {...oldData,pages:updatedPages}
    const newData=[...oldData.pages]
    newData[0]={
        ...newData[0],
        items:[
           newMessage,
           ...newData[0].items
        ]

        
    }
    return {...oldData,pages:newData}
    })

    })
    return ()=>{
        socket.off(addKey)
    }
  },[socket,queryKey,addKey,updateKey])
}