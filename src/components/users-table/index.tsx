"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type Header,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsers } from "@/services/user/use-get-users";
import { columns } from "./columns";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { User } from "@/types";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

export function UsersTable() {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const { data } = useGetUsers(page, pageSize);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  React.useEffect(() => {
    if (table.getAllColumns().length > 0 && columnOrder.length === 0) {
      setColumnOrder(table.getAllColumns().map((column) => column.id));
    }
  }, [table.getAllColumns(), columnOrder.length]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="!bg-gray-800 text-white"
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableHeader key={header.id} header={header} />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </SortableContext>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {page} of {data?.totalPages ?? 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={!data || page >= data.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const DraggableHeader = ({ header }: { header: Header<User, unknown> }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: header.id,
    });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as const,
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap" as const,
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className="group relative bg-gray-800 text-white"
    >
      <div className="flex items-center justify-between gap-2">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button
          {...attributes}
          {...listeners}
          className="transition-opacity cursor-grab opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
    </TableHead>
  );
};
