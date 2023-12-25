import { useFormContext } from "react-hook-form";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "#/components/ui/calendar";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

export default function PlanDatePicker({ className }: { className?: string }) {
  const form = useFormContext<z.infer<typeof createPlanInput>>();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  useEffect(() => {
    if (!date) return;
    if (!date.from) return;
    if (!date.to) return;

    form.setValue("startDate", date?.from);
    form.setValue("endDate", date?.to);
  }, [date, form]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
