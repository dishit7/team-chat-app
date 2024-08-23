'use client'
interface SearchServerProps {
    data: {
        label: string,
        type: "Channel" | "Member",
        data: {
            id: string
            name: string,
            icon: React.ReactNode,
        }[] | undefined
    }[] | undefined
}
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from "../ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { Search } from "lucide-react"

export const ServerSearchModal = ({ data }: SearchServerProps) => {
    const { isOpen, type, onOpen, onClose } = useModal()
    const open = isOpen && type === "search"


    function handleClose(open: boolean): void {
        onClose()
    }
    return (<>
        <button onClick={() => {
            console.log(`when close is called onOpen is also called probably again `)
            onOpen("search")
        }} className="h-5  bg bg-transparent w-full flex items-center py-4">
          <p className="text-center ml-7 ">Search  </p>  <Search className="h-5 w-5 mr-3 ml-1" />
        </button>

        <CommandDialog open={open} onOpenChange={() => {
            console.log(`onClose is called again`)
            onClose()
        }}

        >
            <CommandInput placeholder="search" />
            <CommandList>
                {data?.map((group) => {
                    return (
                        <CommandGroup heading={group.label} >
                            {group.data?.map((items) => {
                                console.log(`items has icons ${items.icon}`)
                                return (
                                    <CommandItem>{items.name}{items.icon}</CommandItem>
                                )
                            })
                            }
                        </CommandGroup>
                    )
                })
                }
            </CommandList>

        </CommandDialog>
    </>
    )
}