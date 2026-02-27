# 鉴权与权限规范（Auth Spec）

本文件定义本项目的鉴权（Authentication）、授权（Authorization）、审计（Audit）与安全约束，供 `api-service`、`admin-web`、小程序/APP 以及后续服务间调用统一遵循。

## 1. 目标与原则

- **统一入口**：所有“控制命令”必须经由 `api-service`（HTTP）鉴权/授权（见 `docs/control-spec.md`、ADR-0011）。
- **最小权限**：默认只读，显式授予控制权限。
- **可追溯**：所有控制操作必须可审计（谁、何时、对哪台设备、下发了什么、结果如何）。
- **分端适配**：Web 管理台与小程序/APP 的登录形态不同，但 API 权限模型必须一致。

## 2. 身份类型

- **管理员/运营人员（Admin）**：通过 `admin-web` 使用系统（配置订阅、查看数据、下发控制命令等）。
- **终端用户（MiniApp/App User）**：通过小程序/APP 控制设备、查看数据（权限通常更受限）。
- **服务账户（Service Account）**：服务间调用（例如后续 `command-worker` 调用 `api-service` 或内部管理接口）。

> 设备接入（MQTT 连接鉴权）属于 Broker/设备侧安全范畴，可在后续 ADR/文档补充；本文件聚焦 HTTP API 与控制权限。

## 3. 鉴权方案（建议 v1）

### 3.1 Token 形态

采用 Bearer Token（JWT 或等价自包含 Token）：

- **Access Token**：短有效期（建议 15 分钟）
- **Refresh Token**：长有效期（建议 7～30 天），用于刷新 Access Token

`admin-web` 与小程序/APP 统一通过：

- `Authorization: Bearer <accessToken>`

携带 Access Token 调用 API。

### 3.2 刷新与登出（建议）

建议提供：

- `POST /api/v1/auth/refresh`：使用 refresh token 换取新的 access token
- `POST /api/v1/auth/logout`：撤销 refresh token（服务端黑名单或删除会话记录）

> 具体接口是否实现与字段细节，以 `docs/api-spec.md` 落地为准；在未实现前，可先使用较长有效期 access token 作为过渡，但必须保留后续收敛空间。

## 4. 小程序登录（建议 v1）

### 4.1 登录流程（推荐）

1. 小程序调用平台登录（获取 `code`）
2. 客户端将 `code` 发送到 `api-service`
3. `api-service` 向平台换取用户身份（如 `openid`），建立或更新用户记录
4. `api-service` 签发 access/refresh token

### 4.2 身份映射字段（建议）

- `provider`：`wechat_miniprogram`（示例）
- `providerUserId`：如 `openid/unionid`
- `userId`：系统内部用户 ID（统一授权用）

## 5. Web 管理台登录（建议 v1）

可选两种模式（任选其一，建议先从 A 起步）：

- **A. 账号密码 + Token**：最直接，落地最快
- **B. 第三方 OAuth/OIDC**：更企业化，后期可接入

无论哪种，登录成功后都应归一为系统内部 `userId` 与权限模型。

## 6. 授权模型（必须）

### 6.1 权限粒度

至少支持以下能力：

- **device:read**：查看设备与数据
- **device:control**：下发控制命令
- **config:write**：修改后台配置（订阅 pattern、topic 映射等）

### 6.2 用户-设备授权（必须）

对每个 `deviceId` 建立授权关系：

- `userId`
- `deviceId`
- `role` 或 `scopes`（例如只读/可控）
- `createdAt/updatedAt`

强制规则：

- **必须**：调用 `POST /devices/:deviceId/commands` 前验证 `device:control`
- **必须**：读取设备数据前验证 `device:read`

## 7. 审计与日志（必须）

对所有控制相关操作记录审计日志：

- `commandId`、`requestId`
- `issuedBy`（操作者 `userId`）
- `deviceId`
- `type/params`
- `result/status`、失败原因、耗时
- 请求来源（IP/UA/客户端类型：admin-web/miniapp/app）

> 生产环境仅保留关键日志；开发环境可更详细（与你的日志规范一致）。

## 8. 限流与风控（必须）

建议至少按以下维度限流：

- **按用户**：单位时间内控制命令次数
- **按设备**：单位时间内被控制次数
- **按命令类型**：高风险操作更严格

触发限流返回 `RATE_LIMITED`。

## 9. 安全基线（建议）

- **传输安全**：API 必须使用 HTTPS
- **密钥管理**：Token 签名密钥通过环境变量注入，不写入仓库
- **参数校验**：所有输入必须校验（避免注入、越权、反序列化风险）
- **回放防护**：控制接口必须幂等（`requestId`）

## 10. 与其他规范的关系

- API 契约：`docs/api-spec.md`
- 控制链路与约束：`docs/control-spec.md`
- 数据面约定：`docs/data-spec.md`
- 术语：`docs/glossary.md`

