import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    bgColor?: string;
    iconColor?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    bgColor = 'bg-blue-50',
    iconColor = 'text-blue-600'
}: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span className="ml-1">{trend.value}</span>
                        </p>
                    )}
                </div>
                <div className={`${bgColor} p-4 rounded-lg`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
