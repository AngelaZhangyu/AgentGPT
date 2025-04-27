# AgentGPT 项目概览

## 简介

AgentGPT 是一个开源项目，允许用户在浏览器中配置和部署自主 AI 智能体。这些智能体可以被分配特定的目标，并通过将目标分解为任务、执行任务并从结果中学习来尝试实现这些目标。

## 项目架构

AgentGPT 采用现代全栈架构，前端和后端组件分离：

### 前端 (Next.js)
- 使用 Next.js 13 和 TypeScript 构建
- 使用 TailwindCSS 和 HeadlessUI 进行样式设计
- 位于 `/next` 目录中
- 使用 Prisma ORM 进行数据库交互
- 使用 Next-Auth.js 进行用户认证

### 后端 (FastAPI)
- 使用 FastAPI 和 Python 构建
- 位于 `/platform` 目录中
- 使用 SQLModel 作为 ORM
- 为前端提供 REST API 端点

### 数据库
- 使用 MySQL（生产环境通过 Planetscale）
- 通过 Prisma（前端）和 SQLModel（后端）管理数据库迁移

## 核心功能

### AI 智能体
- 用户可以创建具有特定目标的自主 AI 智能体
- 智能体将目标分解为任务并执行它们
- 智能体可以使用各种工具，如网络搜索、编码、推理等
- 实时流式传输智能体的思考过程和操作

### 智能体可用工具
- 网络搜索：搜索互联网获取信息
- 维基百科搜索：直接查询维基百科
- 推理：对问题进行逻辑思考
- 代码生成：编写和执行代码
- 图像生成：基于描述创建图像
- 任务规划：将复杂目标分解为步骤

### 用户功能
- 用户认证和个人资料
- 保存和分享智能体配置
- 自定义智能体设置
- 智能体历史记录和结果跟踪

## 目录结构

### 前端 (`/next`)
- `/src/components`：UI 组件
- `/src/pages`：页面路由和布局
- `/src/hooks`：React 钩子用于状态管理
- `/src/services`：与 API 交互的服务
- `/src/stores`：状态管理（Zustand）
- `/src/utils`：实用函数
- `/src/types`：TypeScript 类型定义

### 后端 (`/platform/reworkd_platform`)
- `/web/api`：API 路由和控制器
- `/web/api/agent`：智能体相关的端点和逻辑
- `/web/api/agent/tools`：智能体可用的工具
- `/services`：后端服务
- `/db`：数据库模型和迁移
- `/schemas`：数据验证模式

### 基础设施
- 用于本地开发的 Docker 配置
- GitHub Actions 中的 CI/CD 管道
- 部署配置

## 入门指南

该项目包含 Windows（`setup.bat`）和基于 Unix 的系统（`setup.sh`）的设置脚本，用于设置环境变量、数据库、后端和前端服务。

### 前提条件
- Node.js
- Docker
- Git
- 各种服务的 API 密钥（OpenAI、Serper、Replicate）

## 技术栈

- **前端**：Next.js、React、TypeScript、TailwindCSS、HeadlessUI
- **后端**：FastAPI、Python、Langchain
- **数据库**：MySQL、Prisma、SQLModel
- **认证**：Next-Auth.js
- **模式验证**：Zod（前端）、Pydantic（后端）
- **LLM 集成**：Langchain、OpenAI API
- **开发工具**：Docker、GitHub Actions

## 许可证

该项目是开源的，并根据仓库中包含的 LICENSE 提供。

## 社区和贡献

AgentGPT 拥有活跃的贡献者和赞助商社区。该项目欢迎贡献，并提供入门贡献者文档。 