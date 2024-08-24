import { ChatHeader } from "@/components/chat-header"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
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
        <div className="flex flex-col h-full border-neutral-800">
             <ChatHeader
             serverId={params.serverId}
             name={channel.name}
             type="channel"

             />
             </div>
    )
}
export default ChannelsIdPage