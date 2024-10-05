import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { serverHooks } from "next/dist/server/app-render/entry-base"
  import { Redressed } from "next/font/google"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function DELETE(req:Request,{params}:{params:{serverId:string}}){
    try{
         const profile=await currentProfile()
         if(!profile){
            redirect("/")
         }
         const server=await db.server.delete({
            where:{
                id:params.serverId,
                profileId:profile.id
            }
         })
         return NextResponse.json({server})
    }catch(err){
        console.log("[DELETE SERVER]",err)
    
}
 }