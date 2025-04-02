import { environment } from "src/app/environments/environment";

interface Scripts {
    name: string;
    src: string;
}

export const ScriptStore: Scripts[] = [
    { name: 'niubiz', src: environment.production ? 'https://static-content.vnforapps.com/v2/js/checkout.js' : 'https://static-content-qas.vnforapps.com/v2/js/checkout.js' },
];