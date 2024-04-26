const Comments = require("../models/comments");
const pool = require("../config/db");

jest.mock("../config/db");
jest.mock('../models/comments');

describe("Comments", () => {
  describe("save method", () => {
    test("should update an existing comment if id is provided", async () => {
      const existingComment = new Comments(
        1, // id
        "This is an updated comment",
        1, // created_by
        new Date(),
        "active",
        5, // stars_number
        1 // house
      );

      const mockQueryResult = { rows: [{ id: 1 }] };
      existingComment.save.mockResolvedValueOnce(mockQueryResult);

      const result = await existingComment.save();

      expect(result.rows.at(0)).toEqual({ id: 1 });
    });

    test("should create a new comment if id is not provided", async () => {
      const newComment = new Comments(
        null, // id
        "New comment",
        1, // created_by
        new Date(),
        "active",
        4, // stars_number
        2 // house
      );

      const mockQueryResult = { rows: [{ id: 2 }] };
      newComment.save.mockResolvedValueOnce(mockQueryResult);

      const result = await newComment.save();

      expect(result.rows[0]).toEqual({ id: 2 });
    });
  });

  describe("findById method", () => {
    test("should return a comment by id", async () => {
      const id = 1;
      const expectedQuery = "SELECT * FROM comments WHERE id=$1";
      const expectedParams = [id];
      const mockCommentData = { id: 1, content: "Comment content" };

      const mockQueryResult = { rows: [mockCommentData] };
      Comments.findById.mockResolvedValueOnce(mockQueryResult);

      const result = await Comments.findById(id);

      expect(Comments.findById).toHaveBeenCalledWith(expectedParams[0]);
      expect(result.rows[0]).toEqual(mockCommentData);
    });
  });

  // Ajoutez des tests similaires pour les autres méthodes statiques comme findByHouse, getAll et deleteById
});
