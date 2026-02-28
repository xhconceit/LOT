
process.env.VITEST = "true";
// 禁用缓存
process.env.OPENCLAW_PLUGIN_MANIFEST_CACHE_MS ??= "60000";
// 设置最大监听器
const TEST_PROCESS_MAX_LISTENERS = 128;
if (process.getMaxListeners() > 0 && process.getMaxListeners() < TEST_PROCESS_MAX_LISTENERS) {
    process.setMaxListeners(TEST_PROCESS_MAX_LISTENERS);
}


