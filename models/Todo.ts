export interface Todo {
    id: string,
    text: string,
    isCompleted: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}