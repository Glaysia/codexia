pub mod watcher;
mod event_sink;
mod handlers;
pub mod router;
mod server;
pub mod terminal;
pub mod types;
mod websocket;
mod server_web;

pub use router::create_router;
pub use types::WebServerState;
pub use server_web::start_web_server;

// Start the web server for an embedding host such as AIPD.
pub fn start_server(host: &str, port: u16) {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    let host = host.to_string();

    let runtime = tokio::runtime::Runtime::new()
        .expect("Failed to create tokio runtime for web server startup");
    runtime.block_on(async {
        if let Err(err) = start_web_server(&host, port).await {
            log::error!("Failed to start web server: {}", err);
        }
    });
}
