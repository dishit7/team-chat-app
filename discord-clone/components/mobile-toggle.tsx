import { Menu } from "lucide-react";
import { Sheet,SheetTrigger,SheetContent,SheetTitle,SheetDescription } from "./ui/sheet"

export function MobileToggle(){
    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <Menu/>
                </SheetTrigger>
            </Sheet>
        </div>
    )
}