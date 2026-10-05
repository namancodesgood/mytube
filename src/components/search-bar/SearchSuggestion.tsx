import { SearchIcon } from "lucide-react";
import { FC } from "react";

type Props = {
  suggestions: string[];
};

const SearchSuggestion: FC<Props> = ({ suggestions }) => {
  return (
    <div className="absolute w-full bg-yt-menu rounded-xl mt-[0.4rem] py-[1.6rem] z-10 shadow-lg">
      <ul>
        {suggestions.map((suggestion, idx) => (
          <li
            key={idx}
            className="flex items-center gap-[1.6rem] h-[3.2rem] px-[1.6rem] hover:bg-yt-hover cursor-pointer"
          >
            <SearchIcon size={20} className="shrink-0" />
            <span className="truncate text-[1.6rem] font-medium">
              {suggestion.trim()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestion;
