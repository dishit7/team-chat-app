import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./avatar";

interface  UserAvatarProps{
    src?:string,
    className?:string
}
export function UserAvatar ({
    src,
    className
}:UserAvatarProps){
    return(
        <Avatar className={cn("h-7 w-7 ",
                               className)}>
            <AvatarImage src={src}></AvatarImage>
        </Avatar>
    )
}