import { Document } from "mongodb";

interface BaseModel extends Document {
    createdDate?: Date;
    updatedDate?: Date;
}

export default BaseModel;
