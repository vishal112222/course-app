import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { CoursesList } from '@/components/courses-list'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCourses } from '@/actions/get-courses'



// interface SearchPageProps {
//     searchParams?: {
//       purchases?: "Number"
//     };
//   }
  
const  Home = async ( ) => {

  

  const { userId  } = await auth();
  
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

    const purchasedCourse = courses.filter ( (course,index)=> {
      // console.log("purchases===>",course.purchases)
       if(course.purchases.length != 0)    
        return courses; 
    })

    // console.log(courses[1].purchases)
  return (
    
    <div className="p-6 space-y-4">
     {/* <Categories items={categories} /> */}
           <CoursesList items={purchasedCourse} />
          </div> 

  //   <div>
  //       <UserButton 
  //           afterSignOutUrl="/"
  //       />
  //  </div>
  )
}

export default Home;







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

