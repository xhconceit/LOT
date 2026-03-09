import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()


const zhPath = path.join(root, "packages/i18n/src/locales/zh-CN.json")
const enPath = path.join(root, "packages/i18n/src/locales/en.json")
const outPath = path.join(root, "packages/i18n/src/keys.ts")

function readJson(p) {
    return JSON.parse(fs.readFileSync(p, "utf8"))
}

function flattenKeys(obj, prefix = ""){
    const out = []
    for (const [k, v] of Object.entries(obj)){
        const key = prefix ? `${prefix}.${k}` : k
        if (v && typeof v === "object" && !Array.isArray(v)) {
            out.push(...flattenKeys(v, key))
        } else {
            out.push(key)
        }
    }
    return out
}

const zh = readJson(zhPath);
const en = readJson(enPath);

const zhKeys = new Set(flattenKeys(zh));
const enKeys = new Set(flattenKeys(en));

const missingInEn = [...zhKeys].filter(k => !enKeys.has(k))
const missingInZh = [...enKeys].filter(k => !zhKeys.has(k))

if (missingInEn.length || missingInZh.length) {
    console.error(" i18n keys 不一致")
    if (missingInEn.length) {
        console.log("en 缺少: ", missingInEn.join(", "))
    }
    if (missingInZh.length) {
        console.log("zh 缺少: ", missingInZh.join(", "))
    }
    process.exit(1)
}

const keys = [...zhKeys].toSorted()

const content = `/* eslint-disable */
// ⚠️ 此文件由脚本自动生成，请勿手改
export type I18nKey =
${keys.map((k) => `  | ${JSON.stringify(k)}`).join("\n")};
`;

fs.writeFileSync(outPath, content, "utf8");