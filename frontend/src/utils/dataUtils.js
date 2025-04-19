import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data) => {
    if (!data) return '';
    
    try {
        return format(new Date(data), 'dd/MM/yyyy HH:mm', {
            locale: ptBR
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '';
    }
}; 