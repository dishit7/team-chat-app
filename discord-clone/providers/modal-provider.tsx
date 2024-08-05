"use client"
import CreateServerModal from "@/components/modals/create-server-modal"
import EditServerModal from "@/components/modals/edit-server-modal"
import InviteServerModal from "@/components/modals/invite-modal"
import { useState,useEffect } from "react"
export const    ModalProvider=()=>{
    
    return(
        <>
        <CreateServerModal  />
        <InviteServerModal />
        <EditServerModal />
        </>
    )
}