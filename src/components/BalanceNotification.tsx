import { memo, useEffect } from 'react';
import type { NotificationProps } from '../services/custom-types';

function BalanceNotification({ message, onClose, className = '' }: NotificationProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="flex justify-center items-center inset-0 fixed z-20">
            <div className={`bg-[#8B8C89] p-[0.5rem] text-[1rem] font-mono font-[550] ${className}`}>
                {message}
            </div>
        </div>
    );
};

export default memo(BalanceNotification);