import { SearchIcon } from "lucide-react";
import { FC } from "react";

type Props = {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
};

const SearchSuggestion: FC<Props> = ({ suggestions, onSelect }) => {
  return (
    <div className="absolute w-full bg-yt-menu rounded-xl mt-[0.4rem] py-[1.6rem] z-10 shadow-lg">
      <ul>
        {suggestions.map((suggestion, idx) => (
          <li key={idx}>
            <button
              type="button"
              // Keep focus in the input, or the list closes before the click lands
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion)}
              className="flex items-center gap-[1.6rem] w-full h-[3.2rem] px-[1.6rem] text-left hover:bg-yt-hover active:bg-yt-hover"
            >
              <SearchIcon size={20} className="shrink-0" />
              <span className="truncate text-[1.6rem] font-medium">
                {suggestion.trim()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestion;
