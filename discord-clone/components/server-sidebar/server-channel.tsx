'use client'
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import ActionToolTip from "../action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

interface ServerChannelProps {
    channel: Channel,
    server?: Server,
    role?: MemberRole
}

const RoleIconMap = {
    "TEXT": <Hash className="h-4 w-4 mx-1" style={{ height: '24px', width: '24px' }} />,
    "AUDIO": <Mic className="h-4 w-4 mx-1" style={{ height: '24px', width: '24px' }} />,
    "VIDEO": <Video className="h-4 w-4 mx-1" style={{ height: '24px', width: '24px' }} />
}
export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal()
    const handleClick = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation()
        onOpen(action, { server: server, channel: channel })
    }
    const params = useParams()
    const router = useRouter()



    async function channelSelection(channel: Channel) {
        if (channel.type === "TEXT") {
            router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
            // Fetch and display messages
        } else if (channel.type === "AUDIO" || channel.type === "VIDEO") {
            // Handle audio or video channel (WebRTC setup)
            await setupMedia(channel.type);
        }
    }

    const setupMedia = async (channeltype: ChannelType) => {
        const constraints = {
            video: channeltype === "VIDEO",
            audio: true
        }
        try {

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            const localVideoElement=document.getElementById('localVideo') as HTMLVideoElement
            if(localVideoElement){
                localVideoElement.srcObject=stream
            }

        } catch (Err) {
            console.log(Err)
        }
    }

    return (
        <>
            <button onClick={() => {
                router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
                return
            }}>
                <div className="flex items-center mt-2 text-channels-list-color">
                    {RoleIconMap[channel.type]}
                    <p>{channel.name}</p>
                    {channel.name === "general" ? <Lock className="h-5 w-5 ml-2" /> : ""}
                    {channel.name !== "general" && role !== "GUEST" && (
                        <>
                            <ActionToolTip label="edit channel" side="top">
                                <Edit className="h-4 w-4 mx-1" onClick={(e) => handleClick(e, "editChannel")} style={{ height: '16px', width: '16px' }} />
                            </ActionToolTip>
                            <ActionToolTip label="delete channel" side="top">
                                <Trash className="h-4 w-4" />
                            </ActionToolTip>
                        </>
                    )}
                </div>
            </button>
        </>
    )
}


