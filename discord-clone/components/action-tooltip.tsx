import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  
  interface ActionTooltTipsProp{
    label:string,
    children:React.ReactNode,
    side:"left" | "right" |"top" |"bottom",
    align:"start" | "center" | "end"
  }
  
const ActionToolTip=({
    label,
    children,
    side,
    align
  }:ActionTooltTipsProp)=>{
        
         
          return (
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                       {children}
                 </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                  <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
        
 

export default ActionToolTip