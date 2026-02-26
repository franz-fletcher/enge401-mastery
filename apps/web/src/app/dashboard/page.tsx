import { chapters } from '@/lib/chapters';
import ProgressBar from '@/components/ProgressBar';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Track your progress across all chapters and manage your spaced repetition
        review schedule.
      </p>

      {/* Stats overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Due for Review" value="0" unit="cards" />
        <StatCard label="Accuracy" value="—" unit="%" />
        <StatCard label="Streak" value="0" unit="days" />
      </div>

      {/* Per-chapter progress */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Progress by Chapter
        </h2>
        <div className="space-y-4">
          {chapters.map((ch) => (
            <div key={ch.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Ch {ch.id}: {ch.title}
                </span>
                <span className="text-sm text-gray-500">0 / 0 completed</span>
              </div>
              <ProgressBar percent={0} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm">
      <p className="text-3xl font-bold text-blue-600">{value}</p>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{unit}</p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  );
}
