import ServerSideBar from "@/components/server-sidebar/server-sidebar"
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import { parseArgs } from "util"
 
const ServerSideBarLayout=async({children,params}:{
    children:React.ReactNode
    params:{serverId:string}})=>{
        console.log(`serverId is ${params.serverId}`)
        //#f1f5f9
        //dark:bg-[#2b2d31]  bg-[#ffffff]
return (
<div className="h-full">
    <div className="bg bg-server-sidebar w-40 z-20 flex flex-col fixed inset-y-0 sm:hidden ">
    <ServerSideBar serverId={params.serverId} />
    </div>
    <div className="md:pl-[160px] h-full text-text border border-green-500">
     {children}
    </div>
</div>
)

}

export default ServerSideBarLayout