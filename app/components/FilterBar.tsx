import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  selectedCategory: string;
  selectedCity: string;
  categories: Array<{ id: string; title: string }>;
  isLoadingCategories: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export default function FilterBar({
  searchQuery,
  selectedCategory,
  selectedCity,
  categories,
  isLoadingCategories,
  onSearchChange,
  onCategoryChange,
  onCityChange,
}: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Name Business"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
        />
      </div>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-[150px] text-gray-900"
        disabled={isLoadingCategories}
      >
        <option value="">Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-[150px] text-gray-900"
      >
        <option value="">City</option>
        <option value="Saskatoon">Saskatoon</option>
        <option value="Regina">Regina</option>
      </select>
    </div>
  );
}
