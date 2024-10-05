 import { Hash, Menu } from "lucide-react"
import { MobileToggle } from "../mobile-toggle"
import { UserAvatar } from "../ui/user-avatar"
import { SocketIndicator } from "../ui/socket-indicator"
interface ChatHeaderProps{
    serverId:string,
    name:string,
    type:"channel" |"conversation"
    imageUrl?:string
}
export function ChatHeader({serverId,name,type,imageUrl}:ChatHeaderProps){
    return (
        <div className="flex items-center  px-3  font-semibold text-base border-b-2 border-neutral-200 dark:border-neutral-800  h-12">
       <div className="mt-2"> <MobileToggle serverId={serverId}/></div>
        {type==="channel"&& (<Hash className="h-5 w-5 mx-1"/>  )}<div className="flex items-center"><UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />{name}</div>
        <div className="ml-auto flex items-center">
            <SocketIndicator />
        </div>
        </div>
    )
}