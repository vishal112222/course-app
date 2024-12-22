import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoursesPage = () => {
    return (
        <div className="p-6">
            <Link href="/teacher/create">
            <Button className="bg-black  text-white hover:text-black">
               Courses page!
            </Button>
            </Link>
        </div>
    );
}


export default CoursesPage;