'use client'
import { Channel, MemberRole, Server } from "@prisma/client"
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
    "TEXT": <Hash className="h-4 w-4 mx-1" />,
    "AUDIO": <Mic />,
    "VIDEO": <Video />
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal()
    const handleClick = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation()
        onOpen(action, { server: server, channel: channel })
    }
    const params = useParams()
    const router = useRouter()

    return (
        <>
            <button onClick={() => {
                router.push(`/servers/${params.serverId}/channels/${channel.id}`)
                return
            }}>
                <div className="flex items-center mt-2 text-channels-list-color">
                    {RoleIconMap[channel.type]}
                    <p>{channel.name}</p>
                    {channel.name === "general" ? <Lock className="h-4 w-4 ml-auto" /> : ""}
                    {channel.name !== "general" && role !== "GUEST" && (
                        <>
                            <ActionToolTip label="edit channel" side="top">
                                <Edit className="h-4 w-4 mx-1" onClick={(e) => handleClick(e, "editChannel")} />
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
