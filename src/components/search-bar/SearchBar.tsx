import { useState } from "react";

import SearchSuggestion from "@/components/search-bar/SearchSuggestion";
import { YT_API_URI } from "@/utils/constants";

import { Search } from "lucide-react";
import { useQuery } from "react-query";

import { Item } from "@/interfaces/Item";
import { YoutubeSearchListResponse } from "@/interfaces/YoutubeSearchListResponse";

import { useDebounce } from "@/custom-hooks/useDebounce";

const fetchSearchSuggestions = async (searchQuery: string) => {
  const endpoint = `${YT_API_URI}/search?part=snippet&maxResults=5&q=${searchQuery}&key=${
    import.meta.env.VITE_YT_API_KEY
  }`;
  const response = await fetch(endpoint);
  return await response.json();
};

type Props = {
  className?: string;
};

const SearchBar = ({ className }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error } = useQuery<YoutubeSearchListResponse>(
    ["searchSuggestions", searchQuery],
    () => fetchSearchSuggestions(searchQuery),
    {
      enabled: !!searchQuery,
    }
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchQuery(value);
  };

  const debouncedSearch = useDebounce(handleSearchInput, 500);

  const suggestions: string[] =
    data?.items?.map((item: Item) => item?.snippet?.title ?? "") || [];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center w-[min(64rem,45vw)] h-[4rem]">
        <input
          type="search"
          className="w-full h-full rounded-l-full pl-[1.6rem] text-[1.6rem] border border-yt-border bg-[#121212] focus:border-[#1c62b9] focus:outline-0"
          placeholder="Search"
          onChange={debouncedSearch}
        />
        <button
          aria-label="Search"
          className="bg-[#222222] border border-l-0 border-yt-border h-full w-[6.4rem] shrink-0 flex justify-center items-center rounded-r-full"
        >
          <Search size={20} />
        </button>
      </div>
      {!error && suggestions.length > 0 && (
        <SearchSuggestion suggestions={suggestions} />
      )}
    </div>
  );
};

export default SearchBar;
