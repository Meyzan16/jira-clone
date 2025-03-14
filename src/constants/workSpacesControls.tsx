interface Option {
    id: string;
    label: string;
}


interface Props {
    id: string;
    type: string;
    placeholder: string;
    label: string;
    componentType: string; 
    options? : Option[];
}

export const createWorkSpaceControls: Props[] = [
    {
        id: 'name',
        type: 'text',
        placeholder: 'Enter your name',
        label: 'Name Workspace',
        componentType: 'input',
    },
    {
        id: 'image',
        type: 'file',
        placeholder: 'Enter your image',
        label: 'Pilih image ',
        componentType: 'file',
    },
]