
interface Props {
    id: string;
    type: string;
    placeholder: string;
    label: string;
    componentType: string; 
}

export const createOrUpdateProjectControls: Props[] = [
    {
        id: 'name',
        type: 'text',
        placeholder: 'Enter your name',
        label: 'Name Project',
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