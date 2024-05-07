import userModel from "@src/repository/models/user_model";
export default abstract class UserService {
  public static async createUser(user: User) {
    const result = await userModel.create(user);
    return result;
  }

  public static async findUserByEmail(email: string) {
    const result = await userModel.findOne({ email: email });
    return result;
  }
}
