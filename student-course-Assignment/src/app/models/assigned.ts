import { Course } from "./course";

export interface AssignedStudent {
    id:number;
    name: string;
    rollNumber: string;
    courses: Course[];
}