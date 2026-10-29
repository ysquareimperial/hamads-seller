import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

const P = endpoints.payments;
const get = async (url) => (await apiClient.get(url)).data;

/** All amounts from these endpoints are in minor units (kobo). */
export const paymentsService = {
    wallet: () => get(P.wallet),
    transactions: () => get(P.transactions),
    banks: () => get(P.banks),
    bankAccounts: () => get(P.bankAccounts),
    payouts: () => get(P.payouts),
    async addBankAccount(payload) {
        const { data } = await apiClient.post(P.bankAccounts, payload);
        return data;
    },
    async recheckSquad(id) {
        const { data } = await apiClient.post(P.recheckSquad(id));
        return data;
    },
    /** Manual withdrawal. Only works when the backend runs payouts in manual mode. */
    async withdraw(bank_account_id, amount_minor) {
        const { data } = await apiClient.post(P.payouts, { bank_account_id, amount_minor });
        return data;
    },
};
