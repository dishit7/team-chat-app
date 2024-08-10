"use client"
import CreateChannelModal from "@/components/modals/create-channel-modal"
import CreateServerModal from "@/components/modals/create-server-modal"
import EditServerModal from "@/components/modals/edit-server-modal"
import InviteServerModal from "@/components/modals/invite-modal"
import ManageMembersModal from "@/components/modals/manage-members-modal"
import { useState,useEffect } from "react"
export const    ModalProvider=()=>{
    
    return(
        <>
        <CreateServerModal  />
        <InviteServerModal />
        <EditServerModal />
        <ManageMembersModal/>
        <CreateChannelModal />
        </>
    )
}