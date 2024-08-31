import { Member, Message, Profile, } from "@prisma/client"
import { UserAvatar } from "../ui/user-avatar";
import { format } from "date-fns"
import { ShieldAlert, ShieldCheck } from "lucide-react";
import ActionToolTip from "../action-tooltip";
interface ChatItemProps {
    id: string;
    content: string;
    fileUrl: string | null;
    member: Member & { profile: Profile };
    channelId: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    apiUrl: string;
    socketUrl: string,
    socketQuery: Record<string, string>
}
export function ChatItems({
    id,
    content,
    fileUrl,
    member,
    channelId,
    deleted,
    createdAt,
    updatedAt,
    apiUrl,
    socketUrl,
    socketQuery }: ChatItemProps) {
        const RoleIconMap= {
        "GUEST":"",
        "MODERATOR":<ShieldCheck className="text-indigo-500"/>,
        "ADMIN":<ShieldAlert className="text-rose-500"/>
        }
    return (
        <div className="group relative p-4 flex   items-center">
            <UserAvatar src={member.profile.imageUrl} className="h-7 w-7 mr-2" />
            <div className="group flex  flex-col gap-x-2 w-full">
                <div className="flex items-center gap-x-2">
                    <p className="font-semibold text-sm hover:underline">{member.profile.name}</p>
                    <ActionToolTip label={member.role}  side={"left"} >{RoleIconMap[member.role]}</ActionToolTip>
                    <span className="text-sm text-zinc-500">{format(createdAt, "dd-MMM-yyyy,hh:mm")}</span>
                </div>
                <div className="flex items-center mt-2"> {content}</div>
            </div> 
                      
                    </div>

            

             

    )
}