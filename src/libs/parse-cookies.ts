interface CookieAttributes {
  maxAge?: number;
  domain?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  expires?: Date;
}

interface Cookie {
  value: string;
  attributes: CookieAttributes;
}

type ParsedCookies = Record<string, Cookie | undefined>;

export function parseCookies(cookieString: string): ParsedCookies {
  return cookieString
    .split(/,\s(?=[^;]+?=)/)
    .reduce((acc: ParsedCookies, cookie) => {
      const [nameValue, ...attributes] = cookie.split("; ");
      const [name, value] = nameValue.split("=");

      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(value);

      const cookieAttributes = attributes.reduce(
        (attrAcc: CookieAttributes, attr) => {
          const [key, attrValue] = attr.split("=");
          const decodedKey = decodeURIComponent(key.toLowerCase().trim());
          const decodedAttrValue = attrValue
            ? decodeURIComponent(attrValue.trim())
            : undefined;

          switch (decodedKey) {
            case "max-age":
              attrAcc.maxAge = Number(decodedAttrValue);
              break;
            case "expires":
              attrAcc.expires = decodedAttrValue
                ? new Date(decodedAttrValue)
                : undefined;
              break;
            case "domain":
              attrAcc.domain = decodedAttrValue;
              break;
            case "path":
              attrAcc.path = decodedAttrValue;
              break;
            case "httponly":
              attrAcc.httpOnly = true;
              break;
            case "secure":
              attrAcc.secure = true;
              break;
            case "samesite":
              attrAcc.sameSite = decodedAttrValue as "lax" | "strict" | "none";
              break;
          }
          return attrAcc;
        },
        {},
      );

      acc[decodedName] = { value: decodedValue, attributes: cookieAttributes };
      return acc;
    }, {});
}
