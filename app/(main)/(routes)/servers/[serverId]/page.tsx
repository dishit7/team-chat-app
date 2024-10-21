import { MobileToggle } from "@/components/mobile-toggle";

interface ServerIdPageProps{
   params:{ 
    serverId:string
   }
}
const ServerIdPage = ({params}:ServerIdPageProps) => {
 console.log(`params.serverId is ${params.serverId}`)    
    return (<>
        <MobileToggle serverId={params.serverId} />
        <h1>{params.serverId}</h1>
        </>
    );
};

export default ServerIdPage;
