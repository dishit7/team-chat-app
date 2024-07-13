"use client" 


import { UploadDropzone } from "@/lib/uploadthing";
import { UploadButton } from "@/lib/uploadthing";
import X from "lucide-react"
import Image from "next/image";
interface FileUploadProps{
    onChange:(url?:string)=>void;
    value:string ;
    endpoint:"msgFile" | "serverImage"
}
export const FileUpload=({
    onChange,
    value,
    endpoint
}:FileUploadProps)=>{
    const fileType= value?.split(".").pop()
    console.log(`${fileType} and val: ${value}`)
    if(value && fileType!=="pdf"){
        return (
            <div className="relative h-20 w-20">
              <Image
              fill
              src={value}
              alt="upload"
              className="rounded full"/>
            </div>
        )
    }
    return (<div className="bg bg-black">
    <UploadDropzone
        endpoint="serverImage"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          onChange(res?.[0].url)
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
          console.log("error")
        }}
        
      />
</div>

     )
}