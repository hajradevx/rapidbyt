// Stub for @react-email/render — resend@6 optionally imports this package
// but we only use plain HTML strings. This empty stub prevents the Cloudflare
// Workers build from failing with "externals are not allowed".
export const render = () => "";
export const renderAsync = async () => "";
export default { render, renderAsync };
