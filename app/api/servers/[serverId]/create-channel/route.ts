import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { NextResponse } from "next/server"

interface createChannel{
    name:string,
    type:ChannelType
}
export async function POST(req:Request,{params}:{params:{serverId:string}}){
 try{
    const profile=await currentProfile()
if(!profile){
    return new NextResponse("Unauthorized",{status:401})
 }
if(!params.serverId){
    return new NextResponse("ServerId missing",{status:400})    
}
const serverId=params.serverId
console.log(`SERVERID IN CHANNELS IS ${serverId}`)
console.log(`Full params object: ${JSON.stringify(params)}`);

const value=await req.json() as createChannel
const {name}=value
const {type}=value
if(!value){
    return new NextResponse("Value missing",{status:400})    
}
const channel=await db.channel.create({
    data:{
     name:name,
     type:type,
     profileId:profile.id,
     serverId:serverId


    }
})
console.log(`channel created is ${JSON.stringify(channel)}`)

return NextResponse.json(channel)
 }catch(err){
    console.log(["CHANNEL CREATION"],err)
    return new NextResponse("Internal Server Error", { status: 500 }); // Ensure error responses are sent

 }
}