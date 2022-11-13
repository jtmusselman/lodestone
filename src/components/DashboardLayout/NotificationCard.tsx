import ProgressBar from 'components/Atoms/ProgressBar';
import { NotificationStatus } from 'data/NotificationContext';
import { formatNotificationTime } from 'utils/util';

const NotificationTypeToColorClass: Record<NotificationStatus, string> = {
  info: 'bg-gray-500',
  success: 'bg-green',
  error: 'bg-red',
};

export default function NotificationCard({
  type,
  title = '',
  message = '',
  progress_percent,
  timestamp,
}: {
  type: NotificationStatus;
  title?: string;
  message?: string;
  progress_percent?: number; // progress in percentage
  timestamp: number;
}) {
  return (
    <div className="overflow-hidden bg-gray-900 rounded-md">
      <div
        className={`justify-stretch flex flex-row items-center justify-between px-4 py-3 text-white hover:bg-gray-900`}
      >
        <div className="flex flex-col items-start">
          <p className="w-full text-base font-bold tracking-medium">{title}</p>
          <p className="w-full font-medium text-small tracking-medium">
            {message}
          </p>
          {!message && (
            <span className="font-medium whitespace-nowrap text-smaller tracking-medium text-white/50">
              {formatNotificationTime(timestamp)}
            </span>
          )}
        </div>
      </div>
      {progress_percent ? (
        <ProgressBar
          progress_percent={progress_percent}
          colorClass={NotificationTypeToColorClass[type]}
        />
      ) : (
        <div className="h-1"></div>
      )}
    </div>
  );
}