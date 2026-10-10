
from pathlib import Path

ROOT = Path(__file__).resolve().parent

DIRECTORIES = """
docs
public/logo
public/icons
public/images
public/sounds
src/app/login
src/app/signup
src/app/auth/callback
src/app/chat/[chatId]
src/app/memory
src/app/imports
src/app/plugins
src/app/files
src/app/tasks
src/app/research
src/app/cameras
src/app/tools
src/app/settings
src/app/developer
src/app/api/chats
src/app/api/messages
src/app/api/memory
src/app/api/imports
src/app/api/plugins
src/app/api/files
src/app/api/tasks
src/app/api/research
src/app/api/cameras
src/app/api/vision
src/app/api/voice
src/app/api/integrations
src/components/layout
src/components/dashboard
src/components/chat
src/components/memory
src/components/imports
src/components/plugins
src/components/cameras
src/components/tasks
src/components/settings
src/components/shared
src/lib/ai
src/lib/memory
src/lib/imports
src/lib/integrations
src/lib/research
src/lib/cameras
src/lib/vision
src/lib/voice
src/lib/files
src/lib/tasks
src/lib/security
src/lib/utils
src/server/middleware
src/server/services
src/database/migrations
src/database/queries
src/hooks
src/types
src/config
tests
scripts
""".strip().splitlines()

FILES = """
README.md
.env.example
.gitignore
docs/MASTER_SPECIFICATION.md
docs/ARCHITECTURE.md
docs/DATABASE_SCHEMA.md
docs/API_DOCUMENTATION.md
docs/SECURITY.md
docs/FREE_SERVICES.md
docs/DEPLOYMENT.md
public/logo/oracle-icon.svg
public/logo/oracle-wordmark.svg
public/logo/favicon.svg
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/loading.tsx
src/app/error.tsx
src/app/not-found.tsx
src/app/login/page.tsx
src/app/signup/page.tsx
src/app/auth/callback/route.ts
src/app/chat/page.tsx
src/app/chat/[chatId]/page.tsx
src/app/memory/page.tsx
src/app/imports/page.tsx
src/app/plugins/page.tsx
src/app/files/page.tsx
src/app/tasks/page.tsx
src/app/research/page.tsx
src/app/cameras/page.tsx
src/app/tools/page.tsx
src/app/settings/page.tsx
src/app/developer/page.tsx
src/app/api/chats/route.ts
src/app/api/messages/route.ts
src/app/api/memory/route.ts
src/app/api/imports/route.ts
src/app/api/plugins/route.ts
src/app/api/files/route.ts
src/app/api/tasks/route.ts
src/app/api/research/route.ts
src/app/api/cameras/route.ts
src/app/api/vision/route.ts
src/app/api/voice/route.ts
src/app/api/integrations/route.ts
src/components/layout/MainLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Topbar.tsx
src/components/layout/MobileNavigation.tsx
src/components/layout/ResponsiveLayout.tsx
src/components/dashboard/Dashboard.tsx
src/components/dashboard/StatusPanel.tsx
src/components/dashboard/QuickActions.tsx
src/components/dashboard/RecentActivity.tsx
src/components/dashboard/SystemOverview.tsx
src/components/chat/ChatWindow.tsx
src/components/chat/MessageList.tsx
src/components/chat/MessageBubble.tsx
src/components/chat/ChatInput.tsx
src/components/chat/ChatSidebar.tsx
src/components/chat/ChatTitle.tsx
src/components/chat/ChatActions.tsx
src/components/chat/CodeBlock.tsx
src/components/chat/SourceCitations.tsx
src/components/memory/MemoryList.tsx
src/components/memory/MemoryEditor.tsx
src/components/memory/MemoryReview.tsx
src/components/memory/MemorySearch.tsx
src/components/imports/ImportWizard.tsx
src/components/imports/ProviderSelector.tsx
src/components/imports/ImportPreview.tsx
src/components/imports/ImportProgress.tsx
src/components/imports/ImportHistory.tsx
src/components/plugins/PluginDirectory.tsx
src/components/plugins/PluginCard.tsx
src/components/plugins/ConnectedApps.tsx
src/components/plugins/PermissionDialog.tsx
src/components/cameras/CameraViewer.tsx
src/components/cameras/CameraSourceList.tsx
src/components/cameras/CameraStatus.tsx
src/components/cameras/DetectionOverlay.tsx
src/components/tasks/TaskList.tsx
src/components/tasks/TaskDetails.tsx
src/components/tasks/TaskProgress.tsx
src/components/settings/AppearanceSettings.tsx
src/components/settings/AISettings.tsx
src/components/settings/PrivacySettings.tsx
src/components/settings/MemorySettings.tsx
src/components/settings/DeveloperSettings.tsx
src/components/shared/Button.tsx
src/components/shared/Modal.tsx
src/components/shared/Loading.tsx
src/components/shared/ErrorMessage.tsx
src/components/shared/ConfirmDialog.tsx
src/components/shared/EmptyState.tsx
src/lib/ai/provider.ts
src/lib/ai/chat.ts
src/lib/ai/model-router.ts
src/lib/ai/title-generator.ts
src/lib/ai/prompt-builder.ts
src/lib/memory/memory-service.ts
src/lib/memory/memory-extractor.ts
src/lib/memory/memory-search.ts
src/lib/memory/memory-review.ts
src/lib/memory/personalization.ts
src/lib/imports/import-manager.ts
src/lib/imports/chatgpt-import.ts
src/lib/imports/grok-import.ts
src/lib/imports/archive-parser.ts
src/lib/imports/deduplication.ts
src/lib/imports/import-validation.ts
src/lib/integrations/integration-manager.ts
src/lib/integrations/oauth.ts
src/lib/integrations/gmail.ts
src/lib/integrations/google-drive.ts
src/lib/integrations/github.ts
src/lib/integrations/canva.ts
src/lib/integrations/microsoft-365.ts
src/lib/integrations/spotify.ts
src/lib/research/web-search.ts
src/lib/research/source-verification.ts
src/lib/research/regional-search.ts
src/lib/cameras/camera-search.ts
src/lib/cameras/source-discovery.ts
src/lib/cameras/feed-validator.ts
src/lib/cameras/fallback-manager.ts
src/lib/cameras/embed-handler.ts
src/lib/cameras/camera-status.ts
src/lib/vision/vision-service.ts
src/lib/vision/object-detection.ts
src/lib/vision/tracking.ts
src/lib/voice/speech-input.ts
src/lib/voice/speech-output.ts
src/lib/files/file-service.ts
src/lib/files/file-validation.ts
src/lib/files/document-conversion.ts
src/lib/tasks/task-manager.ts
src/lib/tasks/task-queue.ts
src/lib/tasks/task-logger.ts
src/lib/security/permissions.ts
src/lib/security/validation.ts
src/lib/security/encryption.ts
src/lib/security/access-control.ts
src/lib/utils/logger.ts
src/lib/utils/errors.ts
src/lib/utils/helpers.ts
src/server/middleware/authentication.ts
src/server/middleware/rate-limit.ts
src/server/middleware/error-handler.ts
src/server/services/user-service.ts
src/server/services/chat-service.ts
src/server/services/integration-service.ts
src/database/client.ts
src/database/schema.ts
src/hooks/useChat.ts
src/hooks/useMemory.ts
src/hooks/useTasks.ts
src/hooks/useSettings.ts
src/types/chat.ts
src/types/memory.ts
src/types/plugin.ts
src/types/user.ts
src/types/camera.ts
src/types/task.ts
src/config/app.ts
src/config/providers.ts
src/config/integrations.ts
tests/chat.test.ts
tests/title-generator.test.ts
tests/memory.test.ts
tests/imports.test.ts
tests/integrations.test.ts
tests/cameras.test.ts
tests/security.test.ts
scripts/check-env.ts
scripts/database-migrate.ts
scripts/verify-build.ts
""".strip().splitlines()

