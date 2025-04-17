<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MensagemLida implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $anuncioId;
    public $userId;

    public function __construct($anuncioId, $userId)
    {
        $this->anuncioId = $anuncioId;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.'.$this->anuncioId);
    }

    public function broadcastWith()
    {
        return [
            'anuncio_id' => $this->anuncioId,
            'user_id' => $this->userId,
            'action' => 'messages_read'
        ];
    }
} 