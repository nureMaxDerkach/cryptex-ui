import React, {useState, useEffect} from 'react';
import {
    Box, Button, Card, CardContent, Container, Typography,
    CircularProgress, Alert, List, ListItem, Paper, TextField
} from '@mui/material';
import {type ITicket} from '../../types';
import {
    getOpenTicketsAsync,
    getCurrentSupportTicketAsync,
    takeTicketAsync,
    resolveTicketAsync,
    sendMessageAsync
} from '../../api/supportApi';

interface SupportPanelProps {
    currentUserId: number;
}

export const SupportPanelComponent: React.FC<SupportPanelProps> = ({currentUserId}) => {
    const [activeTicket, setActiveTicket] = useState<ITicket | null>(null);
    const [openTickets, setOpenTickets] = useState<ITicket[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [replyMessage, setReplyMessage] = useState('');

    const initData = async () => {
        setIsLoading(true);
        try {
            const current = await getCurrentSupportTicketAsync(currentUserId);
            if (current && current.id) {
                setActiveTicket(current);
            } else {
                // Якщо активного немає, вантажимо список вільних
                const openList = await getOpenTicketsAsync();
                setOpenTickets(openList);
                setActiveTicket(null);
            }
        } catch (err: any) {
            setError('Failed to load support data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUserId) {
            initData();
        }
    }, [currentUserId]);

    // Взяти тікет
    const handleTakeTicket = async (ticketId: number) => {
        setIsLoading(true);
        try {
            await takeTicketAsync(currentUserId, ticketId);
            await initData(); // Оновлюємо стан (має з'явитися activeTicket)
        } catch (err: any) {
            setError('Failed to take ticket');
            setIsLoading(false);
        }
    };

    // Відповісти (Send)
    const handleSendMessage = async () => {
        if (!activeTicket || !replyMessage.trim()) return;
        try {
            // Відправляємо повідомлення від імені сапорта (currentUserId)
            await sendMessageAsync(activeTicket.id, currentUserId, replyMessage);
            setReplyMessage('');
            // Оновлюємо чат (перезавантажуємо поточний тікет)
            const updatedTicket = await getCurrentSupportTicketAsync(currentUserId);
            setActiveTicket(updatedTicket);
        } catch (err) {
            console.error(err);
        }
    };

    // Вирішити тікет (Resolve)
    const handleResolveTicket = async () => {
        if (!activeTicket) return;
        if (!window.confirm('Are you sure you want to close this ticket?')) return;

        setIsLoading(true);
        try {
            await resolveTicketAsync(currentUserId, activeTicket.id);
            setActiveTicket(null);
            await initData();
        } catch (err: any) {
            setError('Failed to resolve ticket');
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{mt: 2}}>
            <Typography variant="h5" gutterBottom>Support Agent
                Panel</Typography>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {isLoading && <CircularProgress
                sx={{display: 'block', mx: 'auto', my: 2}}/>}

            {/* ВИГЛЯД 1: АКТИВНИЙ ТІКЕТ (ЧАТ) */}
            {!isLoading && activeTicket ? (
                <Card sx={{
                    height: '70vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{
                        p: 2,
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6">
                            Active Ticket #{activeTicket.id} (User
                            ID: {activeTicket.userId})
                        </Typography>
                        <Button variant="contained" color="success"
                                onClick={handleResolveTicket}>
                            Mark as Resolved
                        </Button>
                    </Box>

                    <CardContent sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        bgcolor: '#f5f5f5'
                    }}>
                        {/* Історія чату */}
                        <List>
                            {activeTicket.chatHistory
                                ?.slice()
                                .sort((a, b) => a.id - b.id)
                                .map((msg) => {
                                    const isMe = msg.authorId === currentUserId;
                                    return (
                                        <ListItem key={msg.id} sx={{
                                            justifyContent: isMe
                                                            ? 'flex-end'
                                                            : 'flex-start'
                                        }}>
                                            <Paper sx={{
                                                p: 2,
                                                bgcolor: isMe ? '#e3f2fd'
                                                              : 'white',
                                                maxWidth: '70%',
                                                color: "black"
                                            }}>
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                                    color="text.secondary">
                                                    {isMe
                                                     ? 'Support Agent (You)'
                                                     : `User ${msg.authorId}`}
                                                </Typography>
                                                <Typography
                                                    variant="body1">{msg.value}</Typography>
                                            </Paper>
                                        </ListItem>
                                    );
                                })}
                        </List>
                    </CardContent>

                    <Box sx={{
                        p: 2,
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: 1
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Type a reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <Button variant="contained"
                                onClick={handleSendMessage}>Send</Button>
                    </Box>
                </Card>
            ) : (
                 /* ВИГЛЯД 2: СПИСОК ВІДКРИТИХ ТІКЕТІВ */
                 !isLoading && (
                     <Box>
                         <Typography variant="h6" sx={{mb: 2}}>Queue: Open
                             Tickets ({openTickets.length})</Typography>

                         {openTickets.length === 0 ? (
                             <Alert severity="info">No open tickets at the
                                 moment.</Alert>
                         ) : (
                              openTickets.map((ticket) => (
                                  <Paper key={ticket.id} sx={{
                                      p: 2,
                                      mb: 2,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                  }}>
                                      <Box>
                                          <Typography variant="subtitle1"
                                                      fontWeight="bold">Ticket
                                              #{ticket.id}</Typography>
                                          <Typography variant="body2">From
                                              User
                                              ID: {ticket.userId}</Typography>
                                      </Box>
                                      <Button variant="contained"
                                              size="small"
                                              onClick={() => handleTakeTicket(ticket.id)}>
                                          Take Ticket
                                      </Button>
                                  </Paper>
                              ))
                          )}
                     </Box>
                 )
             )}
        </Container>
    );
};