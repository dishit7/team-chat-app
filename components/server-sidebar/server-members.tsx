'use client'
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { UserAvatar } from "../ui/user-avatar"
 import { useRouter } from "next/navigation"

interface ServerMembersProps {
    member:Member&({profile:Profile}),
    server:Server,
    role?:MemberRole
}

export const ServerMembers=({member,server,role}:ServerMembersProps)=>{
    const router=useRouter()
     function handleClick(): void {
        console.log("Cliecked")
     router.push(`/servers/${server.id}/conversations/${member.id}`)  
    }

    return (
        <>
        <div className="flex text-primary">
            <button className="p-0 flex items-center justify-center gap-0 " onClick={handleClick}>
           <div className=""> <UserAvatar className="h-8 w-8 mr-2 " src={member.profile.imageUrl}/></div><div>{member.profile.name}</div> 
            </button>
         </div>
        </>
     )
}