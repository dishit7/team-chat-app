import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { serverHooks } from "next/dist/server/app-render/entry-base"
import { redirect } from "next/navigation"
interface ChannelIdPageProps{
    params:{
        serverId:string,
        channelId:string
    }
}

async function ChannelsIdPage({params}:ChannelIdPageProps) {
     const profile= await currentProfile()
     if(!profile){
        redirect("/")
     }
    const channel=await db.channel.findUnique({
        where:{
            id:params.channelId
        }
    })
    const member=await db.channel.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        }
    })
    if(!channel||!member)
    {
        redirect("/")
    }
    return (
        <div className="flex flex-col h-full border border-red-800 ">
             <ChatHeader
             serverId={params.serverId}
             name={channel.name}
             type="channel"

             ></ChatHeader>
             <div className="flex-1 border  overflow-y-auto border-yellow-500">
    <div className="p-4">
        Future Messages
         
    </div>
</div>
            
             <ChatInput apiUrl={"/api/socket/messages"} query={{
                channelId:channel.id,
                serverId:params.serverId
             }} name={channel.name} type={"channel"}             
             ></ChatInput>
             
            
             </div>
    )
}
export default ChannelsIdPage