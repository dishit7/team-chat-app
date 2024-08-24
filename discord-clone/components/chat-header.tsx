import { Hash, Menu } from "lucide-react"
import { MobileToggle } from "./mobile-toggle"

interface ChatHeaderProps{
    serverId:string,
    name:string,
    type:"channel" |"conversation"
    imageUrl?:string
}
export function ChatHeader({serverId,name,type,imageUrl}:ChatHeaderProps){
    return (
        <div className="flex items-center px-3  font-semibold text-base border-b-2 border-neutral-200 dark:border-neutral-800 h-12">
        <MobileToggle/>
        {type==="channel"&& (<Hash className="h-5 w-5 mr-2"/>  )}<p>{name}</p>
        </div>
    )
}