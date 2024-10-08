import { Channel, ChannelType, Server } from "@prisma/client";
import {create } from "zustand"
export type ModalType="createServer" | "invite" |"editServer" |"members" |"createChannel" |"leaveServer" |"deleteServer" |"search" |"editChannel" | "fileMessage"
interface ModalData{
    server?:Server,
    channel?:Channel,
    channelType?:ChannelType,
    apiUrl?:string,
    query?:Record<string,string>
    

}
interface ModalStore {
    type:ModalType | null,
    isOpen:boolean,
    data:ModalData ,
    onOpen:(type:ModalType,data?:ModalData)=>void
    onClose:()=>void
}


export const useModal=create<ModalStore>((set)=>({
    type:null,
    isOpen:false,
    data:{},
    onOpen:(type,data={})=>{
        console.log(`Opening modal ${type}  with data:, ${data}`);
        set({isOpen:true ,type,data})},
    onClose:()=>set({type:null,isOpen:false})
})) 
