import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { buscarMinhasNotificacoes, marcarComoLida, marcarTodasComoLidas } from '../../services/notificacaoService';

const MinhasNotificacoes = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const notificacoes = await buscarMinhasNotificacoes();
            
            // Mapear as notificações do backend para o formato usado pelo frontend
            const mappedNotifications = notificacoes.map(notif => ({
                id: notif.ID_Notificacao,
                type: notif.TipoNotificacao,
                titulo: notif.TipoReferencia,
                message: notif.Mensagem,
                read: notif.Lida === 1,
                createdAt: notif.DataNotificacao
            }));
            
            setNotifications(mappedNotifications);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar notificações:', err);
            setError('Erro ao carregar suas notificações. Por favor, tente novamente.');
            
            // Fallback para dados de exemplo em caso de erro
            setNotifications([
                {
                    id: 1,
                    type: 'ANUNCIO_APROVADO',
                    titulo: 'Smartphone Xiaomi',
                    message: 'Seu anúncio "Smartphone Xiaomi" foi aprovado e já está visível para compradores.',
                    read: false,
                    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
                },
                {
                    id: 2,
                    type: 'COMPRA',
                    titulo: 'Notebook Dell',
                    message: 'Um usuário acaba de comprar seu produto "Notebook Dell".',
                    read: true,
                    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
                },
                {
                    id: 3,
                    type: 'RECLAMACAO',
                    titulo: 'Mouse Gamer',
                    message: 'Foi registrada uma reclamação para sua venda "Mouse Gamer".',
                    read: false,
                    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await marcarComoLida(notificationId);
            
            // Atualiza o estado localmente
            setNotifications(notifications.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true } 
                    : notification
            ));
        } catch (err) {
            console.error('Erro ao marcar notificação como lida:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await marcarTodasComoLidas();
            
            // Atualiza o estado localmente
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        } catch (err) {
            console.error('Erro ao marcar todas notificações como lidas:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'ANUNCIO_PENDENTE':
                return 'fas fa-clock text-warning';
            case 'ANUNCIO_APROVADO':
                return 'fas fa-check-circle text-success';
            case 'ANUNCIO_REJEITADO':
                return 'fas fa-times-circle text-danger';
            case 'COMPRA':
                return 'fas fa-shopping-cart text-primary';
            case 'RECLAMACAO':
                return 'fas fa-exclamation-circle text-danger';
            default:
                return 'fas fa-bell text-primary';
        }
    };

    const formatDate = (date) => {
        const notificationDate = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - notificationDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
        } else if (diffHours > 0) {
            return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
        } else {
            return 'Agora mesmo';
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando suas notificações...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="my-3">
                {error}
                <div className="mt-2">
                    <Button variant="outline-danger" size="sm" onClick={fetchNotifications}>
                        Tentar novamente
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="notifications-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Minhas Notificações</h3>
                {notifications.some(n => !n.read) && (
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={markAllAsRead}
                    >
                        Marcar todas como lidas
                    </Button>
                )}
            </div>

            <Card>
                <ListGroup variant="flush">
                    {notifications.length === 0 ? (
                        <div className="text-center p-5">
                            <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                            <p className="mb-0">Você não tem notificações</p>
                            <small className="text-muted">As notificações importantes aparecerão aqui</small>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <ListGroup.Item 
                                key={notification.id}
                                className={`notification-item py-3 ${!notification.read ? 'bg-light' : ''}`}
                                action
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="d-flex">
                                    <div className="me-3 pt-1">
                                        <i className={`${getNotificationIcon(notification.type)} fa-lg`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="mb-1">
                                                {notification.titulo}
                                                {!notification.read && (
                                                    <Badge bg="primary" pill className="ms-2" style={{ fontSize: '0.7rem' }}>
                                                        Nova
                                                    </Badge>
                                                )}
                                            </h5>
                                            <small className="text-muted">
                                                {formatDate(notification.createdAt)}
                                            </small>
                                        </div>
                                        <p className="mb-1">{notification.message}</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>
        </div>
    );
};

export default MinhasNotificacoes; 