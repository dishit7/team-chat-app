import { Member, Message, Profile, Server } from "@prisma/client"
import {Server as NetServer,Socket} from "net" 
import { NextApiResponse } from "next"
import {Server as SocketIOServer} from "socket.io"


export type NextApiResponseServerIo= NextApiResponse &{
    socket:Socket &{
        server:NetServer &{
            io:SocketIOServer
        }
    }
} 

type ServerWithMembersWithProfiles=Server&{
    members:(Member &{profile:Profile})[]
}

type MessageWithMembersWithProfile={
    message:Message&{members:(Member&{profile:Profile})}
}

export  type {ServerWithMembersWithProfiles ,MessageWithMembersWithProfile}