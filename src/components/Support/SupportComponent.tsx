import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    List,
} from '@mui/material';
import { type IWalletResponse, type ITicket } from '../../types';
import { TicketCategory } from '../../data/constants.ts';
import { createTicketAsync, fetchUserTickets, sendMessageAsync } from '../../api/supportApi';

interface SupportComponentProps {
    userData: IWalletResponse | null;
}

export const SupportComponent: React.FC<SupportComponentProps> = ({ userData }) => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [category, setCategory] = useState<string>(TicketCategory.General);
    const [description, setDescription] = useState('');

    const userId = userData?.id;

    const loadTickets = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const data = await fetchUserTickets(userId);
            setTickets(data.sort((a, b) => b.id - a.id));
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [userId]);

    const handleSubmit = async () => {
        if (!userId || !description.trim()) return;

        setError(null);
        setIsLoading(true);

        try {
            const newTicket = await createTicketAsync(userId);

            const fullMessage = `[${category}] ${description}`;

            await sendMessageAsync(newTicket.id, userId, fullMessage);

            setDescription('');
            setCategory(TicketCategory.General);
            setIsCreating(false);
            await loadTickets();

        } catch (err: any) {
            setError(err.message || 'Failed to create ticket');
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return <Alert severity="warning">Please log in to contact support.</Alert>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Customer Support</Typography>
                {!isCreating && (
                    <Button variant="contained" onClick={() => setIsCreating(true)}>
                        Create New Ticket
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {isCreating ? (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Describe your problem</Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {Object.values(TicketCategory).map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe your issue in detail..."
                        />

                        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => setIsCreating(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isLoading || !description.trim()}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Submit Ticket'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : null}

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Your Tickets</Typography>

            {isLoading && !isCreating && <CircularProgress />}

            {!isLoading && tickets.length === 0 && (
                <Typography color="text.secondary">You haven't created any tickets yet.</Typography>
            )}

            <List>
                {tickets.map((ticket) => (
                    <Paper key={ticket.id} sx={{ mb: 2, p: 2 }} elevation={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Ticket #{ticket.id}
                            </Typography>
                            <Typography variant="caption" sx={{ color: ticket.status === 0 ? 'green' : 'grey' }}>
                                {ticket.status === 0 ? 'OPEN' : 'CLOSED'}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ maxHeight: 100, overflow: 'hidden' }}>
                            {ticket.chatHistory && ticket.chatHistory.length > 0 ? (
                                ticket.chatHistory.map((msg) => (
                                    <Typography key={msg.id} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        <strong>{msg.authorId === userId ? 'You: ' : 'Support: '}</strong>
                                        {msg.value}
                                    </Typography>
                                ))
                            ) : (
                                 <Typography variant="body2" fontStyle="italic">No messages</Typography>
                             )}
                        </Box>
                    </Paper>
                ))}
            </List>
        </Container>
    );
};