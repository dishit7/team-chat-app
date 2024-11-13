import NavigationAction from "./navigation-action"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import NavigationItems from "./naviagation-items"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ModeToggle } from "../ui/mode-toggle"
import { UserButton } from "@clerk/nextjs"


export const NavigationSideBar =async()=>{
    //console.log("nav sidebar here")
    const profile=  await currentProfile()
    console.log(profile)
    if(!profile){
        console.log("here")
        redirect("/")
        
    }
    const servers=await db.server.findMany({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })
    //console.log(servers)
    //dark:bg-[#1e1f22] bg-[#f0f0f0]
    return ( 
       <div className=" space-y-4   flex flex-col items-center h-full text-text py-3 bg-navbar   ">
          
        <NavigationAction />
        <Separator />
        <ScrollArea className="flex-1">
        {servers.map((server)=>{
            return(
              
                <div key={server.id}>
                <NavigationItems name={server.name} id={server.id} imageUrl={server.imageUrl}/>
                </div>
                )
                
        }
        ) 

            
        }
        </ScrollArea>
        <ModeToggle ></ModeToggle>
        <UserButton 
         appearance={{
            elements:{
                avatarBox:"h-[35px] w-[35px]"
            }
         }}
       />
      </div>
      )
}


export default NavigationSideBar