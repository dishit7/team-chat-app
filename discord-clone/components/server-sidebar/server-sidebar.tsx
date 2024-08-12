import { currentProfile } from "@/lib/current-profile"
import ServerHeader from "./server-header"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Hash, Mic, Shield, ShieldAlert, Video } from "lucide-react"
import { MemberRole } from "@prisma/client"
import { ServerSearchModal } from "./server-search"
  import { CommandInput } from "../ui/command"
interface ServerSideBarProps {
    serverId: string
}
const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
    const profile = await currentProfile()
     if (!profile) {
        redirect("/")
    }

    const ChannelIconMap = {
        "TEXT": <Hash />,
        "AUDIO": <Mic />,
        "VIDEO": <Video />

    }
    const RoleIconMap = {
        [MemberRole.GUEST]:  "",
        [MemberRole.ADMIN]: <ShieldAlert className="ml-2  text-green-500" size={50}/>,
        [MemberRole.MODERATOR]: <Shield className="ml-2  " />
    }

    const servers = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            }, members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }

    })
     
          const members=servers?.members
          console.log(`there are lot of members ${members}`)

    if (!servers) {

        redirect("/")
    }
    console.log(`Server name: ${servers.name}`);

    const textChannels = servers.channels.filter((channel) => channel.type === "TEXT")
    const audioChannels = servers.channels.filter((channel) => channel.type === "AUDIO")
    const videoChannels = servers.channels.filter((channel) => channel.type === "VIDEO")
    
    const role = servers.members.find((member) => member.profileId === profile.id)?.role
    console.log(`role of our member is ${role}`)
    console.log(`servers are ${JSON.stringify(servers)}`)


    return (
        <div className="h-full">
            <ServerHeader server={servers} role={role} />
       
             <ServerSearchModal data={[{
                label: "TextChannels",
                type: "Channel",
                data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: ChannelIconMap["TEXT"]

                }))

            }, {
                label: "AudioChannels",
                type: "Channel",
                data: audioChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: ChannelIconMap["AUDIO"]
                }))
            },{
                    label:"VideoChannels",
                    type:"Channel",
                    data :videoChannels.map((channel)=>({
                        id:channel.id,
                        name:channel.name,
                        icon:ChannelIconMap["VIDEO"]
                    }))
                },{
                    label:"Members",
                    type:"Member",
                    data:members?.map((member)=>({
                        id:member.id,
                        name:member.profile.name,
                        icon:RoleIconMap[member.role]

                    }))

                }
                

                

            
            ]} />
         </div>

    )
}
export default ServerSideBar