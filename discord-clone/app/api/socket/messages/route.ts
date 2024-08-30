import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { Message } from "@prisma/client"

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
        console.log("[SOCKET POST MESSAGES ERROR",err)
    }
}

export async function GET(req:Request){
    try{
        let  MESSAGES_BATCH=10
        const profile=await currentProfile()
        if(!profile){
             return new NextResponse("Unauthorized",{status:401})
        }
       
        const {searchParams}=new URL(req.url)
        const cursor=searchParams.get('cursor')
        const channelId=searchParams.get('channelId')
        if(!channelId){
            return new NextResponse("CHANNEL ID MISSING",{status:400})
        }
        console.log(`ChannelId in socket messages get is ${channelId}`)
        let messages:Message[]=[]
        if(cursor){

            const channel = await db.channel.findUnique({
                where: {
                    id: channelId
                },
                include: {
                    message: {
                        take:1
                    }
                }
            });
            
            console.log('Channel:', JSON.stringify(channel, null, 2));


           messages=await db.message.findMany({
            take:MESSAGES_BATCH,
            skip:1,
            cursor:{
                id:cursor
            },where:{
                channelId: {
                    equals: channelId,
                    mode: 'insensitive'  // This makes the search case-insensitive
                }
             
            },include:{
                member:{
                  include:{
                    profile:true
                  }
                }
            },orderBy:{
                createdAt:"desc"
            }
           })
         }
         else{



            messages=await db.message.findMany({
                take:MESSAGES_BATCH,
                where:{
                        channelId: {
                            equals: channelId,
                            mode: 'insensitive'  // This makes the search case-insensitive
                        }
                     
                 },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
            }

        })
        
    }
    let nextCursor=null
    if(messages.length===MESSAGES_BATCH){
        nextCursor=messages[MESSAGES_BATCH-1].id
    } 
    console.log(`Messages is ${messages[0]?.content} and length is ${messages.length}`)
    return NextResponse.json({
        items:messages,
        nextCursor
    })
 }
    catch(err){
        console.log("[SOCKET MESSAGES GET ERROR]")
    }
}