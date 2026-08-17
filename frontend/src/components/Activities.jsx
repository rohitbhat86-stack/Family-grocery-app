import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { ACTIVITIES } from '../data/activities';

export default function Activities() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {ACTIVITIES.map((activity) => (
        <div key={`${activity.day}-${activity.name}`} className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-clay-500">
            {activity.day}
          </p>
          <h3 className="mt-1 text-base font-bold text-clay-900">{activity.name}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-clay-700">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-clay-400" />
            {activity.location}
          </p>
          {activity.time && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-clay-700">
              <Clock className="h-3.5 w-3.5 shrink-0 text-clay-400" />
              {activity.time}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
