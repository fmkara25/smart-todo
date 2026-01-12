import { useMemo, useState } from "react";
import type { Priority, Task } from "./types/todo";
import TaskItem from "./components/TaskItem";

const DEMO_TASKS: Task[] = [
    {
        id: "t1",
        title: "Vite + Tailwind kurulumu tamamla",
        completed: true,
        priority: "Medium",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
        id: "t2",
        title: "UI iskeletini bitir",
        completed: false,
        priority: "High",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 60,
    },
    {
        id: "t3",
        title: "LocalStorage kaydını ekle",
        completed: false,
        priority: "Low",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 10,
    },
];

function uid() {
    // basit id üretimi (ileride istersen nanoid kullanırız)
    return crypto.randomUUID ? crypto.randomUUID() : `id_${Math.random().toString(16).slice(2)}`;
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);

    // Form state
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [dueDate, setDueDate] = useState<string>(""); // input için string, kaydederken null'a çevireceğiz

    const remainingCount = useMemo(
        () => tasks.filter((t) => !t.completed).length,
        [tasks]
    );
    function toggleTask(id: string) {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    }

    function deleteTask(id: string) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    function updateTaskTitle(id: string, newTitle: string) {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
        );
    }
    function addTask(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;

        const newTask: Task = {
            id: uid(),
            title: trimmed,
            completed: false,
            priority,
            dueDate: dueDate ? dueDate : null,
            createdAt: Date.now(),
        };

        setTasks((prev) => [newTask, ...prev]);
        setTitle("");
        setPriority("Medium");
        setDueDate("");
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="mx-auto max-w-2xl p-4 sm:p-6">
                {/* Header */}
                <header className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Smart To-Do
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Kalan görev: <span className="font-semibold">{remainingCount}</span>
                        </p>
                    </div>
                    <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
                        React + TS + Tailwind
                    </span>
                </header>

                {/* Add form */}
                <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="text-sm font-semibold text-gray-800">Yeni görev ekle</h2>

                    <form onSubmit={addTask} className="mt-3 space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-700">
                                Görev başlığı
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: CV için 2 repo daha ekle"
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div>
                                <label className="text-xs font-medium text-gray-700">
                                    Öncelik
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700">
                                    Son tarih
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={!title.trim()}
                                    className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Ekle
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* List / Empty state */}
                <section className="mt-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">Görevler</h2>
                        <span className="text-xs text-gray-500">
                            Toplam: {tasks.length}
                        </span>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="mt-3 rounded-2xl border bg-white p-6 text-center text-sm text-gray-600 shadow-sm">
                            Henüz görev yok. Yukarıdan bir görev ekleyerek başlayabilirsin ✨
                        </div>
                    ) : (
                                <ul className="mt-3 space-y-2">
                                    {tasks.map((t) => (
                                        <TaskItem
                                            key={t.id}
                                            task={t}
                                            onToggle={toggleTask}
                                            onDelete={deleteTask}
                                            onUpdateTitle={updateTaskTitle}
                                        />
                                    ))}
                                </ul>
                            )}
                </section>
            </div>
        </div>
    );
}
