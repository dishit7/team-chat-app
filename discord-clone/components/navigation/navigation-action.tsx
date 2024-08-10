'use client'
import { Plus } from "lucide-react"
import ActionToolTip from "../action-tooltip"
import { useModal } from "@/hooks/use-modal-store"
import { useState,useEffect } from "react"
export const NavigationAction = () => {
    const {onOpen}=useModal()
  
    return ( 
        <div className="">NavAction
            <ActionToolTip label="create server" side="right" align="center" >
            <button className="group flex items-center" onClick={()=>onOpen("createServer")}>
                <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden   dark:bg-neutral-700 group-hover:bg-emerald-500 items-center justify-center" >
                    <Plus className="group-hover:text-white text-emerald-500 transition"></Plus>
                    </div>
            </button>
          </ActionToolTip>
        </div>
    )
}

export default NavigationAction