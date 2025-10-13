export interface Course {
    id: number;
    name: string;
    courseCode: string; 
}

export const COURSES: Course[] = [
    { id: 1, name: 'Mathematics', courseCode: 'MATH101' },
    { id: 2, name: 'Physics', courseCode: 'PHYS101' },
];

