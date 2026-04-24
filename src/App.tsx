import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Filter, Priority, Task } from "./types/todo";
import TaskItem from "./components/TaskItem";

const DEMO_TASKS: Task[] = [
    {
        id: "t1",
        title: "Task 1",
        completed: true,
        priority: "Medium",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
        id: "t2",
        title: "Task 2",
        completed: false,
        priority: "High",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 60,
    },
    {
        id: "t3",
        title: "Task 3",
        completed: false,
        priority: "Low",
        dueDate: null,
        createdAt: Date.now() - 1000 * 60 * 10,
    },
];

const STORAGE_KEY = "smart-todo.tasks.v1";

function uid() {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : `id_${Math.random().toString(16).slice(2)}`;
}

function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEMO_TASKS;

        const parsed = JSON.parse(raw) as Task[];
        if (!Array.isArray(parsed)) return DEMO_TASKS;

        return parsed;
    } catch {
        return DEMO_TASKS;
    }
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
    const [filter, setFilter] = useState<Filter>("all");
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [dueDate, setDueDate] = useState("");

    const remainingCount = useMemo(
        () => tasks.filter((task) => !task.completed).length,
        [tasks]
    );

    const completedCount = useMemo(
        () => tasks.filter((task) => task.completed).length,
        [tasks]
    );

    const sortedVisibleTasks = useMemo(() => {
        const searchText = query.trim().toLowerCase();

        const filtered = tasks.filter((task) => {
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "active"
                        ? !task.completed
                        : task.completed;

            const matchesSearch = searchText
                ? task.title.toLowerCase().includes(searchText)
                : true;

            return matchesFilter && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "dueDate") {
                const aTime = a.dueDate
                    ? new Date(a.dueDate).getTime()
                    : Number.POSITIVE_INFINITY;

                const bTime = b.dueDate
                    ? new Date(b.dueDate).getTime()
                    : Number.POSITIVE_INFINITY;

                return aTime - bTime;
            }

            const priorityRank: Record<Priority, number> = {
                High: 3,
                Medium: 2,
                Low: 1,
            };

            return priorityRank[b.priority] - priorityRank[a.priority];
        });
    }, [tasks, filter, query, sortBy]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    function addTask(event: FormEvent) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        const newTask: Task = {
            id: uid(),
            title: trimmedTitle,
            completed: false,
            priority,
            dueDate: dueDate || null,
            createdAt: Date.now(),
        };

        setTasks((prev) => [newTask, ...prev]);
        setTitle("");
        setPriority("Medium");
        setDueDate("");
    }

    function toggleTask(id: string) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }

    function deleteTask(id: string) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }

    function updateTaskTitle(id: string, newTitle: string) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, title: newTitle } : task
            )
        );
    }

    function clearCompleted() {
        setTasks((prev) => prev.filter((task) => !task.completed));
    }

    function resetDemo() {
        localStorage.removeItem(STORAGE_KEY);
        setTasks(DEMO_TASKS);
        setFilter("all");
        setQuery("");
        setSortBy("dueDate");
    }

    return (
        <main className="min-h-screen px-4 py-8 text-slate-800 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <header className="mb-8 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-indigo-100/70 backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">
                                Smart Planner
                            </p>

                            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                Smart To-Do
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                                Manage your tasks.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 px-6 py-5 text-white shadow-xl shadow-indigo-200">
                            <p className="text-xs font-medium opacity-80">Remaining tasks</p>
                            <p className="text-4xl font-black">{remainingCount}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50/90 p-4">
                            <p className="text-xs text-slate-500">Total</p>
                            <p className="mt-1 text-2xl font-bold text-slate-800">{tasks.length}</p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50/90 p-4">
                            <p className="text-xs text-emerald-600">Completed</p>
                            <p className="mt-1 text-2xl font-bold text-emerald-700">
                                {completedCount}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900">Add new task</h2>

                    <form onSubmit={addTask} className="mt-4 space-y-4">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="What do you want to do today?"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <select
                                value={priority}
                                onChange={(event) => setPriority(event.target.value as Priority)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            >
                                <option value="Low">Low priority</option>
                                <option value="Medium">Medium priority</option>
                                <option value="High">High priority</option>
                            </select>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(event) => setDueDate(event.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            />

                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </section>

                <div className="mt-5 flex justify-center">
                    <div className="inline-flex rounded-2xl border border-white/80 bg-white/80 p-1 shadow-lg shadow-slate-200/70 backdrop-blur">
                        {(["all", "active", "completed"] as Filter[]).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setFilter(item)}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition ${filter === item
                                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
                                        : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                {item === "all"
                                    ? "All"
                                    : item === "active"
                                        ? "Active"
                                        : "Completed"}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="mt-6 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Tasks</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Showing: {sortedVisibleTasks.length} • Total: {tasks.length}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={clearCompleted}
                                disabled={!tasks.some((task) => task.completed)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Clear completed
                            </button>

                            <button
                                type="button"
                                onClick={resetDemo}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Reset demo
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search tasks..."
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />

                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value as "dueDate" | "priority")
                            }
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="dueDate">Sort by: Due date</option>
                            <option value="priority">Sort by: Priority</option>
                        </select>
                    </div>

                    {sortedVisibleTasks.length === 0 ? (
                        <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
                            <p className="text-sm font-semibold text-slate-600">
                                No tasks yet  ✨ 
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                Start by adding a new task above.
                            </p>
                        </div>
                    ) : (
                        <ul className="mt-5 space-y-3">
                            {sortedVisibleTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={deleteTask}
                                    onUpdateTitle={updateTaskTitle}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}