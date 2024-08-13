import { Channel, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import ActionToolTip from "../action-tooltip"

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
    return (
        <>
            <div className="flex items-center mt-2 text-zinc-400">
                {RoleIconMap[channel.type]}
                <p>{channel.name}</p>
                {channel.name == "general" ? <Lock className="h-4 w-4 ml-auto" /> : ""}
                {channel.name !== "general" && role !== "GUEST" && (
                    <ActionToolTip label="edit channel" side="top">
                        <button><Edit className="h-4 w-4 mx-1" /></button>
                    </ActionToolTip>)}
                {channel.name !== "general" && role !== "GUEST" && (
                    <ActionToolTip label="delete channel" side="top"><button><Trash className="h-4 w-4 " /></button></ActionToolTip>
                )}
            </div>
        </>
    )
}