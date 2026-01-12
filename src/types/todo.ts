export type Priority = "Low" | "Medium" | "High";

export type Filter = "all" | "active" | "completed";

export type SortBy = "dueDate" | "priority";

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    dueDate: string | null; // "YYYY-MM-DD" veya null
    createdAt: number; // Date.now()
}
