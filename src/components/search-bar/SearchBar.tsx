import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import SearchSuggestion from "@/components/search-bar/SearchSuggestion";

import { Search } from "lucide-react";

import { YoutubeSearchListResponse } from "@/interfaces/YoutubeSearchListResponse";

import { useDebounce } from "@/custom-hooks/useDebounce";
import { ytFetch } from "@/utils/helper";
import { decodeHtml } from "@/utils/format";

// ponytail: suggestions are video titles from search.list, which shares the 100 searches/day quota
const fetchSearchSuggestions = (searchQuery: string) =>
  ytFetch<YoutubeSearchListResponse>("search", {
    part: "snippet",
    maxResults: "5",
    q: searchQuery,
  });

type Props = {
  className?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
};

const SearchBar = ({ className = "", autoFocus, onSearch }: Props) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const currentQuery = params.get("search_query") ?? "";
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setFocused] = useState(false);

  const { data, error } = useQuery(
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

  const search = (query: string) => {
    if (!query.trim()) return;
    setFocused(false);
    navigate(`/results?search_query=${encodeURIComponent(query.trim())}`);
    onSearch?.();
  };

  const suggestions =
    data?.items?.map((item) => decodeHtml(item.snippet?.title ?? "")) ?? [];

  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        search(String(new FormData(event.currentTarget).get("q") ?? ""));
      }}
    >
      <div className="flex items-center w-full h-[4rem]">
        <input
          // Remounts with the query in the URL, so the results page shows what was searched
          key={currentQuery}
          defaultValue={currentQuery}
          name="q"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          autoFocus={autoFocus}
          aria-label="Search"
          className="w-full min-w-0 h-full rounded-l-full pl-[1.6rem] text-[1.6rem] border border-yt-border bg-[#121212] focus:border-[#1c62b9] focus:outline-0"
          placeholder="Search"
          onChange={debouncedSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-[#222222] border border-l-0 border-yt-border h-full w-[6.4rem] shrink-0 flex justify-center items-center rounded-r-full hover:bg-yt-surface active:bg-yt-surface"
        >
          <Search size={20} />
        </button>
      </div>
      {isFocused && !error && suggestions.length > 0 && (
        <SearchSuggestion suggestions={suggestions} onSelect={search} />
      )}
    </form>
  );
};

export default SearchBar;
