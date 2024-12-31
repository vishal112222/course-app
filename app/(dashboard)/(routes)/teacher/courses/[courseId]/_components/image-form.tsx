"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image  from "next/image"
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: String;
};


const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});



export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Image updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded p-4">
            <div className=" font-medium flex items-center justify-between">
            Course Image  
            <Button onClick={toggleEdit} variant="ghost">
                { isEditing && (
                    <>Cancel</>
                )}
                { !isEditing && !initialData.imageUrl && (
                    <>  
                    <PlusCircle className="h-4 w-4 mr-2" /> 
                      Add an Image
                    </>
                )}
                { !isEditing && initialData.imageUrl && (
                    <>
                     <Pencil className="h-4 w-4 mr-2"/>
                      Edit image
                    </>
                )}
            </Button>
            </div>

            { !isEditing && (
              !initialData.imageUrl? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <ImageIcon className="h-10 w-10 text-slate-500" />
                </div>
              ): (
                <div className="relative aspect-video mt-2">
                    <Image
                     className="object-cover rounded-md"
                     alt="Upload"
                     fill
                     src={initialData.imageUrl || "/placeholder-image.png"}                     />
                </div>
              )
            )
        }

            {isEditing && (
              <div>
                <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                    if(url) {
                        onSubmit({ imageUrl: url });
                    }
                }}
                />
                <div className="text-xs text text-muted-foreground mt-4">
                    16:9 aspact ratio recommended
                </div>
              </div>
            )}
        </div>
    )
}