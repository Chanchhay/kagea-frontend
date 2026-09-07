"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCheck,
  LockKeyhole,
  MessageSquare,
  Search,
  SendHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type {
  ConversationParticipantResponse,
  ConversationResponse,
  MessageResponse,
} from "@/contracts";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useLiveStatus, useLiveUpdates } from "@/hooks/useLiveUpdates";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { isUuid } from "@/lib/uuid";
import { cn } from "@/lib/utils";
import {
  useDeleteMessageMutation,
  useGetConversationQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} from "@/services/conversationsApi";

export function MessagesWorkspace({
  basePath,
  conversationId,
}: {
  basePath: string;
  conversationId?: string;
}) {
  const tx = useWorkspaceTranslation();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  // Ensure live socket is active while in the messages tab
  useLiveUpdates(true);

  const conversations = useGetConversationsQuery({ page, size: 30 });
  const detail = useGetConversationQuery(conversationId ?? "", {
    skip: !isUuid(conversationId ?? null),
  });

  const threads = conversations.currentData?.content ?? [];
  const selected = conversationId ? detail.currentData : threads[0];

  const filtered = threads.filter((thread) =>
    [
      thread.title,
      thread.jobTitle,
      ...thread.participants.filter((p) => !p.self).map((p) => p.displayLabel),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="grid h-[calc(100dvh-180px)] min-h-[480px] overflow-hidden rounded-2xl border border-ws-faint/15 bg-ws-card lg:h-[calc(100dvh-140px)] lg:grid-cols-[330px_minmax(0,1fr)]">
      <aside
        className={`${conversationId ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-ws-faint/15`}
      >
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ws-fg">{tx("Inbox")}</h2>
            <span className="rounded-full bg-ws-panel px-2 py-0.5 text-xs text-ws-muted">
              {conversations.data?.totalElements ?? 0}
            </span>
          </div>
          <label className="flex items-center gap-2 rounded-xl bg-ws-panel px-3 py-2.5 text-ws-muted">
            <Search className="size-4 shrink-0" />
            <input
              aria-label={tx("Search conversations on this page")}
              placeholder={tx("Search people or jobs")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-ws-fg outline-none placeholder:text-ws-faint"
            />
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {conversations.isFetching && !conversations.currentData ? (
            <LoadingState rows={5} />
          ) : conversations.isError ? (
            <ErrorState
              message={tx("Unable to load conversations.")}
              onRetry={conversations.refetch}
            />
          ) : (
            <ul className="space-y-1">
              {filtered.map((thread) => (
                <li key={thread.id}>
                  <ThreadRow
                    thread={thread}
                    active={thread.id === selected?.id}
                    onSelect={() => router.push(`${basePath}/${thread.id}`)}
                  />
                </li>
              ))}
            </ul>
          )}
          {!conversations.isFetching &&
            !conversations.isError &&
            !filtered.length && (
              <p className="px-4 py-10 text-center text-sm text-ws-muted">
                {search
                  ? tx("No matches on this page.")
                  : tx("No conversations yet. Start one from a company or application.")}
              </p>
            )}
        </div>
        {(conversations.data?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between border-t border-ws-faint/15 p-3 text-xs text-ws-muted">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 disabled:opacity-40"
            >
              {tx("Previous")}
            </button>
            <span>
              {tx("Page {0} of {1}", {
                0: page + 1,
                1: conversations.data?.totalPages ?? 1,
              })}
            </span>
            <button
              disabled={conversations.isFetching || conversations.data?.last}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 disabled:opacity-40"
            >
              {tx("Next")}
            </button>
          </div>
        )}
      </aside>

      <div
        className={`${conversationId ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-col`}
      >
        {conversationId && !isUuid(conversationId) ? (
          <ErrorState message={tx("Invalid conversation link.")} />
        ) : detail.isError && conversationId ? (
          <ErrorState
            message={tx("This conversation is unavailable.")}
            onRetry={detail.refetch}
          />
        ) : selected ? (
          <Thread
            key={selected.id}
            conversation={selected}
            basePath={basePath}
          />
        ) : conversationId && detail.isLoading ? (
          <LoadingState rows={6} />
        ) : (
          <div className="m-auto p-8 text-center">
            <MessageSquare className="mx-auto mb-4 size-10 text-primary" />
            <h2 className="font-semibold text-ws-fg">
              {tx("Your conversations, in one place")}
            </h2>
            <p className="mt-2 text-sm text-ws-muted">
              {tx("Select a conversation to discuss a job or application.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({
  participant,
  small = false,
}: {
  participant?: ConversationParticipantResponse;
  small?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const label = participant?.displayLabel || "Participant";
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary ${
        small ? "size-7 text-[10px]" : "size-11 text-sm"
      }`}
    >
      {participant?.avatarUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={participant.avatarUrl}
          alt={label}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-label={label}>
          {label
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase()}
        </span>
      )}
    </span>
  );
}

function getCounterpart(participants: ConversationParticipantResponse[]) {
  const others = participants.filter((p) => !p.self);
  // Prioritize the actual user (Candidate / Recruiter) over Moderator/Admin
  const realUser = others.find(
    (p) => p.role !== "MODERATOR" && p.role !== "ADMIN",
  );
  return realUser ?? others[0];
}

function getThreadSummary(
  thread: ConversationResponse,
  tx: ReturnType<typeof useWorkspaceTranslation>,
) {
  const others = thread.participants.filter((p) => !p.self);
  const realUsers = others.filter(
    (p) => p.role !== "MODERATOR" && p.role !== "ADMIN",
  );
  const moderators = others.filter(
    (p) => p.role === "MODERATOR" || p.role === "ADMIN",
  );

  if (realUsers.length > 0) {
    const userNames = realUsers.map((p) => p.displayLabel).join(", ");
    return {
      title: userNames,
      meta: moderators.length > 0 ? tx("Moderator") : null,
    };
  }

  const topicName = thread.jobTitle || thread.title;
  if (topicName) {
    return {
      title: topicName,
      meta: others[0]?.displayLabel || tx("Moderator"),
    };
  }

  return {
    title: others[0]?.displayLabel || tx("Conversation"),
    meta: null,
  };
}

function ThreadRow({
  thread,
  active,
  onSelect,
}: {
  thread: ConversationResponse;
  active: boolean;
  onSelect: () => void;
}) {
  const tx = useWorkspaceTranslation();
  const counterpart = getCounterpart(thread.participants);
  const { title: threadTitle, meta } = getThreadSummary(thread, tx);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative flex w-full cursor-pointer gap-3 rounded-xl p-3 text-left transition-all border",
        active
          ? "border-primary/50 bg-ws-card-hover shadow-xs ring-1 ring-primary/20"
          : "border-transparent hover:border-ws-line/60 hover:bg-ws-card",
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
        />
      )}
      <Avatar key={counterpart?.avatarUrl} participant={counterpart} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="flex-1 truncate text-sm font-semibold text-ws-fg">
            {threadTitle}
          </span>
          <span className="shrink-0 text-[10px] text-ws-muted">
            {thread.lastMessage && formatDate(thread.lastMessage.sentAt, false)}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-xs text-ws-muted">
          <BriefcaseBusiness className="size-3 shrink-0" />
          <span className="truncate">{topic(thread, tx)}</span>
          {meta && (
            <span className="shrink-0 rounded-full bg-ws-panel px-1.5 py-0.5 text-[10px] text-ws-muted">
              {meta}
            </span>
          )}
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <span className="flex-1 truncate text-xs text-ws-muted">
            {thread.lastMessage
              ? `${thread.lastMessage.mine ? tx("You: ") : ""}${
                  thread.lastMessage.content ?? tx("Message deleted")
                }`
              : tx("Start the conversation")}
          </span>
          {thread.unreadCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold leading-5 text-primary-foreground">
              {thread.unreadCount}
            </span>
          )}
          {thread.status !== "OPEN" && (
            <LockKeyhole
              aria-label={thread.status.toLowerCase()}
              className="size-3 text-ws-faint"
            />
          )}
        </span>
      </span>
    </button>
  );
}

function Thread({
  conversation,
  basePath,
}: {
  conversation: ConversationResponse;
  basePath: string;
}) {
  const tx = useWorkspaceTranslation();
  const messages = useGetMessagesQuery({
    conversationId: conversation.id,
    size: 50,
  });
  const [pages, setPages] = useState(0);
  const [sendMessage, sendState] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const sending = useRef(false);
  const readPending = useRef(false);
  const liveStatus = useLiveStatus();
  const others = conversation.participants.filter((p) => !p.self);
  const counterpart = getCounterpart(conversation.participants);
  const { title: threadHeaderTitle } = getThreadSummary(conversation, tx);
  const ordered = useMemo(
    () => [...(messages.data?.content ?? [])].reverse(),
    [messages.data?.content],
  );
  const latestId = ordered.at(-1)?.id;
  const closed = conversation.status !== "OPEN";

  const applicationHref = conversation.applicationId
    ? basePath.startsWith("/job-seeker")
      ? `/job-seeker/applications/${conversation.applicationId}`
      : `/recruiter/forwarded-candidates/${conversation.applicationId}`
    : null;

  useEffect(() => {
    const read = () => {
      if (
        conversation.unreadCount > 0 &&
        messages.isSuccess &&
        document.visibilityState === "visible" &&
        (scrollRef.current?.getClientRects().length ?? 0) > 0 &&
        !readPending.current
      ) {
        readPending.current = true;
        void markRead(conversation.id)
          .unwrap()
          .catch(() => toast.error(tx("Could not mark the conversation as read.")))
          .finally(() => {
            readPending.current = false;
          });
      }
    };
    read();
    document.addEventListener("visibilitychange", read);
    window.addEventListener("resize", read);
    return () => {
      document.removeEventListener("visibilitychange", read);
      window.removeEventListener("resize", read);
    };
  }, [
    conversation.id,
    conversation.unreadCount,
    messages.isSuccess,
    latestId,
    markRead,
    tx,
  ]);

  useEffect(() => {
    if (nearBottom.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [latestId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || closed || sending.current) return;
    sending.current = true;
    try {
      await sendMessage({
        conversationId: conversation.id,
        body: { content },
      }).unwrap();
      setDraft("");
      nearBottom.current = true;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } catch {
      toast.error(tx("Message could not be sent. Your draft has been kept."));
    } finally {
      sending.current = false;
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-ws-faint/15 px-4 py-4 lg:px-6">
        <Link
          href={basePath}
          aria-label={tx("Back to inbox")}
          className="p-1 text-ws-muted lg:hidden"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <Avatar key={counterpart?.avatarUrl} participant={counterpart} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-ws-fg">
            {threadHeaderTitle}
          </h2>
          <p className="mt-0.5 text-xs text-ws-muted">
            {others
              .map((p) => {
                const role = roleLabel(p.role, tx);
                const label = p.displayLabel?.trim();
                if (!label || label.toLowerCase() === role.toLowerCase()) {
                  return role;
                }
                return `${label} (${role})`;
              })
              .join(" · ") || tx("Conversation")}
          </p>
        </div>
        {conversation.status !== "OPEN" && (
          <span className="rounded-full bg-ws-panel px-3 py-1 text-xs capitalize text-ws-muted">
            {tx(conversation.status.toLowerCase())}
          </span>
        )}
      </header>

      <div className="flex items-center gap-3 border-b border-ws-faint/15 bg-ws-panel/60 px-4 py-3 lg:px-6">
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <BriefcaseBusiness className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-ws-muted">
            {conversation.applicationId ? tx("Job topic") : tx("Topic")}
          </p>
          <p className="truncate text-sm font-medium text-ws-fg">
            {topic(conversation, tx)}
          </p>
        </div>
        {applicationHref && (
          <Link
            href={applicationHref}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {tx("Application")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div
        className="flex items-center gap-1.5 px-4 py-2 text-[10px] text-ws-muted lg:px-6"
        role="status"
      >
        <span
          className={`size-1.5 rounded-full ${
            liveStatus === "connected" ? "bg-primary animate-pulse" : "bg-amber-500"
          }`}
        />
        {liveStatus === "connected"
          ? tx("Live updates connected")
          : liveStatus === "connecting"
            ? tx("Connecting to live updates…")
            : tx("Reconnecting to live updates…")}
      </div>

      <div
        ref={scrollRef}
        onScroll={() => {
          const el = scrollRef.current;
          if (el) {
            nearBottom.current =
              el.scrollHeight - el.scrollTop - el.clientHeight < 100;
          }
        }}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-ws-panel/30 px-4 py-4 lg:px-6"
        aria-label={tx("Message history")}
      >
        {messages.isLoading ? (
          <LoadingState rows={4} />
        ) : messages.isError ? (
          <ErrorState
            message={tx("Unable to load messages.")}
            onRetry={messages.refetch}
          />
        ) : (
          <>
            {pages + 1 < (messages.data?.totalPages ?? 0) && (
              <button
                onClick={() => {
                  nearBottom.current = false;
                  setPages((p) => p + 1);
                }}
                className="mx-auto block rounded-full bg-ws-card px-4 py-2 text-xs text-primary transition hover:bg-ws-card-hover"
              >
                {tx("Load older messages")}
              </button>
            )}
            {Array.from({ length: pages }, (_, i) => pages - i).map((page) => (
              <OlderMessages
                key={page}
                conversation={conversation}
                page={page}
              />
            ))}
            {!ordered.length && (
              <div className="py-16 text-center">
                <MessageSquare className="mx-auto size-8 text-ws-faint" />
                <p className="mt-3 text-sm text-ws-muted">
                  {tx("No messages yet. Say hello to start the conversation.")}
                </p>
              </div>
            )}
            <MessageGroup messages={ordered} conversation={conversation} />
          </>
        )}
      </div>

      {closed ? (
        <div className="flex items-center justify-center gap-2 border-t border-ws-faint/15 px-5 py-5 text-xs text-ws-muted">
          <LockKeyhole className="size-4 shrink-0" />
          <p>
            {tx("This conversation is {0}. You can still view its messages.", {
              0: tx(conversation.status.toLowerCase()),
            })}
          </p>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="border-t border-ws-faint/15 p-4 lg:px-6"
        >
          <div className="flex items-end gap-3 rounded-2xl border border-ws-faint/15 bg-ws-panel/60 p-2 focus-within:border-primary/40">
            <textarea
              aria-label={tx("Message")}
              value={draft}
              disabled={sendState.isLoading}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  void submit(e);
                }
              }}
              rows={2}
              maxLength={4000}
              placeholder={tx("Write a message…")}
              className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ws-fg outline-none placeholder:text-ws-faint"
            />
            <button
              type="submit"
              disabled={sendState.isLoading || !draft.trim()}
              aria-label={tx("Send message")}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <SendHorizontal className="size-4" />
            </button>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ws-faint">
            <span>
              {sendState.isLoading
                ? tx("Sending…")
                : tx("Enter to send · Shift + Enter for a new line")}
            </span>
            <span>{draft.length}/4000</span>
          </div>
        </form>
      )}
    </section>
  );
}

function OlderMessages({
  conversation,
  page,
}: {
  conversation: ConversationResponse;
  page: number;
}) {
  const tx = useWorkspaceTranslation();
  const result = useGetMessagesQuery({
    conversationId: conversation.id,
    page,
    size: 50,
  });
  return result.isLoading ? (
    <LoadingState rows={3} />
  ) : result.isError ? (
    <ErrorState
      message={tx("Unable to load older messages.")}
      onRetry={result.refetch}
    />
  ) : (
    <MessageGroup
      messages={[...(result.data?.content ?? [])].reverse()}
      conversation={conversation}
    />
  );
}

function MessageGroup({
  messages,
  conversation,
}: {
  messages: MessageResponse[];
  conversation: ConversationResponse;
}) {
  return (
    <>
      {messages.map((message, index) => (
        <div key={message.id} className="space-y-4">
          {(index === 0 ||
            dayKey(messages[index - 1].sentAt) !== dayKey(message.sentAt)) && (
            <div className="flex justify-center">
              <time className="rounded-full bg-ws-panel px-3 py-1 text-[10px] text-ws-muted">
                {formatDate(message.sentAt, false)}
              </time>
            </div>
          )}
          <Bubble message={message} conversation={conversation} />
        </div>
      ))}
    </>
  );
}

function Bubble({
  message,
  conversation,
}: {
  message: MessageResponse;
  conversation: ConversationResponse;
}) {
  const tx = useWorkspaceTranslation();
  const [remove, removeState] = useDeleteMessageMutation();
  const deleted = message.status === "DELETED";
  const sender = conversation.participants.find(
    (p) => p.userAccountId === message.senderUserAccountId,
  );
  const read =
    message.mine &&
    conversation.participants.some(
      (p) =>
        !p.self &&
        p.lastReadAt &&
        new Date(p.lastReadAt).getTime() >= new Date(message.sentAt).getTime(),
    );

  return (
    <div
      className={`group/msg flex items-end gap-2 ${
        message.mine ? "justify-end" : "justify-start"
      }`}
    >
      {!message.mine && (
        <Avatar key={sender?.avatarUrl} participant={sender} small />
      )}
      {message.mine && !deleted && (
        <button
          type="button"
          onClick={() =>
            void remove({
              conversationId: conversation.id,
              messageId: message.id,
            })
              .unwrap()
              .catch(() => toast.error(tx("Could not delete the message.")))
          }
          disabled={removeState.isLoading}
          aria-label={tx("Delete message")}
          className="mb-1 rounded-lg p-2 text-ws-faint opacity-100 transition hover:text-ws-fg focus-visible:opacity-100 group-hover/msg:opacity-100 sm:opacity-0"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 lg:max-w-[70%] ${
          message.mine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-ws-faint/10 bg-ws-card text-ws-fg"
        }`}
      >
        {!message.mine && (
          <p className="mb-1 text-[10px] font-semibold text-primary/80">
            {sender?.displayLabel || tx("Participant")}
          </p>
        )}
        <p
          className={`whitespace-pre-wrap break-words text-sm leading-6 [overflow-wrap:anywhere] ${
            deleted ? "italic opacity-60" : ""
          }`}
        >
          {deleted ? tx("This message was deleted") : message.content}
        </p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            message.mine ? "text-primary-foreground/75" : "text-ws-muted"
          }`}
        >
          <time dateTime={message.sentAt}>
            {formatDate(message.sentAt, true)}
          </time>
          {message.mine && !deleted && (
            <span className="flex items-center gap-1">
              {read && <CheckCheck className="size-3" />}
              {read ? tx("Read") : tx("Sent")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function topic(
  thread: ConversationResponse,
  tx: ReturnType<typeof useWorkspaceTranslation>,
) {
  return (
    thread.jobTitle ||
    thread.title ||
    (thread.type === "APPLICATION"
      ? tx("Job application")
      : tx("General conversation"))
  );
}

function roleLabel(
  role: string,
  tx: ReturnType<typeof useWorkspaceTranslation>,
) {
  return role === "SEEKER"
    ? tx("Candidate")
    : role === "RECRUITER"
      ? tx("Recruiter")
      : role === "MODERATOR"
        ? tx("Moderator")
        : role === "ADMIN"
          ? tx("Admin")
          : role.charAt(0) + role.slice(1).toLowerCase();
}

function dayKey(value: string) {
  return new Date(value).toDateString();
}

function formatDate(value: string, time: boolean) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(
    "en",
    time
      ? { hour: "2-digit", minute: "2-digit" }
      : { month: "short", day: "numeric", year: "numeric" },
  ).format(date);
}
