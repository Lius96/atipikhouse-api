const axios = require("axios");

const apiBaseUrl = "http://localhost:4000";
jest.mock("axios")
describe("Test API's", () => {
  // Test de connexion avec un utilisateur non valide
  test("test login with invalid user", async () => {
    const unvalidUser = {
      email: "admin@admin.com",
      password: "KSD&Ap?DAWAc",
    };

    const { status, data } = await axios.post(
      `${apiBaseUrl}/api/v1/login/`,
      unvalidUser
    );
    // axios.post.mock.results()
    // Assertions
    expect(status).toBe(200);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Bad credential");
  });
});
