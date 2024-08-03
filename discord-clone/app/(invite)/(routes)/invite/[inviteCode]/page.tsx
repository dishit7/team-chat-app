import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface inviteCodePageProps{
    params:{
        inviteCode:string
    }
}

const InviteCodePage=async({params}:inviteCodePageProps)=>{
    const profile=await currentProfile()
    if(!profile){
        redirect("/")
    }
    if(!params.inviteCode){
        redirect("/")
    }
    const existingServer=await db.server.findFirst(
        {
            where:{
                inviteCode:params.inviteCode,
                 
            }
        }
    )

    const found_server=await db.server.findFirst({
        where:{inviteCode:params.inviteCode},
        
    })
    
    const server=await db.server.update({
        where:{
            id:found_server.id,
        },
        data:{
            members:{
                create:[{
                    profileId:profile.id
                }]
            }
        }
    })

    if(server){
        redirect(`/servers/${server.id}`)
    }
    if(existingServer){
       redirect(`/servers/${existingServer.id}`)     
    }

    return null
 }

 export default InviteCodePage