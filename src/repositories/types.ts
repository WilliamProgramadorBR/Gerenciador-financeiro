// types.ts
export interface Transaction {
    description: string;
    date: string | number | Date;
    frequency: string;
    id: number; // Ajuste conforme necessário
    type: 'entrada' | 'saída'; // Ajuste conforme o tipo de transação
    amount: number; // Ajuste conforme a sua estrutura
    // Adicione outros campos necessários
}
