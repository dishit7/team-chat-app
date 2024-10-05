import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse ,NextRequest} from "next/server";
export async function PATCH(req:NextRequest,{params,searchParams}:{params:{memberId:string},  searchParams: { [key: string]: string | string[] | undefined }
}){
     try{ 
         const profile=await currentProfile()
         if(!profile){
            return new NextResponse("Unauthorized",{status:400})
         }
         const searchParams=req.nextUrl.searchParams
         const serverId=searchParams.get('serverId')
         if(!serverId){
            return new NextResponse("Server ID is required", { status: 400 });
         }
         const {role}=await req.json() 
         console.log(`role to change is ${role}`)
         console.log( ` searchParams is ${searchParams}`)
         console.log(`serverId frm searchParams is ${serverId}`)
          
         if(!role){
            return new NextResponse("Role is required", { status: 400 });
         }
         const server=await db.server.update({
            where:{
                 id:serverId
            },data:{
                    members:{
                        update:{
                            where:{
                                id:params.memberId,
                                profileId:{not:profile.id}
                                
                              
                            },
                            data:{
                                role:role
                            }
                        }
                        }
                    }
            ,include:{
                members:{
                    include:{
                        profile:true
                    }
                }
            }
         }
         )
      
      return NextResponse.json(server)
    }catch(err){
        console.log( `[MEMBERID] ,${err}`)
        return new NextResponse("Internal Server Error",{status:500})
    }
}

export async function DELETE(req:NextRequest,{params}:{params:{memberId:string}}){
    try{
        const searchParams=req.nextUrl.searchParams
        const serverId=searchParams.get( `serverId`)
        if(!serverId){
            return new NextResponse("Server ID is required", { status: 400 });
        }
        const member=await db.member.delete(
            {
            where:{
                id:params.memberId,
                serverId:serverId
            }

        })
        return    NextResponse.json(member)
    }catch(err){
        console.log(`[you deserve this for kicking a fellow member] ,${err}`)
        return new NextResponse("Internal Server Error", { status: 500 }); // Ensure error responses are sent

    }

}