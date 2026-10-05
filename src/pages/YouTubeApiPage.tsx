import { FC, useState } from "react";

import { useQuery } from "react-query";

import { ytFetch } from "@/utils/helper";
import {
  Discovery,
  Field,
  Method,
  flattenSchema,
  getMethods,
  pickSample,
  undocumentedPaths,
} from "@/utils/discovery";

// Google's machine-readable description of every YouTube Data API method and field
const DISCOVERY_URL =
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";

// Public samples: Rick Astley's channel and "Never Gonna Give You Up"
const VIDEO_ID = "dQw4w9WgXcQ";
const CHANNEL_ID = "UCuAXFkgsw1L7xaCfnd5JJOw";

type Access = {
  sample?: Record<string, string>; // params for a live call with our key
  onDemand?: boolean; // costly or capped, so only call it on click
  cost?: string;
  usedIn?: string;
  blocked?: string; // why our API key can't call it
  blockedParts?: Record<string, string>; // parts our key gets refused
  note?: string;
};

const OWNER_ONLY = "owner only (403)";
const NEEDS_OAUTH = "401 · API keys not accepted, needs OAuth sign-in";

// Every part and method below was checked against the live API with this key on 2026-10-06
const ACCESS: Record<string, Access> = {
  "youtube.videos.list": {
    sample: {
      part: "snippet,contentDetails,statistics,player,status,topicDetails,recordingDetails,liveStreamingDetails,localizations,paidProductPlacementDetails,brandPartner,projectDetails",
      id: VIDEO_ID,
    },
    blockedParts: {
      fileDetails: OWNER_ONLY,
      processingDetails: OWNER_ONLY,
      suggestions: OWNER_ONLY,
      monetizationDetails: OWNER_ONLY,
      ageGating: OWNER_ONLY,
    },
    usedIn: "Home feed, watch page, channel videos",
  },
  "youtube.videos.batchGetStats": {
    sample: { part: "snippet,contentDetails,statistics", id: VIDEO_ID },
  },
  "youtube.videoTrainability.get": { sample: { id: VIDEO_ID } },
  "youtube.channels.list": {
    sample: {
      part: "snippet,contentDetails,statistics,brandingSettings,status,topicDetails,localizations,contentOwnerDetails",
      id: CHANNEL_ID,
    },
    blockedParts: {
      auditDetails: OWNER_ONLY,
      conversionPings: "rejected (400)",
    },
    usedIn: "Video cards, watch page, channel page",
  },
  "youtube.playlistItems.list": {
    sample: {
      part: "snippet,contentDetails,status",
      playlistId: `UU${CHANNEL_ID.slice(2)}`,
      maxResults: "5",
    },
    usedIn: "Channel videos tab",
  },
  "youtube.playlists.list": {
    sample: {
      part: "snippet,contentDetails,status,player,localizations",
      channelId: CHANNEL_ID,
      maxResults: "5",
    },
    usedIn: "Channel playlists tab",
  },
  "youtube.playlistImages.list": {
    sample: { part: "snippet", parent: "PLlaN88a7y2_qHDbY9eQbuNTAuEJUSEeuu" },
  },
  "youtube.commentThreads.list": {
    sample: { part: "snippet,replies", videoId: VIDEO_ID, maxResults: "5" },
  },
  "youtube.comments.list": {
    sample: {
      part: "snippet",
      parentId: "Ugzge340dBgB75hWBm54AaABAg",
      maxResults: "5",
    },
  },
  "youtube.activities.list": {
    sample: {
      part: "snippet,contentDetails",
      channelId: CHANNEL_ID,
      maxResults: "5",
    },
  },
  "youtube.channelSections.list": {
    sample: {
      part: "snippet,contentDetails,localizations,targeting",
      channelId: CHANNEL_ID,
    },
  },
  "youtube.videoCategories.list": {
    sample: { part: "snippet", regionCode: "IN" },
  },
  "youtube.i18nRegions.list": { sample: { part: "snippet" } },
  "youtube.i18nLanguages.list": { sample: { part: "snippet" } },
  "youtube.search.list": {
    sample: { part: "snippet", q: "lofi", maxResults: "5" },
    onDemand: true,
    cost: "1 of the 100 searches/day",
    usedIn: "Search bar suggestions",
  },
  "youtube.captions.list": {
    sample: { part: "snippet", videoId: VIDEO_ID },
    onDemand: true,
    cost: "50 units",
  },
  "youtube.subscriptions.list": {
    blocked: "403 · only for channels whose subscriptions are public",
  },
  "youtube.videos.getRating": { blocked: NEEDS_OAUTH },
  "youtube.members.list": { blocked: NEEDS_OAUTH },
  "youtube.membershipsLevels.list": { blocked: NEEDS_OAUTH },
  "youtube.superChatEvents.list": { blocked: NEEDS_OAUTH },
  "youtube.liveBroadcasts.list": { blocked: NEEDS_OAUTH },
  "youtube.liveStreams.list": { blocked: NEEDS_OAUTH },
  "youtube.videoAbuseReportReasons.list": { blocked: NEEDS_OAUTH },
  "youtube.thirdPartyLinks.list": { blocked: NEEDS_OAUTH },
  "youtube.liveChatMessages.list": {
    note: "Needs the chat ID of a stream that is live right now",
  },
  "youtube.youtube.v3.liveChat.messages.stream": {
    note: "Needs the chat ID of a stream that is live right now",
  },
  "youtube.liveChatModerators.list": {
    note: "Needs the chat ID of a stream that is live right now",
  },
  "youtube.captions.download": {
    note: "Returns the caption file itself, not JSON",
  },
};

