import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:Request,res:NextResponse){
    try{
        const profile=await currentProfile()
        if(!profile)
        {
            return new NextResponse("Unauthorized",{status:400})
        }
        

        const body = await req.json()
        const { content,fileUrl, serverId, channelId } = body

        console.log(`serverid and chanels id are ${serverId} ${channelId}`)
 
        if(!content){
            return new NextResponse("Content is missing")
        }
        if(!serverId){
            return new NextResponse("ServerId is missing")
        }
        if(!channelId){
            return new NextResponse("ChannelId is missing")
        }

        const server=await db.server.findFirst({
            where:{
                id:serverId,
                members:{some:{
                    profileId:profile?.id
                }}
            },include:{
                members:{
                 include:{
                    profile:true
                 }
                }
            }
        })
        const channel=await db.channel.findFirst({
            where:{
                id:channelId ,
                serverId:serverId
            }
        })

        const member= server?.members.find((member)=>member.profileId===profile?.id)

        if(member){
        const message=await db.message.create(
            {
             data:{
            content,
            fileUrl,
            channelId:channelId,
            memberId:member?.id

        },include:{
            member:{
                include:{
                    profile:true
                }
            }
        },
    }
)
        return NextResponse.json(message)
     
    }

    }   catch(err){
        console.log("[SOCKET MESSAGES ERROR",err)
    }
}