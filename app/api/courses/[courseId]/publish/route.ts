

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user owns the course and if the course exists
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true, 
          }, 
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course to mark it as published
    const publishedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
