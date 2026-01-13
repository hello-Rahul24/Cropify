type TooltipProps = {
  term: string;
  meaning: string;
};

export default function Tooltip({ term, meaning }: TooltipProps) {
  return (
    <span className="relative group ">
      {term}
      <span className="absolute hidden group-hover:block 
        w-64 bg-gray-500 text-white text-sm p-2 rounded
        bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
        {meaning}
      </span>
    </span>
  );
}
