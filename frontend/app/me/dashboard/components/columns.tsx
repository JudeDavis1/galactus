import { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project, ProjectStatus, ProjectStatusKey } from "@/types/models/user";
import { backendRoutes } from "@/config";
import { backendErrorHandle } from "@/lib/utils/backend-error-handle";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { changeProjectStatus } from "@/services/dashboard/table-actions";

export const columns = (
  setReload: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<Project>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColorMap: Record<keyof typeof ProjectStatus, string> = {
          NOT_STARTED: "bg-gray-700",
          COMPLETED: "bg-green-800",
          IN_PROGRESS: "bg-blue-500",
        };
        const textMap: Record<keyof typeof ProjectStatus, string> = {
          NOT_STARTED: "Not Started",
          COMPLETED: "Completed",
          IN_PROGRESS: "In Progress",
        };

        return (
          <div className="capitalize">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className={cn(
                    statusColorMap[row.original.status],
                    "text-white p-2 rounded hover:cursor-pointer"
                  )}
                >
                  {textMap[row.original.status]}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {Object.keys(textMap).map((keyString, i) => {
                  const projectStatus = keyString as keyof typeof ProjectStatus;
                  return (
                    <DropdownMenuItem
                      key={i}
                      className="hover:cursor-pointer"
                      onClick={() =>
                        changeProjectStatus(
                          row.original.id,
                          projectStatus,
                          row.original.status,
                          setReload
                        )
                      }
                    >
                      <span
                        className={cn(
                          statusColorMap[projectStatus],
                          "text-white p-2 rounded"
                        )}
                      >
                        {textMap[projectStatus]}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await deleteProject(row.original);
                    toast({
                      title: "Deleted!",
                      description: `Successfully deleted ${row.original.title}.`,
                      variant: "success",
                    });
                    setReload(true);
                  } catch (error) {
                    backendErrorHandle(error);
                  }
                }}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export async function deleteProject(project: Project) {
  await axios({
    method: "delete",
    url: backendRoutes.project.delete,
    data: { id: project.id },
    withCredentials: true,
  });
}
