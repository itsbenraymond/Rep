"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronLeft,
  Dumbbell,
  Flame,
  History,
  Plus,
  Search,
  Timer,
  X,
} from "lucide-react";

type Exercise = {
  name: string;
  area: string;
  sets: number;
  active: boolean;
};

type SetEntry = {
  date: string;
  exercise: string;
  weight: number;
  reps: number;
};

const exerciseLibrary: Exercise[] = [
  { name: "Cable Lat Pulldown", area: "Back", sets: 2, active: true },
  { name: "Dumbbell Incline Bench Press", area: "Chest", sets: 2, active: true },
  { name: "Dumbbell Lateral Raise", area: "Shoulders", sets: 2, active: true },
  { name: "Cable Tricep Pushdown", area: "Triceps", sets: 2, active: true },
  { name: "Dumbbell Curl", area: "Biceps", sets: 2, active: true },
  { name: "Dumbbell Shoulder Press", area: "Shoulders", sets: 2, active: false },
  { name: "Cable Curl", area: "Biceps", sets: 2, active: false },
];

const history: SetEntry[] = [
  { date: "2026-04-15", exercise: "Dumbbell Curl", weight: 12, reps: 10 },
  { date: "2026-04-22", exercise: "Dumbbell Curl", weight: 12, reps: 12 },
  { date: "2026-04-29", exercise: "Dumbbell Curl", weight: 14, reps: 9 },
  { date: "2026-05-06", exercise: "Dumbbell Curl", weight: 14, reps: 11 },
  { date: "2026-04-16", exercise: "Dumbbell Lateral Raise", weight: 7, reps: 12 },
  { date: "2026-04-23", exercise: "Dumbbell Lateral Raise", weight: 8, reps: 10 },
  { date: "2026-05-07", exercise: "Dumbbell Lateral Raise", weight: 8, reps: 12 },
  { date: "2026-04-17", exercise: "Cable Curl", weight: 22.5, reps: 12 },
  { date: "2026-04-24", exercise: "Cable Curl", weight: 25, reps: 10 },
  { date: "2026-04-18", exercise: "Dumbbell Shoulder Press", weight: 18, reps: 8 },
  { date: "2026-04-25", exercise: "Dumbbell Shoulder Press", weight: 20, reps: 7 },
  { date: "2026-05-02", exercise: "Cable Lat Pulldown", weight: 45, reps: 10 },
  { date: "2026-05-09", exercise: "Cable Lat Pulldown", weight: 50, reps: 8 },
];

const ranges = ["7D", "30D", "All"] as const;

function bestVolume(rows: SetEntry[]) {
  return rows.reduce((max, row) => Math.max(max, row.weight * row.reps), 0);
}

function filterByRange(rows: SetEntry[], range: (typeof ranges)[number]) {
  if (!rows.length) return [];
  if (range === "All") return rows;
  const days = range === "7D" ? 7 : 30;
  const latest = new Date(Math.max(...rows.map((row) => new Date(row.date).getTime())));
  const cutoff = new Date(latest);
  cutoff.setDate(latest.getDate() - days);
  return rows.filter((row) => new Date(row.date) >= cutoff);
}

