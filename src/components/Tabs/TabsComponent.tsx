import { Box, Tabs, Tab, Container } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { SaleAndPurchaseCryptoComponent } from '../SaleAndPurchaseCrypto/SaleAndPurchaseCryptoComponent.tsx';
import { WalletComponent } from "../Wallet/WalletComponent.tsx";
import { fetchWalletDataAsync } from '../../api/walletApi.ts';
import { type IWalletResponse, type ITransaction } from '../../types.ts';
import { WithdrawComponent } from '../Withdraw/WithdrawComponent.tsx';
import { fetchHistoryAsync } from '../../api/historyApi.ts';
import { ExchangeComponent } from '../Exchange/ExchangeComponent.tsx';
import { DepositComponent } from '../Deposit/DepositComponent.tsx';
// Імпорт нового компонента
import { CoinPricesComponent } from '../CoinPricesComponent/CoinPricesComponent.tsx';
import {SupportComponent} from "../Support/SupportComponent.tsx";
import {getUserRole} from "../../api/authApi.ts";
import {
    SupportPanelComponent
} from "../SupportPanel/SupportPanelComponent.tsx";

export function TabsComponent() {
    const [activeTab, setActiveTab] = useState('trade');

    const [userData, setUserData] = useState<IWalletResponse | null>(null);
    const [historyData, setHistoryData] = useState<ITransaction[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userRole, setUserRole] = useState<number | string | null>(null);

    const fetchAllData = useCallback(async () => {
        setError(null);
        try {
            const [user, history] = await Promise.all([
                fetchWalletDataAsync(),
                fetchHistoryAsync()
            ]);
            setUserData(user);
            setHistoryData(history);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const role = getUserRole();
        setUserRole(role);

        setIsLoading(true);
        fetchAllData();
    }, [fetchAllData]);

    const isSupportOrAdmin = userRole === "Support" || userRole === 1 || userRole === 2;

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handleDataRefresh = () => {
        fetchAllData();
    };

    const tabs = [
        { id: 'trade', label: 'Trade' },
        { id: 'exchange', label: 'Exchange' },
        { id: 'coin-prices', label: 'Coin Prices' }, // Нова вкладка
        { id: 'wallet', label: 'Wallet' },
        { id: 'deposit', label: 'Deposit' },
        { id: 'withdraw', label: 'Withdraw' },
        { id: 'support', label: 'Support' },
    ];

    if (isSupportOrAdmin) {
        tabs.push({ id: 'support-panel', label: 'Support Panel' });
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      textColor="primary"
                      indicatorColor="primary">
                    {tabs.map((tab) => (
                        <Tab key={tab.id} label={tab.label} value={tab.id} />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeTab === 'trade' && (
                    <SaleAndPurchaseCryptoComponent onTradeSuccess={handleDataRefresh} />
                )}
                {activeTab === 'exchange' && (
                    <ExchangeComponent
                        userData={userData}
                        isLoading={isLoading}
                        error={error}
                        onExchangeSuccess={handleDataRefresh}
                    />
                )}
                {/* Рендеринг нового компонента */}
                {activeTab === 'coin-prices' && (
                    <CoinPricesComponent />
                )}
                {activeTab === 'wallet' && (
                    <WalletComponent
                        walletData={userData}
                        historyData={historyData}
                        isLoading={isLoading}
                        error={error}
                        onRefresh={handleDataRefresh}
                    />
                )}
                {activeTab === 'deposit' && (
                    <DepositComponent
                        userData={userData}
                        onDepositSuccess={handleDataRefresh}
                    />
                )}
                {activeTab === 'withdraw' && (
                    <WithdrawComponent
                        userData={userData}
                        isLoading={isLoading}
                        error={error}
                        onWithdrawSuccess={handleDataRefresh}
                    />
                )}
                {activeTab === 'support' && (
                    <SupportComponent userData={userData} />
                )}
                {activeTab === 'support-panel' && isSupportOrAdmin && userData && (
                    <SupportPanelComponent currentUserId={userData.id} />
                )}
            </Box>
        </Container>
    );
}