import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  error: boolean;
  data?: any;
};

// Mock database - in a real app this would use Prisma
let mockIdeas = [
  {
    id: "1",
    title: "Add dark mode to Builder.io dashboard",
    description:
      "It would be great to have a dark mode option for those late-night coding sessions. This would help reduce eye strain and provide a better development experience.",
    status: "PLANNED",
    tags: ["ui", "accessibility"],
    author: { id: "1", name: "Sarah Chen", email: "sarah@builder.io" },
    votes: 47,
    comments: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Better TypeScript support in visual editor",
    description:
      "Improve TypeScript intellisense and error handling when editing components directly in the visual editor interface.",
    status: "IN_PROGRESS",
    tags: ["typescript", "dx"],
    author: { id: "2", name: "Mike Rodriguez", email: "mike@builder.io" },
    votes: 32,
    comments: 8,
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    if (req.method === "GET") {
      // Get all ideas
      res.status(200).json({
        message: "Ideas retrieved successfully",
        error: false,
        data: mockIdeas,
      });
      return;
    }

    if (req.method === "POST") {
      // Create new idea
      const { title, description, category, tags } = req.body;

      // Validation
      if (!title || title.length < 10 || title.length > 100) {
        res.status(400).json({
          message: "Title must be between 10 and 100 characters",
          error: true,
        });
        return;
      }

      if (
        !description ||
        description.length < 20 ||
        description.length > 1000
      ) {
        res.status(400).json({
          message: "Description must be between 20 and 1000 characters",
          error: true,
        });
        return;
      }

      if (!tags || tags.length === 0) {
        res.status(400).json({
          message: "At least one tag is required",
          error: true,
        });
        return;
      }

      // Create new idea
      const newIdea = {
        id: String(mockIdeas.length + 1),
        title,
        description,
        status: "SUBMITTED",
        tags,
        author: {
          id: "1", // Mock user ID
          name: "Alex Johnson",
          email: "alex@builder.io",
        },
        votes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockIdeas.push(newIdea);

      res.status(200).json({
        message: "Idea created successfully",
        error: false,
        data: newIdea,
      });
      return;
    }

    // Method not allowed
    res.status(405).json({
      message: "Method not allowed",
      error: true,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
    });
  }
}
