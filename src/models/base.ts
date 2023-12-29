import { Document } from "mongodb";

interface BaseModel extends Document {
    updatedAt?: Date;
}

export default BaseModel;