STARTERS = {
    "README.md": """# ORACLE

A free-to-use AI assistant project.

## Development

Install dependencies with `npm install`, then run `npm run dev`.

See `docs/MASTER_SPECIFICATION.md` for project requirements.
""",
    ".gitignore": """node_modules/
.next/
out/
build/
coverage/
.env
.env.*
!.env.example
.DS_Store
""",
    ".env.example": """# Document required environment variables here.
# Never put real passwords, tokens, or API keys in this file.
""",
    "docs/MASTER_SPECIFICATION.md": """# ORACLE Master Specification

## Core requirements
- Every ORACLE feature must be available without a paid plan.
- Use the approved dark charcoal, muted lavender, and silver-white identity.
- Keep credentials server-side.
- Verify feature results instead of claiming unverified success.

Add the complete approved specification here.
""",
    "src/app/globals.css": """* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  background: #17171d;
  color: #eeeeF5;
  font-family: Arial, Helvetica, sans-serif;
}
""",
    "src/app/layout.tsx": """import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ORACLE",
  description: "Your personal AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
""",
    "src/app/page.tsx": """export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>ORACLE</h1>
      <p>Your assistant is ready for development.</p>
    </main>
  );
}
""",
}

def main():
    created = 0
    skipped = 0

    for directory in DIRECTORIES:
        (ROOT / directory).mkdir(parents=True, exist_ok=True)

    for filename in FILES:
        path = ROOT / filename

        if path.exists():
            print(f"SKIPPED: {filename}")
            skipped += 1
            continue

        path.parent.mkdir(parents=True, exist_ok=True)

        if filename.endswith(".svg"):
            content = (
                '<svg xmlns="http://www.w3.org/2000/svg" '
                'viewBox="0 0 100 100"></svg>\n'
            )
        elif filename.endswith((".ts", ".tsx")):
            content = (
                "// ORACLE starter placeholder. Implement and test this module.\n"
            )
        else:
            content = STARTERS.get(filename, "")

        path.write_text(content, encoding="utf-8")
        print(f"CREATED: {filename}")
        created += 1

    print("\nORACLE structure created.")
    print(f"Location: {ROOT}")
    print(f"New files: {created}")
    print(f"Existing files preserved: {skipped}")
    print("Most modules are placeholders, not working features.")

if __name__ == "__main__":
    main()
