interface Props {
    id: string;
    type: string;
    placeholder: string;
    label: string;
    componentType: string; 
}

export const createOrUpdateWorkSpaceControls: Props[] = [
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