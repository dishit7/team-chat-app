import ServerSideBar from "@/components/server-sidebar/server-sidebar"
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import { parseArgs } from "util"
import styles from './ServerSideBarLayout.module.css'
import { Button } from "@/components/ui/button"
const ServerSideBarLayout=async({children,params}:{
    children:React.ReactNode
    params:{serverId:string}})=>{
        //console.log(`serverId is ${params.serverId}`)
        //#f1f5f9
        //dark:bg-[#2b2d31]  bg-[#ffffff]
return (
<div className="flex h-screen">
    <div className={styles.sidebar}>
    <ServerSideBar serverId={params.serverId} />
    </div>
        <div className="flex-1 flex flex-col h-full md:ml-[240px] text-text grad-main  ">
            MAIN TEXT
             
     {children}
    </div>
</div> 
)

}

export default ServerSideBarLayout