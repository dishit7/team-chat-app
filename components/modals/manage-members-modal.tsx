"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "@radix-ui/react-label"
import { Check, Copy, EllipsisVertical, FlipVerticalIcon, Gavel, MemoryStickIcon, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
import {ServerWithMembersWithProfiles} from "@/types"
import { ScrollArea } from "../ui/scroll-area"
import { UserAvatar } from "../ui/user-avatar"
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import qs from "query-string"
import { MemberRole } from "@prisma/client"
const ManageMembersModal = () => {

    

    const RoleIconMap = {
        "GUEST":null,
        "MODERATOR":<ShieldCheck />,
        "ADMIN":<ShieldAlert className="text-rose-500 "/>
    }

    const { isOpen, onClose, onOpen, type, data } = useModal()
    const [isLoading, setLoading] = useState(false)
    const isModalOpen = isOpen && type === "members"
    const { server } = data as {server:ServerWithMembersWithProfiles}
    const origin = useOrigin()
    const router = useRouter()
    //console.log(`origin is ${origin} and serverdata is ${JSON.stringify(data)}`)
    const invite_link = `${origin}/invite/${server?.inviteCode}`
 


        async function onRoleChange(memberId:string,role:MemberRole){
            const url=qs.stringifyUrl({url:`/api/members/${memberId}`,
                                       query:{serverId:server.id,
                                              }})
            const response=await axios.patch(url,{role})
            router.refresh()
            console.log(`response.data is${JSON.stringify(response.data)}`)
            onOpen("members",{server:response.data})
            

        }
        function handleClose(open: boolean): void {
            onClose()
        }
    
    async function onKick(memberId: string) {
        const response=await axios.delete(`/api/members/${memberId}?serverId=${server.id}`)
        router.refresh()
     }

        return (
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden" >
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Manage Members
                            
                <DialogDescription className="text-zinc-700 text-center">
                    {server?.members?.length}members
                </DialogDescription>
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[420px] mt-8 pr-6">
                     {server?.members?.map((member)=>(
                        <div key={member.id} className="flex items-center gap-x-3 mb-6">
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                            <div className="flex item-center">
                            {member.profile.name}
                            {RoleIconMap[member.role]}
                           {member.role!=="ADMIN"&& <DropdownMenu>
                            <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger> 
                            <DropdownMenuContent>
                            <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>  
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                      <DropdownMenuItem onClick={()=>onRoleChange(member.id,"GUEST")}> Guest 
                                             {member.role==="GUEST" && <Check className="ml-1" />}
                                         </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>onRoleChange(member.id,"MODERATOR")}>Moderator
                                      {member.role==="MODERATOR" && <Check className="ml-1" />}

                                      </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal> 
                          
                            </DropdownMenuSub>
                            <DropdownMenuSeparator></DropdownMenuSeparator> 
                            <DropdownMenuItem onClick={()=>onKick(member.id)} > Kick<Gavel className="ml-4"/> </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>   }
                                            
                              </div>
                            <p className="text-xs text-zinc-500">
                               {member.profile.email}
                            </p>
                            </div>
                         </div>
                     ))}
                    </ScrollArea>
                </DialogContent>
            </Dialog>)
    
}


export default ManageMembersModal