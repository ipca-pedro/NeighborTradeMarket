/**
 * Utilitários para formatação de valores
 */

/**
 * Formata um valor numérico para o formato de moeda europeu (EUR)
 * @param {number} valor - Valor a ser formatado
 * @param {boolean} comSimbolo - Se deve incluir o símbolo da moeda (€)
 * @returns {string} Valor formatado
 */
export const formatarPreco = (valor) => {
  if (valor === null || valor === undefined || isNaN(valor)) {
    return '0,00 €';
  }
  
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};

/**
 * Formata um valor numérico para o formato de moeda europeu sem o símbolo
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado sem o símbolo da moeda
 */
export const formatarPrecoSemSimbolo = (valor) => {
  if (valor === null || valor === undefined || isNaN(valor)) {
    return '0,00';
  }
  
  return new Intl.NumberFormat('pt-PT', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}; 