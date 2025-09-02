import { memo } from 'react';
import type { BalanceListProps } from '../services/custom-types';
import BalanceItem from './BalanceItem';

function BalanceList({ data, selectedId, onSelect, onUpdate, onDelete }: BalanceListProps) {
    if (data.length === 0) {
        return (
            <section className="flex p-[1rem] text-[1rem] font-mono text-red font-[520] items-center justify-center">
                <span className="text-red-600 font-[600] text-[1.3rem]">No balance added currently...</span>
            </section>
        );
    }

    return (
        <section className="border-[1.3px] border-black grid md:grid-cols-2 grid-cols-1 gap-[1rem] p-[1rem] text-[1rem] overflow-y-auto font-mono text-white font-[520]">
            {data.map((item) => (
                <BalanceItem
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={onSelect}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
};

export default memo(BalanceList);