"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DatasetFiltersProps = {
  query: string;
  onQueryChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
};

export function DatasetFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: DatasetFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by label or ID..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9"
          aria-label="Search dataset"
        />
      </div>

      {/* Status filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="labeled">Labeled</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Date from */}
      <div className="flex flex-col gap-1">
        <label htmlFor="date-from" className="text-xs text-muted-foreground">
          From
        </label>
        <Input
          id="date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-[150px]"
        />
      </div>

      {/* Date to */}
      <div className="flex flex-col gap-1">
        <label htmlFor="date-to" className="text-xs text-muted-foreground">
          To
        </label>
        <Input
          id="date-to"
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-[150px]"
        />
      </div>
    </div>
  );
}
