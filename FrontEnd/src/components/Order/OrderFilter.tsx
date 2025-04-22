import React from 'react';

interface OrderFilterProps {
    status: string;
    startDate: string;
    endDate: string;
    setStatus: (status: string) => void;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
    status,
    startDate,
    endDate,
    setStatus,
    setStartDate,
    setEndDate,
    onSubmit,
    onCancel
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-md mb-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="done">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md shadow transition"
                >
                    Apply Filters
                </button>
            </div>
        </form>
    );
};

export default OrderFilter;
