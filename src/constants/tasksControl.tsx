import { taskPriorityOptions, taskStatusOptions } from "@/utility/convert-options";

interface Option {
    id: string;
    name: string;
}


interface Props {
    id: string;
    type: string;
    placeholder: string;
    label: string;
    componentType: 'input' | 'date' | 'select';
    options? : Option[]
}

export const createOrUpdateTaskControls: Props[] = [
  {
    id: 'name',
    type: 'text',
    placeholder: 'Enter your Task',
    label: 'Name Task',
    componentType: 'input',
  },
  {
    id: 'dueDate',
    type: 'date',
    placeholder: 'Enter your task due date',
    label: 'Due Date',
    componentType: 'date',
  },
  {
    id: 'assigneeId',
    type: 'select',
    label: 'Assignee',
    placeholder: 'Select Assigned To',
    componentType: 'select',
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'select tatus',
    componentType: 'select',
    options: taskStatusOptions,
  },
  {
    id: 'priority',
    type: 'select',
    label: 'priority',
    placeholder: 'select priority',
    componentType: 'select',
    options: taskPriorityOptions,
  },
  {
    id: 'projectId',
    type: 'select',
    label: 'Project',
    placeholder: 'Select Project',
    componentType: 'select',
  },
];