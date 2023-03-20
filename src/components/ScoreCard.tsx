import { FaCrown } from "react-icons/fa";
import { IUser } from "@/store/auth";

export const ScoreCard = ({ displayName, avatar, score, isAdmin }: IUser) => {
  return (
    <div className="flex items-center space-x-4 rounded-lg bg-black/5 px-6 py-2">
      <div className="relative">
        {isAdmin && <div className="absolute inset-x-0 -bottom-1"></div>}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={`Avatar of ${displayName}`}
          width="60"
          height="60"
          className="flex-shrink-0 rounded-full object-cover"
          draggable="false"
        />
      </div>

      <div className="flex flex-col items-start space-y-1">
        <span className="font-medium">{displayName}</span>

        <div className="flex flex-wrap items-center space-x-2">
          <span className="rounded-lg bg-green-600/20 px-3 py-1 text-xs text-green-600">
            {score} recycles
          </span>

          {isAdmin && (
            <div
              className="rounded-lg bg-brand/20 px-3 py-1"
              title="This man is a living legend"
            >
              <FaCrown size={16} className="text-brand" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
