
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: any) => {
  const { courseId } = await params;

  // Fetch the course along with published chapters
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  // If the course doesn't exist, redirect to home page
  if (!course) {
    return redirect("/");
  }

  // If the course has no published chapters, redirect to home page or handle accordingly
  if (course.chapters.length === 0) {
    return redirect("/"); // You could redirect to a different page if needed
  }

  // Redirect to the first published chapter
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
