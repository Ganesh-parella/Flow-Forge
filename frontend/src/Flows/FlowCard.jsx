import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Play, Trash2, Loader2, Zap, Clock } from 'lucide-react';

/**
 * FlowCard
 *
 * Backend returns (after camelCase normalisation in ClerkApi.js):
 *   flow.id          ← int
 *   flow.name        ← string
 *   flow.updatedAt   ← ISO datetime string
 *   flow.createdAt   ← ISO datetime string
 *
 * Props:
 *   onEdit(flow)     — receives the whole flow object
 *   onDelete(flow.id) — receives the numeric id
 *   onRun(flow.id)   — receives the numeric id
 */
export default function FlowCard({ flow, onEdit, onRun, onDelete, deleting, running }) {
  const formattedDate = flow.updatedAt
    ? new Date(flow.updatedAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never updated';

  return (
    <Card
      className={`
        group relative overflow-hidden border border-border/60
        hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 ease-out
        ${deleting ? 'opacity-40 pointer-events-none' : ''}
      `}
    >
      {/* Hover accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader
        onClick={() => onEdit(flow)}
        className="flex flex-row items-start justify-between gap-3 p-5 pb-3 cursor-pointer"
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="truncate text-base font-semibold leading-tight pt-1">
            {flow.name || `Flow #${flow.id}`}
          </CardTitle>
        </div>

        {/* Prevent click bubbling to card's onEdit */}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                // CHANGED: opacity-100 on mobile, hidden until hover on md+ screens
                className="h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-muted"
                aria-label={`Actions for ${flow.name || `flow ${flow.id}`}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <DropdownMenuItem onClick={() => onEdit(flow)} className="gap-2 cursor-pointer">
                <Edit className="w-3.5 h-3.5" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onRun(flow.id)}
                disabled={running}
                className="gap-2 cursor-pointer"
              >
                {running ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Run</>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDelete(flow.id)}
                disabled={deleting}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                {deleting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />
                }
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 cursor-pointer" onClick={() => onEdit(flow)}>
        <div className="flex items-center gap-1.5 pl-11">
          <Clock className="w-3 h-3 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}