export default function Home() {
  const [tab, setTab] = useState<"today" | "progress">("today");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<(typeof ranges)[number]>("30D");
  const [selectedExercise, setSelectedExercise] = useState("All");
  const [progressQuery, setProgressQuery] = useState("All");
  const [activeExercises, setActiveExercises] = useState(
    exerciseLibrary.filter((exercise) => exercise.active),
  );

  const visibleExerciseOptions = exerciseLibrary.filter(
    (exercise) =>
      !query ||
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.area.toLowerCase().includes(query.toLowerCase()),
  );

  const visibleProgressOptions = ["All", ...exerciseLibrary.map((exercise) => exercise.name)]
    .filter((name) => name.toLowerCase().includes(progressQuery.toLowerCase()))
    .slice(0, 5);

  const activeNames = new Set(activeExercises.map((exercise) => exercise.name));

  function addExercise(exercise: Exercise) {
    if (activeNames.has(exercise.name)) return;
    setActiveExercises((items) => [...items, exercise]);
  }

  function removeExercise(exerciseName: string) {
    setActiveExercises((items) => items.filter((exercise) => exercise.name !== exerciseName));
  }

  function moveExercise(exerciseName: string, direction: -1 | 1) {
    setActiveExercises((items) => {
      const index = items.findIndex((exercise) => exercise.name === exerciseName);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;
      const next = [...items];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function chooseProgressExercise(exerciseName: string) {
    setSelectedExercise(exerciseName);
    setProgressQuery(exerciseName);
  }

  const inactiveCount = exerciseLibrary.filter(
    (exercise) => !activeNames.has(exercise.name),
  );

  const progressRows = useMemo(() => {
    const scoped =
      selectedExercise === "All"
        ? history
        : history.filter((row) => row.exercise === selectedExercise);
    return filterByRange(scoped, range);
  }, [range, selectedExercise]);

  const chartMax = Math.max(1, bestVolume(progressRows));
  const totalVolume = progressRows.reduce((sum, row) => sum + row.weight * row.reps, 0);
  const bestSet = progressRows.reduce(
    (best, row) => (row.weight * row.reps > best.weight * best.reps ? row : best),
    { date: "", exercise: "No data", weight: 0, reps: 0 },
  );

  function openProgress(exercise: string) {
    setSelectedExercise(exercise);
    setTab("progress");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#f4f1ec]">
      <section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-4 pb-8 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8d918d]">
              Rep
            </p>
            <h1 className="text-[26px] font-black tracking-[-0.04em]">Training</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
            <Activity size={20} />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-[18px] border border-white/10 bg-white/[0.055] p-1">
          <button
            type="button"
            onClick={() => setTab("today")}
            className={`flex h-11 items-center justify-center gap-2 rounded-[14px] text-sm font-black ${tab === "today" ? "bg-[#f4f1ec] text-black" : "text-[#a4a7a2]"}`}
          >
            <Dumbbell size={17} /> Today
          </button>
          <button
            type="button"
            onClick={() => setTab("progress")}
            className={`flex h-11 items-center justify-center gap-2 rounded-[14px] text-sm font-black ${tab === "progress" ? "bg-[#f4f1ec] text-black" : "text-[#a4a7a2]"}`}
          >
            <BarChart3 size={17} /> Progress
          </button>
        </div>

        {tab === "today" ? (
          <div className="space-y-3">
            <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,#111_0%,#050505_62%,#17200f_100%)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8d918d]">
                    Rest timer
                  </p>
                  <p className="mt-1 text-4xl font-black tracking-[-0.05em]">2:30</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ff49] text-black">
                    <Timer size={18} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#a4a7a2]">
                    <History size={18} />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-white/10 bg-[#0b0b0b] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
              <div className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-[#050505] px-3 ring-1 ring-[#d7ff49]/0 focus-within:ring-[#d7ff49]/50">
                <Search size={17} className="text-[#8d918d]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search exercises"
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#72766f]"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-[#a4a7a2]"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#72766f]">
                  Exercise order
                </p>
                <p className="text-[10px] font-black text-[#8d918d]">
                  {activeExercises.length} on / {inactiveCount.length} paused
                </p>
              </div>
              <div className="mt-2 space-y-1.5">
                {visibleExerciseOptions.map((exercise) => {
                  const active = activeNames.has(exercise.name);
                  const order = activeExercises.findIndex((item) => item.name === exercise.name);
                  return (
                    <div
                      key={exercise.name}
                      className={`grid grid-cols-[1fr_auto] items-center gap-2 rounded-[15px] border px-3 py-2 ${
                        active
                          ? "border-[#d7ff49]/25 bg-[#d7ff49]/[0.055]"
                          : "border-white/10 bg-white/[0.035]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => (active ? openProgress(exercise.name) : addExercise(exercise))}
                        className="min-w-0 text-left"
                      >
                        <span className="block truncate text-[13px] font-black text-[#f4f1ec]">
                          {exercise.name}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#72766f]">
                          {active ? `Active ${order + 1}` : "Paused"} / {exercise.area}
                        </span>
                      </button>
                      {active ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Move ${exercise.name} up`}
                            onClick={() => moveExercise(exercise.name, -1)}
                            disabled={order <= 0}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-[#a4a7a2] disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${exercise.name} down`}
                            onClick={() => moveExercise(exercise.name, 1)}
                            disabled={order === activeExercises.length - 1}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-[#a4a7a2] disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${exercise.name}`}
                            onClick={() => removeExercise(exercise.name)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[#f4f1ec]"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Add ${exercise.name}`}
                          onClick={() => addExercise(exercise)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f1ec] text-black"
                        >
                          <Plus size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3">
              {activeExercises.map((exercise) => {
                const last = history.filter((row) => row.exercise === exercise.name).at(-1);
                return (
                  <article key={exercise.name} className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4">
                    <button
                      type="button"
                      onClick={() => openProgress(exercise.name)}
                      className="mb-3 flex w-full items-start justify-between gap-3 text-left"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8d918d]">
                          {exercise.area}
                        </p>
                        <h2 className="mt-1 text-lg font-black tracking-[-0.03em]">
                          {exercise.name}
                        </h2>
                        <p className="mt-1 text-[11px] font-bold text-[#8d918d]">
                          {last ? `Last ${last.weight}kg x ${last.reps}` : "No logged sets yet"}
                        </p>
                      </div>
                      <BarChart3 size={18} className="mt-1 text-[#d7ff49]" />
                    </button>
                    <div className="grid grid-cols-[34px_1fr_1fr_42px] gap-2">
                      {[1, 2].map((setNumber) => (
                        <div className="contents" key={setNumber}>
                          <div className="flex h-10 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-black text-[#a4a7a2]">
                            {setNumber}
                          </div>
                          <input className="h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-base font-black outline-none" inputMode="decimal" placeholder="kg" />
                          <input className="h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-base font-black outline-none" inputMode="numeric" placeholder="reps" />
                          <button className="h-10 rounded-xl bg-[#f4f1ec] text-xs font-black text-black">
                            Log
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        ) : (
          <div className="space-y-3">
            <section className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4">
              <button
                type="button"
                onClick={() => setTab("today")}
                className="mb-3 flex items-center gap-1 text-xs font-black text-[#a4a7a2]"
              >
                <ChevronLeft size={16} /> Workout
              </button>
              <div className="flex items-center gap-2 rounded-[16px] border border-white/10 bg-black/30 px-3">
                <Search size={17} className="text-[#8d918d]" />
                <input
                  value={progressQuery}
                  onChange={(event) => setProgressQuery(event.target.value)}
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm font-black outline-none"
                />
                <button
                  type="button"
                  onClick={() => chooseProgressExercise("All")}
                  className="rounded-full bg-[#d7ff49] px-3 py-1 text-[11px] font-black text-black"
                >
                  All
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleProgressOptions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => chooseProgressExercise(name)}
                    className={`min-h-8 rounded-full border px-3 text-[11px] font-black ${
                      selectedExercise === name
                        ? "border-[#d7ff49]/40 bg-[#d7ff49] text-black"
                        : "border-white/10 bg-white/[0.055] text-[#d9ddd6]"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,#101010,#050505)] p-4">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8d918d]">
                    Progress
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">
                    {selectedExercise}
                  </h2>
                </div>
                <div className="flex rounded-full border border-white/10 bg-white/[0.05] p-1">
                  {ranges.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRange(item)}
                      className={`h-8 rounded-full px-3 text-[11px] font-black ${range === item ? "bg-[#f4f1ec] text-black" : "text-[#8d918d]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8d918d]">Sets</p>
                  <p className="mt-1 text-xl font-black">{progressRows.length}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8d918d]">Volume</p>
                  <p className="mt-1 text-xl font-black">{Math.round(totalVolume)}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8d918d]">Best</p>
                  <p className="mt-1 text-xl font-black">{bestSet.weight ? `${bestSet.weight}kg` : "-"}</p>
                </div>
              </div>

              <div className="flex h-52 items-end gap-2 rounded-2xl border border-white/10 bg-black/30 p-3">
                {progressRows.map((row) => {
                  const volume = row.weight * row.reps;
                  return (
                    <div key={`${row.date}-${row.exercise}-${row.weight}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-md bg-[#d7ff49]"
                        style={{ height: `${Math.max(8, (volume / chartMax) * 170)}px` }}
                        title={`${row.exercise}: ${volume}kg`}
                      />
                      <span className="max-w-full truncate text-[9px] font-bold text-[#72766f]">
                        {row.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-2">
              {progressRows.slice().reverse().map((row) => (
                <div key={`${row.date}-${row.exercise}-${row.reps}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                  <div>
                    <p className="text-sm font-black">{row.exercise}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-[#8d918d]">{row.date}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-black">
                    <Flame size={16} className="text-[#d7ff49]" />
                    {row.weight}kg x {row.reps}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
