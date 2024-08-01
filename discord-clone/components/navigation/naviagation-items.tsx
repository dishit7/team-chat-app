"use client"
import Image from "next/image"
import ActionToolTip from "../action-tooltip"
import { redirect } from "next/navigation"

interface NavigationItemProps{
    id:string,
    name:string,
    imageUrl:string
}
const NavigationItems=({
    id,
    name,
    imageUrl
}:NavigationItemProps)=>{
    function handleClick(){
        redirect(`/servers/${id}`)
    }
    return ( 
        <div>
     <ActionToolTip label={name}   side={"left"} align={"center"} >
     <button onClick={handleClick}>
    <div className="h-12 w-12 relative rounded-full overflow-hidden">
    <Image fill
            src={imageUrl} alt="serverImage" />
    </div>
    </button>
    </ActionToolTip>
    </div>
    )
}

export default NavigationItems