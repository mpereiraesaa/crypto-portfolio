import BaseModel from "./base";

interface User extends BaseModel {
    email: string;
    password: string;
}

export default User;
