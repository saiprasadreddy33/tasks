import React, { memo, useCallback } from "react";
import { RotateCcw } from "lucide-react";

import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const UndoBanner = memo(function UndoBanner() {
	const { lastDeleted, undoDelete } = useTaskContext();

	const handleUndo = useCallback(() => {
		if (!lastDeleted) return;
		undoDelete();
		toast({
			title: "Undo",
			description:
				lastDeleted.task.text.length > 80
					? `${lastDeleted.task.text.slice(0, 77)}...`
					: lastDeleted.task.text,
		});
	}, [lastDeleted, undoDelete]);

	if (!lastDeleted) return null;

	return (
		<div className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
			<div className="min-w-0">
				<p className="text-sm font-semibold">Task deleted</p>
				<p className="truncate text-xs text-muted-foreground">
					{lastDeleted.task.text}
				</p>
			</div>

			<Button onClick={handleUndo} variant="outline" size="sm" className="shrink-0">
				<RotateCcw />
				Undo
			</Button>
		</div>
	);
});

export default UndoBanner;