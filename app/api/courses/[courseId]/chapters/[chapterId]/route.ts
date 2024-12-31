import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const muxClient =  new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify course ownership
    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the chapter exists
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Handle Mux video deletion if it exists
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        try {
          await muxClient.video.assets.delete(existingMuxData.assetId);
          await db.muxData.delete({ where: { id: existingMuxData.id } });
        } catch (error) {
          console.error("[Mux Video Delete Error]", error);
        }
      }
    }

    // Delete the chapter
    const deletedChapter = await db.chapter.delete({ where: { id: chapterId } });

    // Unpublish course if no published chapters remain
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (publishedChapters.length === 0) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify course ownership
    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update chapter details
    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: { ...values },
    });

    // Handle Mux video updates
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      // Delete existing video asset if needed
      if (existingMuxData) {
        try {
          await muxClient.video.assets.delete(existingMuxData.assetId);
          await db.muxData.delete({ where: { id: existingMuxData.id } });
        } catch (error) {
          console.error("[Mux Video Delete Error]", error);
        }
      }

      // Create a new video asset
      try {
        const asset = await muxClient.video.assets.create({
          input: [{ url: values.videoUrl }],
          playback_policy: ["public"],
          test: false,
        });

        if (asset) {
          await db.muxData.create({
            data: {
              chapterId,
              assetId: asset.id,
              playbackId: asset.playback_ids?.[0]?.id,
            },
          });
        }
      } catch (error) {
        console.error("[Mux Video Create Error]", error);
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
