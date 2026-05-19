type AuthEvent = { type: "LOGOUT" } | { type: "TOKEN_REFRESHED" }

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null

export function broadcastAuthEvent(event: AuthEvent) {
  channel?.postMessage(event)
}

export function onAuthEvent(handler: (event: AuthEvent) => void) {
  if (!channel) return () => {}
  const listener = (e: MessageEvent<AuthEvent>) => handler(e.data)
  channel.addEventListener("message", listener)
  return () => channel.removeEventListener("message", listener)
}
