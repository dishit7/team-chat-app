'use client'
import ServerWithMembersWithProfiles from "@/types"
import { MemberRole } from "@prisma/client"
import {useSearchParams}  from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
interface ServerHeaderProps{
    server:ServerWithMembersWithProfiles,
    role:MemberRole |undefined
}
const ServerHeader=({server,role}:ServerHeaderProps)=>{
    const isAdmin=role===MemberRole.ADMIN
    const isModerator=isAdmin ||role===MemberRole.MODERATOR
      return (
        <div className="flex items-center justify-center w-full">
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button>{server.name}</button>
    </DropdownMenuTrigger>
  <DropdownMenuContent>
  {isModerator &&(<DropdownMenuItem>
       Invite People
     </DropdownMenuItem>)
     }
     {isModerator &&(<DropdownMenuItem>
        create channels
     </DropdownMenuItem>)
     }
     {
        isAdmin && (<DropdownMenuItem>
            server settings
        </DropdownMenuItem>)
     }
       {
        isModerator && (<DropdownMenuItem>
            Manage Members
        </DropdownMenuItem>)
     }
     {
        !isAdmin &&(<DropdownMenuItem>
            Leave Server
        </DropdownMenuItem>)
     }
      {
        isAdmin &&(<DropdownMenuItem>
            Delete Server
        </DropdownMenuItem>)
     }
     <DropdownMenuSeparator />
   </DropdownMenuContent>
</DropdownMenu>
         </div>
    )
}

export default ServerHeader