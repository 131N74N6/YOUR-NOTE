import type { BalanceSummaryProps } from '../services/custom-types';

const BalanceSummary = ({ summary }: BalanceSummaryProps) => {
    return (
        <section className="detail-inform">
            <section className="font-mono font-[550] text-[1.3rem] text-black">
                Income = Rp {summary.totalIncome.toLocaleString()}
            </section>
            <section className="font-mono font-[550] text-[1.3rem] text-black">
                Expense = Rp {summary.totalExpense.toLocaleString()}
            </section>
            <section className="font-mono font-[550] text-[1.3rem] text-black">
                Both Total = Rp {summary.balanceDifference.toLocaleString()}
            </section>
        </section>
    );
};

export default BalanceSummary;