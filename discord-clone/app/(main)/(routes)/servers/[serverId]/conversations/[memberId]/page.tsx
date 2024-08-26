import { ChatHeader } from "@/components/chat-header"
import { findOrCreateNewConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface   MemberIdPageProps{
    params:{
        memberId:string,
        serverId:string
    }
}

const MemberIdPage=async ({params}:MemberIdPageProps)=>{
    const profile=await currentProfile()
    const currentMember=await db.member.findFirst({
        where:{
            AND:{
                profileId:profile?.id ,
                serverId:params.serverId
            }
        }
    })

    if(!currentMember)
    {
        redirect(`/`)
    }

    const conversation=await findOrCreateNewConversation(currentMember.id,params.memberId)
    if(!conversation)
    {
        redirect(`/servers/${params.serverId}/`)
        
    }

   const  {memberOne,memberTwo}=conversation
    
   const otherMember=memberOne.profileId===profile?.id ? memberTwo :memberOne
        
return (
<div className="bg bg-white dark:bg-[#313338] flex flex-col h-full">
    <ChatHeader serverId={params.serverId} name={otherMember.profile.name} imageUrl={otherMember.profile.imageUrl} type={"channel"} />
 </div>)
}
export default MemberIdPage  