import React, { memo, useMemo } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Flame, Target, CheckCircle2, Clock } from "lucide-react";

const TaskStats = memo(function TaskStats() {
  const { stats } = useTaskContext();

  const progressPercentage = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats.total, stats.completed]);

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Streak",
      value: `${stats.streak}d`,
      icon: Flame,
      color: "text-destructive",
      bg: "bg-destructive/10",
      highlight: stats.streak >= 3,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, highlight }) => (
          <div
            key={label}
            className={`glass relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-soft ${
              highlight ? "ring-2 ring-destructive/20" : ""
            }`}
          >
            <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            {highlight && (
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-destructive/5 blur-2xl" />
            )}
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="font-mono text-lg font-bold text-foreground">{progressPercentage}%</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 blur-sm transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{stats.completedToday} completed today</span>
            <span>{stats.pending} remaining</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskStats;
