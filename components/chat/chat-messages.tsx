"use client"

import {Message, Member, Profile} from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chatQuery"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useEffect, useRef } from "react"
import { ChatItems } from "./chat-items"
import { channel } from "process"
import { UploadAbortedError } from "@uploadthing/shared"
import { useChatSocketHook } from "@/hooks/chat-socket-hook"

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
    const addKey=`chat:${chatId}:messages`
    const updateKey=`chat:${chatId}:messages:update`
    console.log(`ADD KEY FOR THIS CHAT IS ${chatId}`)
    useChatSocketHook({queryKey,addKey,updateKey})
    
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

    
    const scrollToBottom = () => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
      }

      useEffect(() => {
        if (data) scrollToBottom()
      }, [data])
    
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll event listener to detect when user scrolls near the top
    useEffect(() => {
      const scrollContainer = scrollRef.current
      if (!scrollContainer) return
  
      const handleScroll = () => {
        // If user is near the top and there's more data to load, fetch next page
        if (scrollContainer.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
  
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])
  

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

        < div className = "flex-1 flex flex-col overflow-y-auto" ref={scrollRef}>
                   <div className="flex-1" />
            
            <ChatWelcome /> 
            <h1>{addKey}</h1>
            <div className="flex flex-col-reverse mt-auto border border-purple-600 ">
                
                {
                    data?.pages.map((group,i)=>{
                    //    console.log("Mapping fragments here")
                      //  console.log("Group Items:", group.items);
                        return (
                            <Fragment key={i}>
                               { group.items.map((message:MessageWithMembersWithProfiles)=>{
                                  {//console.log(`MESSAGE is ${message.content}`)
                                }
                                return (
                                     
                                    <ChatItems  key={message.id}  id={message.id} content={message.content} fileUrl={null} member={message.member} channelId={message.channelId} deleted={false} createdAt={message.createdAt} updatedAt={message.updatedAt} apiUrl={"/api/socket/messages"} socketUrl={"/api"} socketQuery={socketQuery} />
                                     
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