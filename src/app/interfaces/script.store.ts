interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'openpay', src: 'https://js.openpay.pe/openpay.v1.min.js'},
    {name: 'openpayData', src: 'https://js.openpay.pe/openpay-data.v1.min.js'}
];