const groupOf = (access: Access) =>
  access.blocked ? 3 : !access.sample ? 2 : access.onDemand ? 1 : 0;

type CardProps = {
  method: Method;
  fields: Field[];
  query: string;
};

const MethodCard: FC<CardProps> = ({ method, fields, query }) => {
  const access = ACCESS[method.id] ?? {};
  const [enabled, setEnabled] = useState(!!access.sample && !access.onDemand);
  const { data, error, status } = useQuery<unknown, Error>(
    ["youtubeApi", method.id],
    () =>
      ytFetch<unknown>(method.path.replace("youtube/v3/", ""), access.sample ?? {}),
    { enabled, staleTime: Infinity, retry: false }
  );

  const matches = (text: string) => text.toLowerCase().includes(query);
  const shown = query
    ? fields.filter((field) => matches(`${field.path} ${field.description}`))
    : fields;
  // Anything the live call returned that Google's description leaves out
  const undocumented =
    status === "success" ? undocumentedPaths(fields, data) : [];
  const undocumentedShown = query ? undocumented.filter(matches) : undocumented;

  if (query && !shown.length && !undocumentedShown.length) return null;

  const [badge, badgeColor] = access.blocked
    ? ["Restricted", "bg-red-800"]
    : !access.sample
      ? ["Not checked", "bg-[#303030]"]
      : {
          idle: ["Not run", "bg-[#303030]"],
          loading: ["Checking…", "bg-[#303030]"],
          success: ["Works with our key", "bg-green-800"],
          error: ["Failed", "bg-red-800"],
        }[status];

  const sampleFor = (field: Field) => {
    const part = field.path.startsWith("items[].")
      ? field.path.split(".")[1]
      : undefined;
    const blockedPart = part && access.blockedParts?.[part];
    if (blockedPart) return { text: blockedPart, color: "text-amber-400" };
    if (status !== "success") return null;
    const value = pickSample(data, field.path);
    return value === undefined
      ? { text: "not in this sample", color: "text-slate-500" }
      : { text: JSON.stringify(value), color: "text-slate-200" };
  };
  const sampled =
    status === "success"
      ? fields.filter((field) => pickSample(data, field.path) !== undefined)
          .length
      : 0;

  return (
    <section className="bg-[#212121] rounded-xl p-6 text-2xl min-w-0">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-3xl font-bold font-mono break-all">
          {method.id.replace("youtube.", "")}
        </h2>
        <span
          className={`${badgeColor} rounded-full px-4 py-1 text-xl whitespace-nowrap`}
        >
          {badge}
        </span>
      </div>
      <p className="text-xl text-slate-400 mt-2 font-mono">
        GET /{method.path}
      </p>
      {(access.cost || access.usedIn) && (
        <p className="text-xl text-slate-400 mt-1">
          {[
            access.cost && `Cost: ${access.cost}`,
            access.usedIn && `Used in: ${access.usedIn}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      {(access.blocked || access.note) && (
        <p className="text-xl text-slate-300 mt-2">
          {access.blocked ?? access.note}
        </p>
      )}
      {status === "idle" && access.sample && (
        <button
          onClick={() => setEnabled(true)}
          className="mt-4 px-6 py-2 rounded-full bg-white text-black text-xl"
        >
          Run sample request
        </button>
      )}
      {error && <p className="text-red-400 text-xl mt-3">{error.message}</p>}

      <details open={!!query} className="mt-4">
        <summary className="cursor-pointer text-xl">
          {query ? `${shown.length} of ${fields.length}` : fields.length} data
          points
          {undocumented.length > 0 &&
            ` + ${undocumented.length} undocumented`}
          {status === "success" && ` · ${sampled} present in this sample`}
        </summary>
        {fields.length === 0 ? (
          <p className="text-xl text-slate-400 mt-2">No JSON fields.</p>
        ) : (
          <ul className="mt-2 text-lg">
            {undocumentedShown.map((path) => (
              <li key={path} className="py-2 border-t border-[#303030]">
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <code className="text-sky-300 break-all">{path}</code>
                  <span className="text-amber-400">not in Google's docs</span>
                </div>
                <p className="font-mono truncate text-slate-200">
                  {JSON.stringify(pickSample(data, path))}
                </p>
                <p className="text-slate-400">
                  Returned by the live call but missing from the API
                  description.
                </p>
              </li>
            ))}
            {shown.map((field) => {
              const sample = sampleFor(field);
              return (
                <li key={field.path} className="py-2 border-t border-[#303030]">
                  <div className="flex flex-wrap items-baseline gap-x-4">
                    <code className="text-sky-300 break-all">{field.path}</code>
                    <span className="text-slate-500">{field.type}</span>
                  </div>
                  {sample && (
                    <p className={`font-mono truncate ${sample.color}`}>
                      {sample.text}
                    </p>
                  )}
                  <p
                    className="text-slate-400 line-clamp-2"
                    title={field.description}
                  >
                    {field.description}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </details>
    </section>
  );
};

const YouTubeApiPage: FC = () => {
  const [filter, setFilter] = useState("");
  const { data: discovery, status } = useQuery<Discovery, Error>(
    ["youtubeDiscovery"],
    () => fetch(DISCOVERY_URL).then((response) => response.json()),
    { staleTime: Infinity }
  );

  if (status === "loading") {
    return <p className="text-2xl p-6">Loading Google's API description…</p>;
  }

  if (!discovery?.resources) {
    return <p className="text-2xl p-6">Couldn't load the API description.</p>;
  }

  const methods = getMethods(discovery.resources)
    .filter((method) => method.httpMethod === "GET")
    .map((method) => ({
      method,
      fields: method.response
        ? flattenSchema(discovery.schemas, method.response)
        : [],
    }))
    .sort(
      (a, b) =>
        groupOf(ACCESS[a.method.id] ?? {}) - groupOf(ACCESS[b.method.id] ?? {}) ||
        a.method.id.localeCompare(b.method.id)
    );
  const total = methods.reduce((sum, { fields }) => sum + fields.length, 0);
  const query = filter.trim().toLowerCase();

  return (
    <div className="w-full overflow-y-auto px-6 pb-10">
      <h1 className="text-4xl font-bold">Everything YouTube's API returns</h1>
      <p className="text-2xl text-slate-300 mt-2 max-w-[110rem]">
        All {methods.length} read methods and {total.toLocaleString()} data
        points in the YouTube Data API v3, straight from Google's API
        description (revision {discovery.revision}). Cards marked "Works with
        our key" also make a live call (Rick Astley's channel and "Never Gonna
        Give You Up") and show the real value next to each field. A field
        "not in this sample" can still show up for other videos, e.g. live
        stream details only exist on live streams. Fields a live call returns
        that Google doesn't document are listed too. Default quota: 10,000
        units/day, plus a separate 100 calls/day for search.
      </p>
      <input
        type="search"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filter data points, e.g. subscriberCount"
        className="w-full max-w-[60rem] h-14 mt-6 px-6 rounded-full text-2xl border border-[#303030] bg-[#121212] focus:border-blue-400 focus:outline-0"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-4 mt-6">
        {methods.map(({ method, fields }) => (
          <MethodCard
            key={method.id}
            method={method}
            fields={fields}
            query={query}
          />
        ))}
      </div>
    </div>
  );
};

export default YouTubeApiPage;
