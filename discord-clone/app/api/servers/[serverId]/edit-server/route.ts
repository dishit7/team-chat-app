import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
interface editServer{
    imageUrl:string,
    name:string
}
export async function PATCH(req:Request,{params}:{params:{serverId:string}}){
    try{
        const profile=await currentProfile()
if(!profile){
    return new NextResponse("Unauthorized",{status:401})
 }
if(!params.serverId){
    return new NextResponse("ServerId missing",{status:400})    
}

  
 const serverId=params.serverId
 const values: editServer = await req.json();

 const {name}=values
 const {imageUrl}=values
 console.log(`values in route.ts are${JSON.stringify(values)}`)
 if(imageUrl==="")
 {

    const server=await db.server.update({
        where:(
            {
                id:serverId
            }
        ),data:{
             name:name
        },
    
     })
 }
 const server=await db.server.update({
    where:(
        {
            id:serverId
        }
    ),data:{
        imageUrl:imageUrl,
        name:name
    },

 })
    
    return NextResponse.json(server)
    }catch(err){
        console.log(err)
    }
}

