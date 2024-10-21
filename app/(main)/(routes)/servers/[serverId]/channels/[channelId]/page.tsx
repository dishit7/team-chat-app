import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import VideoStream from "@/components/video/video-stream"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
 import { redirect } from "next/navigation"
interface ChannelIdPageProps {
    params: {
        serverId: string,
        channelId: string
    }
}

async function ChannelsIdPage({ params }: ChannelIdPageProps) {
    const profile = await currentProfile()
    if (!profile) {
        redirect("/")
    }
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })
    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })
    if (!channel || !member) {
        redirect("/")
    }
    return (
        <div className="flex flex-col h-full border border-red-800 ">
            <ChatHeader
                serverId={params.serverId}
                name={channel.name}
                type="channel"

            ></ChatHeader>

        { channel.type !=="VIDEO" && <ChatMessages name={channel.name} member={member} chatId={channel.id} apiUrl={"/api/socket/messages"} socketUrl={"/api"} socketQuery={{
                channelId: channel.id,
                serverId: params.serverId
            }} paramKey={"channelId"} paramValue={channel.id} type={"channel"} />
        }

           {channel.type !=="VIDEO" && <ChatInput apiUrl={"/api/socket/messages"} query={{
                channelId: channel.id,
                serverId: params.serverId
            }} name={channel.name} type={"channel"}
            ></ChatInput>
}

            {channel.type === "VIDEO" && (
                <VideoStream channelId={channel.id} />
            )} 

        </div>
    )
}
//http://localhost:3000/invite/97d9f61b-d678-4502-96c1-630ffc489d6e
export default ChannelsIdPage