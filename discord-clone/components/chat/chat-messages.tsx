"use client"

import {Message, Member, Profile} from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chatQuery"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment } from "react"

interface ChatMessageProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"


}
export function ChatMessages({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessageProps) {

    const queryKey=`chat:${chatId}`

    type MessageWithMembersWithProfiles=Message&{member:Member&{
        profile:Profile
    }}
    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage, 
        status 
    } = useChatQuery({queryKey,apiUrl,paramKey,paramValue})
    if(status==="pending")
    {
        return(
            <div className="flex flex-col flex-1 items-center justify-center "> 
            <Loader2 className="w-7 h-7 text-zinc-500 animate-spin"/>
            <p>Loading Messages...</p>
            </div>
        )
    }
    if(status==="error"){
       return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <ServerCrash className="w-7 h-7 text-zinc-500"/>
            Something went wrong
        </div>
       )
    }
    return (

        < div className = "flex-1 flex flex-col overflow-y-auto" >
                   <div className="flex-1" />
            
            <ChatWelcome /> 
            
            <div className="flex flex-col-reverse mt-auto border border-purple-600 ">
                
                {
                    data?.pages.map((group,i)=>{
                        console.log("Mapping fragments here")
                        console.log("Group Items:", group.items);
                        return (
                            <Fragment key={i}>
                               { group.items.map((message:MessageWithMembersWithProfiles)=>{
                                  {console.log(`MESSAGE is ${message.content}`)}
                                return (
                                    <div key={message.id} >
                                      {message.content}
                                    
                                    </div>
                                )
                               })} 
                                
                            

                            </Fragment> 
                        )
                    })
                }
                            </div>
            
         </div >
    )
}