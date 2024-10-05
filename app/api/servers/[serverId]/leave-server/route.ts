import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
 

export async function PATCH(req:Request,{params}:{params:{serverId:string}}){
    try{
    const profile=await currentProfile()
    if(!profile){
        redirect("/")
    }
    console.log(`serverid for leaving is ${params.serverId} profileids are ${profile.id}`)
    const server=await db.server.update({
        where:{
            id:params.serverId,
            profileId:{
                not:profile.id
            },
            members:{
                some:{
                    profileId:profile.id
                }
            }
        },data:{
            members:{
                deleteMany:{
                     profileId:profile.id
                }
            }
        }

    },)
    console.log("server-left")
    return NextResponse.json({server})
}catch(err){
    console.log("[LEAVE SERVER]",err)
}
}