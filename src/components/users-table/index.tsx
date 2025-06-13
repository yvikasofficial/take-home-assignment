/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type Header,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
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
  type DragMoveEvent,
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
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";

export function UsersTable() {
  const { data, isLoading } = useGetUsers();
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
    if (
      over &&
      active.id !== over.id &&
      active.id !== "actions" &&
      over.id !== "actions"
    ) {
      setColumnOrder((columnOrder) => {
        const actionsColumn = columnOrder.includes("actions")
          ? ["actions"]
          : [];
        const nonActionColumns = columnOrder.filter((id) => id !== "actions");
        const oldIndex = nonActionColumns.indexOf(active.id as string);
        const newIndex = nonActionColumns.indexOf(over.id as string);
        const reorderedColumns = arrayMove(
          nonActionColumns,
          oldIndex,
          newIndex
        );
        return [...reorderedColumns, ...actionsColumn];
      });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;
    if (over?.id === "actions") {
      const draggedItem = document.querySelector(
        `[data-id="${active.id}"]`
      ) as HTMLElement;
      if (draggedItem) {
        draggedItem.style.transform = "translate(0px, 0px)";
      }
    }
  };

  React.useEffect(() => {
    if (table.getAllColumns().length > 0 && columnOrder.length === 0) {
      const columns = table.getAllColumns().map((column) => column.id);
      const nonActionColumns = columns.filter((id) => id !== "actions");
      setColumnOrder([...nonActionColumns, "actions"]);
    }
  }, [table.getAllColumns(), columnOrder.length]);

  const tableContainerRef = React.useRef<HTMLTableSectionElement>(null);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: rows.length,
    estimateSize: () => 50,
    overscan: 20,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <DndContext
        onDragMove={handleDragMove}
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <div
          className="h-[500px] overflow-y-auto rounded-md border relative"
          ref={tableContainerRef}
        >
          <Table
            containerClassName="rounded-md border-border w-full overflow-clip"
            containerStyle={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              <TableHeader className="sticky top-0 bg-stone-700 z-[999]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="!bg-gray-800 text-white w-full"
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableHeader key={header.id} header={header} />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </SortableContext>
            <TableBody style={{}} className="relative">
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={{
                      height: 50,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="h-[50px]"
                        // className="flex-1 truncate min-w-[150px] max-w-full"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DndContext>
    </div>
  );
}

const DraggableHeader = ({ header }: { header: Header<User, unknown> }) => {
  const isActions = header.id === "actions";
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: header.id,
      disabled: isActions,
    });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap" as const,
    zIndex: isDragging ? 1 : 0,
    width: header.column.getSize(),
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={
        isActions
          ? {
              width: header.column.getSize(),
            }
          : style
      }
      className="group relative bg-gray-800 text-white flex-1"
      data-id={header.id}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          isActions && "opacity-0"
        )}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {header.id !== "actions" && (
          <button
            {...attributes}
            {...listeners}
            className="transition-opacity cursor-grab opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </div>
    </TableHead>
  );
};
