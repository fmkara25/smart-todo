import { useState } from "react";
import type { Task } from "../types/todo";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateTitle: (id: string, newTitle: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onUpdateTitle }: Props) {
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

    return (
        <li className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    {isEditing ? (
                        <div>
                            <input
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
                                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                autoFocus
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={!draftTitle.trim()}
                                    className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Kaydet
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-gray-800"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className={`text-sm font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>
                                {task.title}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                                <span className="rounded-full border px-2 py-0.5">Priority: {task.priority}</span>
                                <span className="rounded-full border px-2 py-0.5">Due: {task.dueDate ?? "—"}</span>
                                <span className="rounded-full border px-2 py-0.5">
                                    Status: {task.completed ? "Done" : "Active"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                        <button
                            type="button"
                            onClick={() => onToggle(task.id)}
                            className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                        >
                            {task.completed ? "Aktif yap" : "Tamamla"}
                        </button>

                        <button
                            type="button"
                            onClick={startEdit}
                            className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                        >
                            Düzenle
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(task.id)}
                            className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                            Sil
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}
