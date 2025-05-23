import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { getPdfUrl, getPdfUrlFromPath } from '../services/api';

/**
 * Componente de exemplo para visualizar comprovativos de residência
 * Este é apenas um exemplo de como usar as funções getPdfUrl e getPdfUrlFromPath
 */
const ViewComprovativoExample = ({ userId, documentName }) => {
    const { currentUser } = useAuth();
    const [pdfUrl, setPdfUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            // Exemplo 1: Quando você tem o ID do usuário e o nome do arquivo
            if (userId && documentName) {
                setPdfUrl(getPdfUrl(userId, documentName));
            } 
            // Exemplo 2: Quando você tem apenas o ID do usuário
            else if (userId) {
                // Aqui você poderia fazer uma chamada à API para obter os documentos deste usuário
                setPdfUrl(getPdfUrl(userId));
            }
            // Exemplo 3: Quando você tem o caminho completo do PDF
            else if (documentName && documentName.includes('/')) {
                setPdfUrl(getPdfUrlFromPath(documentName));
            }
            // Exemplo 4: Visualizar a pasta de comprovativos
            else {
                setPdfUrl(getPdfUrl());
            }
        } catch (error) {
            console.error('Erro ao gerar URL do comprovativo:', error);
            setError('Não foi possível carregar o comprovativo. Tente novamente mais tarde.');
        }
    }, [userId, documentName]);

    // Verifica se o usuário tem permissão para ver este documento
    const canViewDocument = () => {
        // Administradores podem ver qualquer documento
        if (currentUser?.TipoUserID_TipoUser === 1) return true;
        
        // Usuários normais só podem ver seus próprios documentos
        return currentUser?.ID_User === parseInt(userId);
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Comprovativo de Residência</h5>
                {canViewDocument() && (
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        href={pdfUrl} 
                        target="_blank"
                    >
                        Abrir em Nova Aba
                    </Button>
                )}
            </Card.Header>
            <Card.Body>
                {canViewDocument() ? (
                    <div className="ratio ratio-16x9" style={{ height: '500px' }}>
                        <iframe
                            src={pdfUrl}
                            title="Comprovativo de Residência"
                            className="w-100 h-100"
                            style={{ border: '1px solid #dee2e6' }}
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <Alert variant="warning">
                        Você não tem permissão para visualizar este documento.
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default ViewComprovativoExample;
