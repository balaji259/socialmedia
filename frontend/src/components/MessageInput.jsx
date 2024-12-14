import {useRef,useState} from "react";
import {useChatStore} from "./useChatStore";
import {Send,Image,X} from"lucide-react";

const MessageInput=() =>{

    const [text,setText]=useState("");
  
    const [mediaPreview, setMediaPreview] = useState(null); // Handle both image and video
    const [mediaType, setMediaType] = useState(null); // Track media type (image or video)

    const fileInputRef=useRef(null);
    const { sendMessages }=useChatStore();

    

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            // Show a toast or alert for unsupported file type
            console.error("Please select an image or video file!");
            return;
        }

        setMediaType(isImage ? "image" : "video");

        const reader = new FileReader();
        reader.onloadend = () => {
            setMediaPreview(reader.result); // Set the preview URL
        };

        reader.readAsDataURL(file);
    };

    


    const removeMedia = () => {
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage=async (e) => {
        e.preventDefault();
        if(!text.trim() && !mediaPreview) return;

        try{
            await sendMessages({
                text: text.trim(),
                // image: imagePreview,
                media: mediaPreview,
                mediaType, // Include media type (image or video)
            });

            //clear form
            setText("");
            // setImagePreview(null);
            setMediaPreview(null);
            setMediaType(null);
            if(fileInputRef.current) fileInputRef.current.value="";
        }catch(e){
            console.error("Failed to send message:",e);
        }
    };




    return (
        <div className="p-4 w-full">
            {/* {imagePreview && ( */}
            {mediaPreview && (
            <div className="mb-3 flex items-center gap-2">
                <div className="relative">
             
                {mediaType === "image" && (
                            <img
                                src={mediaPreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border-zinc-700"
                            />
                        )}
                        {mediaType === "video" && (
                            <video
                                src={mediaPreview}
                                controls
                                className="w-20 h-20 object-cover rounded-lg border-zinc-700"
                            />
                        )}
               
                      <button
                            onClick={removeMedia}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>


            </div>
            </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                   <div className="flex-1 flex gap-2 items-center">
                        <input 
                            type="text"
                            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                            placeholder="Type a message here!"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />

                        <input 
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleMediaChange}
                        />

                        <button 
                            type="button"
                            className={`hidden sm:flex btn btn-circle ${mediaPreview ? "text-emerald-500" : "text-zinc-400"}`}
                            onClick={()=>fileInputRef.current?.click()}
                        >
                            <Image size={20} />    
                        </button>    

                   </div>

                   <button 
                        type="submit"
                        className="btn btn-sm btn-circle"
                        disabled={!text.trim() && !mediaPreview}
                    >
                        <Send size={22} />
                    </button>
            </form>


        </div>
        
    );

}

export default MessageInput;