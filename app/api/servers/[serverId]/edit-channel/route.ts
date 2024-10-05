import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

interface editChannel {
    name: string,
    type: ChannelType
}
export async function PATCH(req: NextRequest, { params,searchParams }: { params: { serverId: string },searchParams: { [key: string]: string | string[] | undefined }
}) {
    try {
        
        const values:editChannel =await req.json()
        console.log(`values in editChannel route.ts are${JSON.stringify(values)}`)
        const {name,type}=values
        const searchParams=req.nextUrl.searchParams
         const channel_id=searchParams.get('channel_id')  
        if(!channel_id){
            return 
        }

        console.log(`channel_id is ${channel_id}`)
        if(name===""){
           const channel = await db.channel.update({
                where:{
                    id:channel_id,
                    serverId:params.serverId
                },data:{
                    type:type

                }

            })
          return NextResponse.json(channel)
        }
        else{
           const channel = await db.channel.update({
                where:{
                    id:channel_id
                } ,
                data:{
                    name:name,
                    type:type
                }
            })
            console.log(`resp from prisma of channel update ${channel}`)
            return NextResponse.json(channel)

        }

        return new  NextResponse("works",{status:200})
    } catch (err) {
        console.log(`[EDIT-CHANNEL ERR] ${err}`)
    }
}