import React from 'react';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ notifications, onRead, onMarkAllAsRead }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'ANUNCIO_PENDENTE':
                return 'fas fa-clock text-warning';
            case 'ANUNCIO_APROVADO':
                return 'fas fa-check-circle text-success';
            case 'ANUNCIO_REJEITADO':
                return 'fas fa-times-circle text-danger';
            case 'USER_REGISTRATION':
                return 'fas fa-user-plus text-info';
            default:
                return 'fas fa-bell text-primary';
        }
    };

    const getNotificationMessage = (notification) => {
        switch (notification.type) {
            case 'ANUNCIO_PENDENTE':
                return `Novo anúncio "${notification.titulo}" aguardando aprovação`;
            case 'ANUNCIO_APROVADO':
                return `Seu anúncio "${notification.titulo}" foi aprovado`;
            case 'ANUNCIO_REJEITADO':
                return `Seu anúncio "${notification.titulo}" foi rejeitado`;
            case 'USER_REGISTRATION':
                return `Novo pedido de registo de utilizador: ${notification.userName}`;
            default:
                return notification.message;
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

    return (
        <div className="position-absolute bg-white shadow rounded" style={{ top: '100%', right: 0, width: '320px', zIndex: 1000 }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Notificações</h6>
                {notifications.some(n => !n.read) && (
                    <button 
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        onClick={onMarkAllAsRead}
                    >
                        Marcar todas como lidas
                    </button>
                )}
            </div>
            <div className="notifications-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                        <i className="fas fa-bell fa-2x mb-2"></i>
                        <p className="mb-0">Nenhuma notificação</p>
                        <small>Você será notificado sobre atualizações importantes aqui</small>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`p-3 border-bottom notification-item ${!notification.read ? 'bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => !notification.read && onRead([notification.id])}
                        >
                            <div className="d-flex">
                                <div className="me-3">
                                    <i className={getNotificationIcon(notification.type)}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                                        {getNotificationMessage(notification)}
                                    </p>
                                    <small className="text-muted">
                                        {formatDate(notification.createdAt)}
                                    </small>
                                </div>
                                {!notification.read && (
                                    <div className="ms-2">
                                        <span className="badge bg-primary rounded-pill"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
