const TYPE_COLORS: Record<string, string> = {
  normal:   'bg-[#9B9B9B] text-white',
  fire:     'bg-[#FF6B35] text-white',
  water:    'bg-[#4A90D9] text-white',
  electric: 'bg-[#F7D02C] text-gray-900',
  grass:    'bg-[#74B14C] text-white',
  ice:      'bg-[#88D8E8] text-gray-800',
  fighting: 'bg-[#C03028] text-white',
  poison:   'bg-[#A040A0] text-white',
  ground:   'bg-[#C09B5C] text-white',
  flying:   'bg-[#9AA9E8] text-gray-900',
  psychic:  'bg-[#F85888] text-white',
  bug:      'bg-[#94BC4A] text-white',
  rock:     'bg-[#B69E31] text-white',
  ghost:    'bg-[#705898] text-white',
  dragon:   'bg-[#6038F8] text-white',
  dark:     'bg-[#3D2E2A] text-white',
  steel:    'bg-[#B8B8D0] text-gray-900',
  fairy:    'bg-[#EE99AC] text-gray-800',
};

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-500 text-white';
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${color}`}
    >
      {type}
    </span>
  );
}
