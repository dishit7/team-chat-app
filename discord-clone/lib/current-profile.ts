import {auth} from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { use } from "react"
import { useAuth } from "@clerk/nextjs"

export const currentProfile=async ()=>{
 const {userId}=auth()
if(!userId){
    return null
}
const profile = await db.profile.findUnique({
    where:{
        userId:userId
    }

    
})
return profile

}

