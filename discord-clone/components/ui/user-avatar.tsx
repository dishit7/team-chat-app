import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./avatar";

interface  UserAvatarProps{
    src?:string,
    classname?:string
}
export function UserAvatar ({
    src,
    classname
}:UserAvatarProps){
    return(
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10",
                               classname)}>
            <AvatarImage src={src}></AvatarImage>
        </Avatar>
    )
}