import PasswordManager from "../PasswordManager";

describe("Test password manager", () => {
  it("Should provide different string when hashed", () => {
    const PASSWORD = "password";
    const hashed = PasswordManager.hash(PASSWORD);
    expect(hashed).not.toBe(PASSWORD);
  });
  it("Should return true for same password comparison", () => {
    const PASSWORD = "password";
    const hashed = PasswordManager.hash(PASSWORD);
    const comparisonResult = PasswordManager.compare(PASSWORD, hashed);
    expect(comparisonResult).toBe(true);
  });
  it("Should return false for different password comparison", () => {
    const PASSWORD = "password";
    const hashed = PasswordManager.hash(PASSWORD);
    const comparisonResult = PasswordManager.compare("pass", hashed);
    expect(comparisonResult).toBe(false);
  });
});
