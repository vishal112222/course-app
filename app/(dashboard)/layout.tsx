import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { CoursesList } from "@/components/courses-list";
// import { SearchInput } from "components/search-input";
import { getCourses } from "@/actions/get-courses";




const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
    
}) => {

    const { userId } = await auth();
    //   const searchp = await searchParams;
    
      if (!userId) {
        return redirect("/");
      }
    
      const categories = await db.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
    
      const courses = await getCourses({
        userId,
       
      });
         

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">
            {children} 
            </main>



            
        </div>
    )
}

export default DashboardLayout;






// import { getCourses } from "@/actions/get-courses";

// // import { Categories } from "./_components/categories";

// interface SearchPageProps {
//   searchParams?: {
//     title?: string;
//     categoryId?: string;
//   };
// }

// const SearchPage = async ({ searchParams =  {} }: SearchPageProps) => {
//   const { userId } = await auth();
//   const searchp = await searchParams;

//   if (!userId) {
//     return redirect("/");
//   }

//   const categories = await db.category.findMany({
//     orderBy: {
//       name: "asc",
//     },
//   });

//   const courses = await getCourses({
//     userId,
//     ...searchp,
//   });

//   return (
//     <>
//       <div className="px-6 pt-6 md:hidden md:mb-0 block">
//         <SearchInput />
//       </div>
//       <div className="p-6 space-y-4">
//         {/* <Categories items={categories} /> */}
//         <CoursesList items={courses} />
//       </div>
//     </>
//   );
// };

// export default SearchPage;
