import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const STATUS = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  NOT_FOUND: "NOT_FOUND",
} as const;

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const DEFAULT_COOKIE_CONFIG: Omit<ResponseCookie, "name" | "value"> = {
  path: "/",
  httpOnly: true,
  secure: true,
};

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_MONTH = 30;
export const DAYS_PER_WEEK = 7;

export const ACCESS_TOKEN_EXPIRY = SECONDS_PER_MINUTE;
export const REFRESH_TOKEN_EXPIRY =
  DAYS_PER_WEEK * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
export const RESET_PASSWORD_EXPIRY =
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const REDIRECT_URL_IF_AUTHORIZED = "/";
export const REDIRECT_URL_IF_UNAUTHORIZED = "/login";

export const roles = ["user", "admin"] as const;
export const defaultRole: (typeof roles)[number] = "user";

export const productStatus = ["draft", "active", "archived"] as const;
export const defaultProductStatus: (typeof productStatus)[number] = "draft";

export const DATATABLE_PAGE_SIZE = 15;
export const MIN_PRICE_RANGE = 0;
export const MAX_PRICE_RANGE = 20_000;

export const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".ico",
  ".apng",
  ".avif",
  ".tif",
  ".tiff",
] as const;

export const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".mpeg",
  ".ogv",
  ".ogx",
  ".webm",
  ".ts",
  ".3gp",
  ".3g2",
] as const;

export const AUDIO_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".aac",
  ".mid",
  ".midi",
  ".oga",
  ".opus",
  ".weba",
  ".cda",
  ".bin",
] as const;

export const DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt",
  ".csv",
  ".json",
  ".abw",
  ".azw",
  ".epub",
  ".htm",
  ".html",
  ".ics",
  ".jar",
  ".jsonld",
  ".mjs",
  ".odt",
  ".ods",
  ".odp",
  ".php",
  ".ppt",
  ".pptx",
  ".rtf",
  ".sh",
  ".xhtml",
  ".xml",
  ".xul",
  ".vsd",
] as const;

export const ARCHIVE_EXTENSIONS = [
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".bz",
  ".bz2",
  ".arc",
] as const;

export const IMAGE_MIME_TO_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/apng": ".apng",
  "image/avif": ".avif",
  "image/tiff": ".tiff",
  "image/bmp": ".bmp",
  "image/svg+xml": ".svg",
  "image/vnd.microsoft.icon": ".ico",
} as const;

export const DOCUMENT_MIME_TO_EXTENSIONS = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "application/json": ".json",
  "application/epub+zip": ".epub",
  "application/x-abiword": ".abw",
  "application/vnd.amazon.ebook": ".azw",
  "application/vnd.oasis.opendocument.text": ".odt",
  "application/vnd.oasis.opendocument.spreadsheet": ".ods",
  "application/vnd.oasis.opendocument.presentation": ".odp",
  "application/x-httpd-php": ".php",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
  "application/rtf": ".rtf",
  "application/x-sh": ".sh",
  "application/xhtml+xml": ".xhtml",
  "application/xml": ".xml",
  "application/vnd.mozilla.xul+xml": ".xul",
  "application/vnd.visio": ".vsd",
  "text/html": ".html",
  "application/ld+json": ".jsonld",
  "text/calendar": ".ics",
} as const;

export const VIDEO_MIME_TO_EXTENSION = {
  "video/mp4": ".mp4",
  "video/x-matroska": ".mkv",
  "video/quicktime": ".mov",
  "video/ogg": ".ogv",
  "video/webm": ".webm",
  "video/mp2t": ".ts",
  "video/x-msvideo": ".avi",
  "video/3gpp": ".3gp",
  "video/3gpp2": ".3g2",
} as const;

export const AUDIO_MIME_TO_EXTENSION = {
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
  "audio/aac": ".aac",
  "audio/x-midi": ".midi",
  "audio/midi": ".midi",
  "audio/ogg": ".oga",
  "audio/webm": ".weba",
} as const;

export const ARCHIVE_MIME_TO_EXTENSION = {
  "application/zip": ".zip",
  "application/x-rar-compressed": ".rar",
  "application/x-7z-compressed": ".7z",
  "application/x-tar": ".tar",
  "application/gzip": ".gz",
  "application/x-bzip": ".bz",
  "application/x-bzip2": ".bz2",
  "application/x-freearc": ".arc",
} as const;

export const MIME_TO_EXTENSION: Record<string, string> = {
  ...IMAGE_MIME_TO_EXTENSIONS,
  ...DOCUMENT_MIME_TO_EXTENSIONS,
  ...VIDEO_MIME_TO_EXTENSION,
  ...AUDIO_MIME_TO_EXTENSION,
  ...ARCHIVE_MIME_TO_EXTENSION,
};
