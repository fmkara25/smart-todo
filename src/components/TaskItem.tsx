import { useState } from "react";
import type { Task } from "../types/todo";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateTitle: (id: string, newTitle: string) => void;
};

export default function TaskItem({
    task,
    onToggle,
    onDelete,
    onUpdateTitle,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.title);

    function startEdit() {
        setDraftTitle(task.title);
        setIsEditing(true);
    }

    function cancelEdit() {
        setDraftTitle(task.title);
        setIsEditing(false);
    }

    function saveEdit() {
        const trimmed = draftTitle.trim();
        if (!trimmed) return;

        onUpdateTitle(task.id, trimmed);
        setIsEditing(false);
    }

    const priorityStyle =
        task.priority === "High"
            ? "border-rose-100 bg-rose-50 text-rose-600"
            : task.priority === "Medium"
                ? "border-amber-100 bg-amber-50 text-amber-600"
                : "border-emerald-100 bg-emerald-50 text-emerald-600";

    return (
        <li
            className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${task.completed
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-slate-100 bg-white"
                }`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                    {isEditing ? (
                        <div>
                            <input
                                value={draftTitle}
                                onChange={(event) => setDraftTitle(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                                autoFocus
                            />

                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={!draftTitle.trim()}
                                    className="rounded-2xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p
                                className={`text-base font-bold ${task.completed
                                        ? "text-slate-400 line-through"
                                        : "text-slate-800"
                                    }`}
                            >
                                {task.title}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                                <span className={`rounded-full border px-3 py-1 ${priorityStyle}`}>
                                    {task.priority}
                                </span>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-500">
                                    Due: {task.dueDate ?? "—"}
                                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 ${task.completed
                                            ? "border-emerald-100 bg-emerald-100 text-emerald-700"
                                            : "border-sky-100 bg-sky-50 text-sky-600"
                                        }`}
                                >
                                    {task.completed ? "Done" : "Active"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => onToggle(task.id)}
                            className={`rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 ${task.completed
                                    ? "bg-sky-500 hover:bg-sky-600"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                        >
                            {task.completed ? "Mark active" : "Complete"}
                        </button>

                        <button
                            type="button"
                            onClick={startEdit}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(task.id)}
                            className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}