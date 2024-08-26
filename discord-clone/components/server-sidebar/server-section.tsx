"use client"

import ServerWithMembersWithProfiles from "@/types"
import { ChannelType, MemberRole } from "@prisma/client"
import ActionToolTip from "../action-tooltip"
import { Plus } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"

interface ServerSectionProps{
    label:string,
    sectionType:"Channels" |"Members",
    role?:MemberRole,
    channelType?:ChannelType
    server?:ServerWithMembersWithProfiles
}
export const ServerSection=({label,sectionType,role,channelType,server}:ServerSectionProps)=>{
    const {isOpen,onOpen}=useModal()
    return(
     <>  
     <div className="flex font-bold  text">{label}
     {role!=="GUEST" && sectionType==="Channels" &&(
     <ActionToolTip label="Create Channel" side="top">
        <button onClick={()=>onOpen("createChannel")}><Plus className="h-4 w-4 mx-1"/></button>
        </ActionToolTip>
        )
        }
     </div>
   
     </>
    )
}