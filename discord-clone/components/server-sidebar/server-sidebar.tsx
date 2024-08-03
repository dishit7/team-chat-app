import { currentProfile } from "@/lib/current-profile"
import ServerHeader from "./server-header"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
interface ServerSideBarProps {
    serverId: string
}
const ServerSideBar = async({ serverId }: ServerSideBarProps) => {
    const profile = await currentProfile()        
    if (!profile) {
        redirect("/")
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

    if (!servers) {
    
        redirect("/")
    }
    console.log(`Server name: ${servers.name}`);

    const textChannels=servers.channels.filter((channel)=>channel.type==="TEXT")
    const audioChannels=servers.channels.filter((channel)=>channel.type==="AUDIO")
    const videoChannels=servers.channels.filter((channel)=>channel.type==="VIDEO")

    const role=servers.members.find((member)=>member.profileId===profile.id)?.role
    console.log(`role of our member is ${role}`)
    console.log(`servers are ${JSON.stringify(servers)}`)
     

    return (
        <div className="h-full">
            <ServerHeader server={servers} role={role}/>

        </div>
    )
}
export default ServerSideBar