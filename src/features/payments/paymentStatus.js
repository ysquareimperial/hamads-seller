const PAYOUT = {
    requested: { text: 'Requested', tone: 'warning' },
    approved: { text: 'Approved', tone: 'primary' },
    processing: { text: 'Processing', tone: 'primary' },
    successful: { text: 'Paid', tone: 'success' },
    failed: { text: 'Failed', tone: 'danger' },
    reversed: { text: 'Reversed', tone: 'danger' },
    cancelled: { text: 'Cancelled', tone: 'neutral' },
};
export const payoutStatus = (s) => PAYOUT[s] ?? { text: s, tone: 'neutral' };

const ACCOUNT_OK = ['active', 'verified', 'ok', 'ready'];
/** Bank account status as a badge. */
export const accountStatus = (s) => {
    const v = String(s ?? '').toLowerCase();
    if (ACCOUNT_OK.includes(v)) return { text: 'Ready for payouts', tone: 'success' };
    if (/fail|invalid|reject/.test(v)) return { text: 'Problem', tone: 'danger' };
    return { text: v ? v.replace(/_/g, ' ') : 'Pending', tone: 'warning' };
};

/** Wallet entries: credits add money, debits take it away. */
export const isCredit = (entry) => /credit|in/i.test(entry.direction ?? '');

export const SQUAD_OK = ['ok', 'verified', 'passed', 'success', 'enabled'];
