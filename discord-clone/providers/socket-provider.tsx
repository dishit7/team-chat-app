"use client"
import {useState,useEffect,createContext,useContext} from "react"
import {io as ClientIO} from "socket.io-client"

type SocketContextType={
    socket:any|null,
    isConnected:boolean
}

const SocketContext = createContext<SocketContextType>({
    socket:null,
    isConnected:false 
})


export const useSocket=()=>{
    return useContext(SocketContext)
}


export const SocketProvider=({children}:{children:React.ReactNode})=>{
    const [socket,setSocket]=useState(null)
    const [isConnected,setIsConnected]=useState(false)
    useEffect(()=>{
        const socketInstance=new(ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!,{
             path:"/api/socket/io",
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttemps: 10,
            addTrailingSlash:false
        })

        socketInstance.on("connect",()=>{
            console.log(`SETTING IS CONNECTED TO TRUE`)
            console.log(`Socket connected with ID: ${socketInstance.id}`);

            return(
            setIsConnected(true)
        )}
        ),

        // socketInstance.on("disconnect", (reason, details) => {
        //     // the reason of the disconnection, for example "transport error"
        //     console.log(reason);
          
        //     // the low-level reason of the disconnection, for example "xhr post error"
        //     console.log(details.message);
          
        //     // some additional description, for example the status code of the HTTP response
        //     console.log(details.description);
          
        //     // some additional context, for example the XMLHttpRequest object
        //     console.log(`CONTEXT FOR THE DISCONECT ${JSON.stringify(details.context)}`);
        //   });

        socketInstance.on("connect_error", (err) => {
            // the reason of the error, for example "xhr poll error"
            console.log(err.message);
          
            // some additional description, for example the status code of the initial HTTP response
            console.log(err.description);
          
            // some additional context, for example the XMLHttpRequest object
            console.log(err.context);
          });

          socketInstance.on("connect", () => {
            const transport = socketInstance.io.engine.transport.name; // in most cases, "polling"
            console.log(`The transport is ${transport}`)
            socketInstance.io.engine.on("upgrade", () => {
              const upgradedTransport = socketInstance.io.engine.transport.name;
              console.log(`The upgradedTransport is ${upgradedTransport}`)

              
              // in most cases, "websocket"
            });

          });

        setSocket(socketInstance)

        return ()=>{
            socketInstance.disconnect()
        } 

    },[])

    return(
        <SocketContext.Provider value={{socket,isConnected}}>
            {children}
        </SocketContext.Provider>
    )
}