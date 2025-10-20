import {
    format,
    getDay,
    parse,
    startOfWeek,
    addMonths,
    subMonths
} from "date-fns";

import { id as idLocale } from "date-fns/locale";
import { CalendarIcon, ChevronRightIcon , ChevronLeftIcon } from "lucide-react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Task } from "../types";
import { useMemo, useState } from "react";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";


interface DataCalendarProps {
    data: Task[];    
}

interface CustomToolbarProps {
    date: Date;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
    onChangeDate: (d: Date) => void; // ⬅️ baru
}



const CustomToolbar = ({date, onNavigate, onChangeDate}: CustomToolbarProps ) => {
    // daftar bulan lokal Indonesia
    const months = useMemo(
        () =>
        Array.from({ length: 12 }, (_, m) => ({
            label: format(new Date(2020, m, 1), "MMMM", { locale: idLocale }),
            value: m,
        })),
        []
    );


    // range tahun (atur sesuai kebutuhanmu)
    const years = useMemo(() => {
        const current = new Date().getFullYear();
        const start = current - 5;
        const end = current + 5;
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, []);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = Number(e.target.value);
        // jaga aman pakai tanggal 1 agar tak overflow (31 -> feb)
        onChangeDate(new Date(date.getFullYear(), month, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(e.target.value);
        onChangeDate(new Date(year, date.getMonth(), 1));
    };



    return (
        <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
            <Button
                onClick={() => onNavigate("PREV")}
                variant="secondary"
                size="icon"
                className="flex items-center"            
            >   
                <ChevronLeftIcon className="size-4" />
            </Button>

            <div className="flex items-center border border-input rounded-md px-4 py-2 h-10 justify-center w-full lg:w-auto bg-primarygreen text-white">
                <CalendarIcon className="size-4 mr-2" />
                <p className="text-sm">{format(date, "MMMM yyyy", { locale: idLocale })}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* Picker Bulan */}
                <select
                className="h-10 border border-input rounded-md px-3 text-sm bg-white"
                value={date.getMonth()}
                onChange={handleMonthChange}
                >
                {months.map((m) => (
                    <option key={m.value} value={m.value}>
                    {m.label}
                    </option>
                ))}
                </select>

                {/* Picker Tahun */}
                <select
                className="h-10 border border-input rounded-md px-3 text-sm bg-white"
                value={date.getFullYear()}
                onChange={handleYearChange}
                >
                {years.map((y) => (
                    <option key={y} value={y}>
                    {y}
                    </option>
                ))}
                </select>
            </div>


            <Button
                onClick={() => onNavigate("NEXT")}
                variant="secondary"
                size="icon"
                className="flex items-center"            
            >   
                <ChevronRightIcon className="size-4" />
            </Button>

        </div>
    )
}

// Daftar locale untuk date-fns localizer
const locales = {
  id: idLocale, 
};

// Buat localizer khusus date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const DataCalendar = ({ data }: DataCalendarProps) => {

    const [value, setValue] = useState(data.length > 0 ? new Date(data[0].dueDate) : new Date());

    const events = data.map((task) => ({
        start: new Date(task.dueDate), 
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        id: task.$id,
    }));

    const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
        if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else {
            setValue(new Date());
        }
    }

    return (
        <Calendar
            localizer={localizer}
            date={value}
            culture="id"
            events={events}
            views={["month"]}
            defaultView="month"
            toolbar
            showAllEvents
            className="h-full"
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1 ))}
            formats={{
                weekdayFormat: (date,culture, localizer) => localizer?.format(date, "EEE", culture) ?? ""
            }}
            components={{
                eventWrapper: ({event}) => (
                    <EventCard 
                        id={event.id}
                        title={event.title}
                        assignee={event.assignee}
                        status={event.status}
                        priority={event.priority}
                        project={event.project}
                    />
                ),
                toolbar: () => (
                    <CustomToolbar date={value} onNavigate={handleNavigate}  onChangeDate={setValue}   />
                )
                
            }}
        />
    );
};
       