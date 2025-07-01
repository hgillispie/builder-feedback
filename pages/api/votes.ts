import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  error: boolean;
  data?: any;
};

// Mock votes storage - in a real app this would use Prisma
let mockVotes: { [key: string]: string[] } = {
  "1": ["user1"], // idea id -> array of user ids who voted
  "2": ["user1", "user2"],
  "4": ["user1"],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    if (req.method === "POST") {
      // Toggle vote for an idea
      const { ideaId, userId = "user1" } = req.body; // Using mock user ID

      if (!ideaId) {
        res.status(400).json({
          message: "Idea ID is required",
          error: true,
        });
        return;
      }

      // Initialize votes array for idea if it doesn't exist
      if (!mockVotes[ideaId]) {
        mockVotes[ideaId] = [];
      }

      const hasVoted = mockVotes[ideaId].includes(userId);

      if (hasVoted) {
        // Remove vote
        mockVotes[ideaId] = mockVotes[ideaId].filter((id) => id !== userId);
      } else {
        // Add vote
        mockVotes[ideaId].push(userId);
      }

      const newVoteCount = mockVotes[ideaId].length;
      const newHasVoted = !hasVoted;

      res.status(200).json({
        message: hasVoted ? "Vote removed" : "Vote added",
        error: false,
        data: {
          ideaId,
          votes: newVoteCount,
          hasVoted: newHasVoted,
        },
      });
      return;
    }

    if (req.method === "GET") {
      // Get vote counts for all ideas
      const voteCounts: { [key: string]: number } = {};
      const userVotes: { [key: string]: boolean } = {};
      const userId = (req.query.userId as string) || "user1";

      Object.keys(mockVotes).forEach((ideaId) => {
        voteCounts[ideaId] = mockVotes[ideaId].length;
        userVotes[ideaId] = mockVotes[ideaId].includes(userId);
      });

      res.status(200).json({
        message: "Vote data retrieved",
        error: false,
        data: { voteCounts, userVotes },
      });
      return;
    }

    // Method not allowed
    res.status(405).json({
      message: "Method not allowed",
      error: true,
    });
  } catch (error) {
    console.error("Votes API Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
    });
  }
}
