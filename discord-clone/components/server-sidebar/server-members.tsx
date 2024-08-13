import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { UserAvatar } from "../ui/user-avatar"

interface ServerMembersProps {
    member:Member&({profile:Profile}),
    server:Server,
    role?:MemberRole
}

export const ServerMembers=({member,server,role}:ServerMembersProps)=>{
    return (
        <>
        <div className="flex text-primary">
         <UserAvatar classname="h-2 w-2" src={member.profile.imageUrl}/>{member.profile.name}
         </div>
        </>
     )
}