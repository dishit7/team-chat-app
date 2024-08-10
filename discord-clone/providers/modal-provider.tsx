"use client"
import CreateChannelModal from "@/components/modals/create-channel-modal"
import CreateServerModal from "@/components/modals/create-server-modal"
import DeleteServerModal from "@/components/modals/delete-server-modal"
import EditServerModal from "@/components/modals/edit-server-modal"
import InviteServerModal from "@/components/modals/invite-modal"
import LeaveServerModal from "@/components/modals/leave-server"
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
        <LeaveServerModal />
         </>
    )
}