 import { Menu } from "lucide-react";
import { Sheet,SheetTrigger,SheetContent,SheetTitle,SheetDescription } from "./ui/sheet"
import NavigationSideBar from "./navigation/navigation-sidebar";
import ServerSideBar from "./server-sidebar/server-sidebar";
interface MobileToggleProps{
    serverId:string
}
export function MobileToggle({serverId}:MobileToggleProps){
    {console.log(`[MOBILE TOGGLE COMP] SERVERID IS ${serverId}`)}
    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <Menu/>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 flex gap-0">
                    <div className="flex items-center h-full w-full">
                    <NavigationSideBar/>
                    <div className="bg-server-sidebar h-full">
                    <ServerSideBar serverId={serverId}  />
                    </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}