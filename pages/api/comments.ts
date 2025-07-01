import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  error: boolean;
  data?: any;
};

// Mock comments storage - in a real app this would use Prisma
let mockComments = [
  {
    id: "1",
    content: "This would be so helpful for late night work sessions!",
    ideaId: "1",
    user: { id: "1", name: "Alex Johnson", email: "alex@builder.io" },
    createdAt: "2024-01-16T09:30:00Z",
  },
  {
    id: "2",
    content: "Agreed! Dark mode is essential for developer productivity.",
    ideaId: "1",
    user: { id: "2", name: "Sarah Chen", email: "sarah@builder.io" },
    createdAt: "2024-01-16T10:15:00Z",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    if (req.method === "GET") {
      // Get comments for a specific idea
      const { ideaId } = req.query;

      if (!ideaId) {
        res.status(400).json({
          message: "Idea ID is required",
          error: true,
        });
        return;
      }

      const ideaComments = mockComments.filter(
        (comment) => comment.ideaId === ideaId,
      );

      res.status(200).json({
        message: "Comments retrieved successfully",
        error: false,
        data: ideaComments,
      });
      return;
    }

    if (req.method === "POST") {
      // Add new comment
      const { content, ideaId, userId = "user1" } = req.body;

      if (!content || content.length < 1 || content.length > 500) {
        res.status(400).json({
          message: "Comment must be between 1 and 500 characters",
          error: true,
        });
        return;
      }

      if (!ideaId) {
        res.status(400).json({
          message: "Idea ID is required",
          error: true,
        });
        return;
      }

      const newComment = {
        id: String(mockComments.length + 1),
        content,
        ideaId,
        user: {
          id: userId,
          name: "Alex Johnson", // Mock user data
          email: "alex@builder.io",
        },
        createdAt: new Date().toISOString(),
      };

      mockComments.push(newComment);

      res.status(200).json({
        message: "Comment added successfully",
        error: false,
        data: newComment,
      });
      return;
    }

    // Method not allowed
    res.status(405).json({
      message: "Method not allowed",
      error: true,
    });
  } catch (error) {
    console.error("Comments API Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
    });
  }
}
