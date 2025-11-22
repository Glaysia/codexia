use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};
use tokio::sync::RwLock;

/// Emit an event to the native app and, if a remote UI session is active, forward it over the
/// tauri-remote-ui websocket so browser clients receive the same payload.
pub async fn emit_to_app_and_remote<S>(app: &AppHandle, event: &str, payload: S)
where
    S: Serialize + Clone,
{
    if let Err(err) = app.emit(event, payload.clone()) {
        log::error!("Failed to emit {event}: {err}");
    }

    if let Some(remote_state) = app.try_state::<Arc<RwLock<tauri_remote_ui::RemoteUi>>>() {
        let remote_ui = remote_state.read().await;
        if let Err(err) = remote_ui.emit(event, payload).await {
            log::warn!("Failed to emit {event} to remote UI: {err}");
        }
    }
}
