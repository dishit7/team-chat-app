"use client"
import { useSocket } from "@/providers/socket-provider"
import { Badge } from "./badge"
export const SocketIndicator=()=>{
    const {isConnected}=useSocket()
    //console.log(`isConnected is ${JSON.stringify(isConnected)}`)
    if(!isConnected){
        return(
            <Badge className="bg-yellow-600 text-white border-none" variant="outline">
                Fallback polling every second ...
            </Badge>
        )    }
       
        return(
            <Badge className="bg-green-600 text-white border-none" variant="outline">
                Live:RealTime:updates
            </Badge>
        )    
}